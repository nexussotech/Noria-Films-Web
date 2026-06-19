const db          = require('../config/db')
const { send, t } = require('../services/email.service')
const env         = require('../config/env')
const R           = require('../utils/response')

// GET /api/appointments/available-slots
exports.availableSlots = async (req, res) => {
  try {
    // Exclude: unavailable, past dates, blocked dates, slots already booked (non-cancelled)
    const [rows] = await db.query(
      `SELECT sl.id,
              DATE_FORMAT(sl.date, '%Y-%m-%d') AS date,
              sl.start_time, sl.end_time, sl.is_available
       FROM availability_slots sl
       WHERE sl.is_available = 1
         AND (sl.date > CURDATE() OR (sl.date = CURDATE() AND sl.start_time > CURTIME()))
         AND sl.date NOT IN (SELECT date FROM blocked_dates)
         AND sl.id NOT IN (
           SELECT slot_id FROM appointments
           WHERE status IN ('pending','confirmed')
         )
       ORDER BY sl.date, sl.start_time`
    )
    return R.ok(res, rows)
  } catch (err) { return R.serverError(res, err) }
}

// POST /api/appointments
exports.create = async (req, res) => {
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()

    const { quote_id, slot_id, meeting_type, notes } = req.body
    const userId = req.user.id

    // Verify quote belongs to user and is in 'generated' status (not already scheduled)
    const [[quote]] = await conn.query(
      'SELECT id, status FROM quotes WHERE id=? AND user_id=?',
      [quote_id, userId]
    )
    if (!quote)               return R.notFound(res, 'Cotización no encontrada')
    if (quote.status === 'cancelled')  return R.conflict(res, 'La cotización fue cancelada')
    if (quote.status === 'scheduled')  return R.conflict(res, 'Esta cotización ya tiene una cita agendada')
    if (quote.status !== 'generated')  return R.conflict(res, 'La cotización no está en estado válido para agendar')

    // Verify slot is available (locked for update to prevent race condition)
    const [[slot]] = await conn.query(
      'SELECT * FROM availability_slots WHERE id=? AND is_available=1 FOR UPDATE',
      [slot_id]
    )
    if (!slot) return R.conflict(res, 'El horario seleccionado ya no está disponible')

    // Verify date is not blocked
    const [[blocked]] = await conn.query('SELECT id FROM blocked_dates WHERE date=?', [slot.date])
    if (blocked) return R.conflict(res, 'Fecha bloqueada por el estudio')

    // Explicit pre-check for duplicate appointment on same slot
    const [[existing]] = await conn.query(
      "SELECT id FROM appointments WHERE slot_id=? AND status IN ('pending','confirmed')",
      [slot_id]
    )
    if (existing) return R.conflict(res, 'El horario ya fue reservado')

    // Normalize date — mysql2 returns DATE columns as JS Date objects
    const slotDateStr = slot.date instanceof Date
      ? slot.date.toISOString().slice(0, 10)
      : String(slot.date).slice(0, 10)

    // Create appointment
    const [result] = await conn.query(
      `INSERT INTO appointments
         (user_id, quote_id, slot_id, appointment_date, start_time, end_time, meeting_type, notes)
       VALUES (?,?,?,?,?,?,?,?)`,
      [userId, quote_id, slot_id, slotDateStr, slot.start_time, slot.end_time,
       meeting_type || 'virtual', notes || null]
    )

    // Mark slot as taken
    await conn.query('UPDATE availability_slots SET is_available=0 WHERE id=?', [slot_id])

    // Mark quote as scheduled
    await conn.query('UPDATE quotes SET status="scheduled" WHERE id=?', [quote_id])

    // Schedule reminder
    const reminderAt = new Date(`${slotDateStr}T${slot.start_time}`)
    reminderAt.setHours(reminderAt.getHours() - 24)
    await conn.query(
      'INSERT INTO appointment_reminders (appointment_id, reminder_type, send_at) VALUES (?,?,?)',
      [result.insertId, '24h', reminderAt]
    )

    await conn.commit()

    // Send confirmation emails (outside transaction — fire and forget style)
    const [[user]]  = await db.query('SELECT full_name, email, phone FROM users WHERE id=?', [userId])
    const [[qfull]] = await db.query(
      'SELECT s.name AS service_name, q.estimated_price FROM quotes q JOIN services s ON s.id=q.service_id WHERE q.id=?',
      [quote_id]
    )
    const dateStr  = new Date(`${slotDateStr}T00:00:00`).toLocaleDateString('es-MX', { dateStyle: 'long' })
    const startStr = String(slot.start_time).slice(0, 5)
    const endStr   = String(slot.end_time).slice(0, 5)
    const mType    = meeting_type || 'virtual'
    const svcName  = qfull?.service_name ?? '—'
    const price    = qfull?.estimated_price ?? null

    send({ to: user.email, ...t.appointmentBooked(
      user.full_name, dateStr, startStr, endStr, mType, svcName, price, user.phone, notes
    )}).catch((e) => console.error('[MAIL appt-user]', e.message))
    if (env.CLIENT_EMAIL_TO) {
      send({ to: env.CLIENT_EMAIL_TO, ...t.appointmentNotifyAdmin(
        user.full_name, user.email, dateStr, startStr, mType, svcName, price, user.phone, notes
      )}).catch((e) => console.error('[MAIL appt-admin]', e.message))
    }

    return R.created(res, {
      id:               result.insertId,
      appointment_date: slotDateStr,
      start_time:       slot.start_time,
      end_time:         slot.end_time,
      meeting_type:     mType,
      message:          'Cita agendada correctamente',
    })
  } catch (err) {
    await conn.rollback()
    if (err.code === 'ER_DUP_ENTRY') return R.conflict(res, 'El horario ya fue reservado')
    return R.serverError(res, err)
  } finally {
    conn.release()
  }
}

// GET /api/appointments/my
exports.myAppointments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.quote_id,
              DATE_FORMAT(a.appointment_date, '%Y-%m-%d') AS appointment_date,
              a.start_time, a.end_time,
              a.status, a.meeting_type, a.notes, a.created_at,
              s.name AS service_name, s.icon AS service_icon,
              q.estimated_price
       FROM appointments a
       JOIN quotes   q ON q.id = a.quote_id
       JOIN services s ON s.id = q.service_id
       WHERE a.user_id = ?
       ORDER BY a.appointment_date DESC, a.start_time DESC`,
      [req.user.id]
    )
    return R.ok(res, rows)
  } catch (err) { return R.serverError(res, err) }
}

// GET /api/appointments — admin
exports.listAll = async (req, res) => {
  try {
    const { status, user_id } = req.query
    let sql = `
      SELECT a.id, a.quote_id,
             DATE_FORMAT(a.appointment_date, '%Y-%m-%d') AS appointment_date,
             a.start_time, a.end_time,
             a.status, a.meeting_type, a.notes, a.created_at,
             u.full_name, u.email,
             s.name AS service_name
      FROM appointments a
      JOIN users    u ON u.id = a.user_id
      JOIN quotes   q ON q.id = a.quote_id
      JOIN services s ON s.id = q.service_id
      WHERE 1=1`
    const params = []
    if (status)  { sql += ' AND a.status=?';  params.push(status) }
    if (user_id) { sql += ' AND a.user_id=?'; params.push(user_id) }
    sql += ' ORDER BY a.appointment_date DESC, a.start_time DESC'
    const [rows] = await db.query(sql, params)
    return R.ok(res, rows)
  } catch (err) { return R.serverError(res, err) }
}

// PATCH /api/appointments/:id/status — admin
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed']
    if (!allowed.includes(status)) return R.badRequest(res, 'Estado inválido')

    await db.query('UPDATE appointments SET status=? WHERE id=?', [status, id])

    // Release slot and revert quote if cancelled
    if (status === 'cancelled') {
      const [[appt]] = await db.query('SELECT slot_id, quote_id FROM appointments WHERE id=?', [id])
      if (appt) {
        await db.query('UPDATE availability_slots SET is_available=1 WHERE id=?', [appt.slot_id])
        await db.query('UPDATE quotes SET status="generated" WHERE id=?', [appt.quote_id])
        await db.query(
          'UPDATE appointment_reminders SET status="failed" WHERE appointment_id=? AND status="pending"',
          [id]
        )
      }
    }
    return R.ok(res, { message: 'Cita actualizada' })
  } catch (err) { return R.serverError(res, err) }
}

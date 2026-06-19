const db          = require('../config/db')
const R           = require('../utils/response')
const { send, t } = require('../services/email.service')

// ── Availability ──────────────────────────────────────────

// POST /api/admin/availability
exports.createSlot = async (req, res) => {
  try {
    const { date, start_time, end_time } = req.body

    // No permitir crear slots en fechas pasadas
    const today = new Date().toISOString().slice(0, 10)
    if (date < today) return R.badRequest(res, 'No se pueden crear horarios en fechas pasadas')

    // Validar que end_time sea posterior a start_time
    if (end_time <= start_time) return R.badRequest(res, 'La hora de fin debe ser posterior a la hora de inicio')

    await db.query(
      'INSERT INTO availability_slots (date,start_time,end_time,created_by_admin_id) VALUES (?,?,?,?)',
      [date, start_time, end_time, req.user.id]
    )
    return R.created(res, { message: 'Slot creado' })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return R.conflict(res, 'Ya existe un slot en esa fecha y hora')
    return R.serverError(res, err)
  }
}

// GET /api/admin/availability
exports.listSlots = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, DATE_FORMAT(date,'%Y-%m-%d') AS date,
              start_time, end_time, is_available, created_at
       FROM availability_slots ORDER BY date, start_time`
    )
    return R.ok(res, rows)
  } catch (err) { return R.serverError(res, err) }
}

// DELETE /api/admin/availability/:id
exports.deleteSlot = async (req, res) => {
  try {
    const [[appt]] = await db.query(
      "SELECT id FROM appointments WHERE slot_id=? AND status IN ('pending','confirmed')",
      [req.params.id]
    )
    if (appt) return R.conflict(res, 'El slot tiene una cita activa, cancela la cita primero')
    // Eliminar citas canceladas/completadas que referencian este slot
    await db.query("DELETE FROM appointments WHERE slot_id=? AND status IN ('cancelled','completed')", [req.params.id])
    await db.query('DELETE FROM availability_slots WHERE id=?', [req.params.id])
    return R.ok(res, { message: 'Slot eliminado' })
  } catch (err) { return R.serverError(res, err) }
}

// ── Blocked dates ──────────────────────────────────────────

// POST /api/admin/blocked-dates
exports.blockDate = async (req, res) => {
  try {
    const { date, reason } = req.body
    await db.query(
      'INSERT INTO blocked_dates (date,reason,created_by_admin_id) VALUES (?,?,?)',
      [date, reason || null, req.user.id]
    )
    return R.created(res, { message: 'Fecha bloqueada' })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return R.conflict(res, 'Fecha ya bloqueada')
    return R.serverError(res, err)
  }
}

// GET /api/admin/blocked-dates
exports.listBlocked = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, DATE_FORMAT(date,'%Y-%m-%d') AS date, reason, created_at FROM blocked_dates ORDER BY date"
    )
    return R.ok(res, rows)
  } catch (err) { return R.serverError(res, err) }
}

// DELETE /api/admin/blocked-dates/:id
exports.unblockDate = async (req, res) => {
  try {
    await db.query('DELETE FROM blocked_dates WHERE id=?', [req.params.id])
    return R.ok(res, { message: 'Fecha desbloqueada' })
  } catch (err) { return R.serverError(res, err) }
}

// ── Contact reply ──────────────────────────────────────────

// POST /api/admin/contact/:id/reply
exports.replyToContact = async (req, res) => {
  try {
    const { reply_text } = req.body
    if (!reply_text || !reply_text.trim()) return R.badRequest(res, 'El texto de la respuesta es requerido')

    const [[msg]] = await db.query('SELECT * FROM contact_messages WHERE id=?', [req.params.id])
    if (!msg) return R.notFound(res, 'Mensaje no encontrado')

    send({ to: msg.email, ...t.contactReply(msg.full_name, msg.subject, reply_text.trim()) }).catch((e) => console.error('[MAIL contact-reply]', e.message))
    await db.query('UPDATE contact_messages SET status="answered" WHERE id=?', [req.params.id])

    return R.ok(res, { message: 'Respuesta enviada correctamente' })
  } catch (err) { return R.serverError(res, err) }
}

// ── Dashboard stats ────────────────────────────────────────

// GET /api/admin/dashboard/stats
exports.stats = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM users WHERE role='user')                             AS total_users,
        (SELECT COUNT(*) FROM quotes)                                               AS total_quotes,
        (SELECT COUNT(DISTINCT user_id) FROM quotes)                                AS users_with_quotes,
        (SELECT COUNT(DISTINCT user_id) FROM appointments)                          AS users_with_appointments,
        (SELECT COUNT(*) FROM appointments WHERE status='pending')                  AS pending_appointments,
        (SELECT COUNT(*) FROM appointments WHERE appointment_date=CURDATE())        AS today_appointments,
        (SELECT COUNT(*) FROM contact_messages WHERE status='new')                  AS new_messages,
        (SELECT COUNT(*) FROM quotes WHERE status='generated')                      AS pending_quotes
    `)
    const s = results[0]
    const convRate = s.total_users > 0
      ? +((s.users_with_appointments / s.total_users) * 100).toFixed(1) : 0

    return R.ok(res, {
      total_users:              s.total_users,
      total_quotes:             s.total_quotes,
      users_with_quotes:        s.users_with_quotes,
      users_with_appointments:  s.users_with_appointments,
      conversion_rate:          convRate,
      pending_quotes:           s.pending_quotes,
      pending_appointments:     s.pending_appointments,
      today_appointments:       s.today_appointments,
      new_messages:             s.new_messages,
    })
  } catch (err) { return R.serverError(res, err) }
}

const cron         = require('node-cron')
const db           = require('../config/db')
const { send, t }  = require('./email.service')

// Corre cada 10 minutos
cron.schedule('*/10 * * * *', async () => {
  try {
    // Condiciones para enviar recordatorio:
    // 1. Estado del recordatorio: pending
    // 2. Hora de envío ya llegó: send_at <= NOW()
    // 3. La cita es futura o de hoy (no enviar para citas ya pasadas)
    // 4. La cita no está cancelada ni completada
    const [pending] = await db.query(
      `SELECT r.id, r.reminder_type,
              u.full_name, u.email,
              DATE_FORMAT(a.appointment_date, '%Y-%m-%d') AS appointment_date,
              a.start_time, a.meeting_type, a.status AS appt_status,
              s.name AS service_name
       FROM appointment_reminders r
       JOIN appointments a ON a.id = r.appointment_id
       JOIN users         u ON u.id = a.user_id
       JOIN quotes        q ON q.id = a.quote_id
       JOIN services      s ON s.id = q.service_id
       WHERE r.status = 'pending'
         AND r.send_at <= NOW()
         AND a.appointment_date >= CURDATE()
         AND a.status IN ('pending','confirmed')`
    )

    if (!pending.length) return

    console.log(`[CRON] Procesando ${pending.length} recordatorio(s)`)

    for (const r of pending) {
      const date  = new Date(r.appointment_date + 'T00:00:00').toLocaleDateString('es-MX', { dateStyle: 'long' })
      const start = String(r.start_time).slice(0, 5)
      const tpl   = t.appointmentReminder(r.full_name, date, start, r.meeting_type, r.service_name)
      try {
        await send({ to: r.email, ...tpl })
        await db.query(
          'UPDATE appointment_reminders SET status="sent", sent_at=NOW() WHERE id=?',
          [r.id]
        )
        console.log(`[CRON] Recordatorio enviado → ${r.email} (cita: ${r.appointment_date} ${start})`)
      } catch (mailErr) {
        await db.query('UPDATE appointment_reminders SET status="failed" WHERE id=?', [r.id])
        console.error(`[CRON] Fallo al enviar a ${r.email}:`, mailErr.message)
      }
    }
  } catch (err) {
    console.error('[CRON] Error general:', err.message)
  }
})

const db          = require('../config/db')
const R           = require('../utils/response')
const { send, t } = require('../services/email.service')

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
        (SELECT COUNT(*) FROM contact_messages WHERE status='new')                  AS new_messages,
        (SELECT COUNT(*) FROM quotes WHERE status='generated')                      AS pending_quotes
    `)
    const s = results[0]
    const convRate = s.total_users > 0
      ? +((s.users_with_quotes / s.total_users) * 100).toFixed(1) : 0

    return R.ok(res, {
      total_users:       s.total_users,
      total_quotes:      s.total_quotes,
      users_with_quotes: s.users_with_quotes,
      conversion_rate:   convRate,
      pending_quotes:    s.pending_quotes,
      new_messages:      s.new_messages,
    })
  } catch (err) { return R.serverError(res, err) }
}

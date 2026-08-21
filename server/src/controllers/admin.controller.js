const db = require('../config/db')
const R  = require('../utils/response')

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

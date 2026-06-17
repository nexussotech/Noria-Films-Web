const db = require('../config/db')
const R  = require('../utils/response')

// GET /api/users — lista con embudo comercial
exports.list = async (req, res) => {
  try {
    const { search, hasQuote, hasAppointment } = req.query
    let sql = `
      SELECT u.id, u.full_name, u.email, u.phone, u.role, u.status, u.created_at,
             COUNT(DISTINCT q.id) AS quote_count,
             COUNT(DISTINCT a.id) AS appointment_count
      FROM users u
      LEFT JOIN quotes q       ON q.user_id = u.id
      LEFT JOIN appointments a ON a.user_id = u.id
      WHERE u.role = 'user'`
    const params = []

    if (search) {
      sql += ' AND (u.full_name LIKE ? OR u.email LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }
    sql += ' GROUP BY u.id'
    const having = []
    if (hasQuote === 'true')       having.push('quote_count > 0')
    if (hasAppointment === 'true') having.push('appointment_count > 0')
    if (having.length) sql += ' HAVING ' + having.join(' AND ')
    sql += ' ORDER BY u.created_at DESC'

    const [rows] = await db.query(sql, params)
    return R.ok(res, rows)
  } catch (err) { return R.serverError(res, err) }
}

// GET /api/users/:id — detalle con historial
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params
    const [users] = await db.query(
      'SELECT id,full_name,email,phone,role,status,created_at FROM users WHERE id=?', [id]
    )
    if (!users.length) return R.notFound(res, 'Usuario no encontrado')

    const [quotes] = await db.query(
      `SELECT q.id, s.name AS service, q.project_type, q.status, q.estimated_price, q.created_at
       FROM quotes q JOIN services s ON s.id=q.service_id
       WHERE q.user_id=? ORDER BY q.created_at DESC`, [id]
    )
    const [appointments] = await db.query(
      `SELECT a.id, a.appointment_date, a.start_time, a.end_time, a.status, a.meeting_type
       FROM appointments a WHERE a.user_id=? ORDER BY a.appointment_date DESC`, [id]
    )
    return R.ok(res, { user: users[0], quotes, appointments })
  } catch (err) { return R.serverError(res, err) }
}

// PATCH /api/users/:id/status — soft delete (active/inactive)
exports.setStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!['active','inactive'].includes(status)) return R.badRequest(res, 'Estado inválido')
    await db.query('UPDATE users SET status=? WHERE id=? AND role="user"', [status, id])
    return R.ok(res, { message: `Usuario ${status === 'active' ? 'activado' : 'desactivado'}` })
  } catch (err) { return R.serverError(res, err) }
}

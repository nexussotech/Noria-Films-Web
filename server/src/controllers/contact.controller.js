const db = require('../config/db')
const R  = require('../utils/response')

// POST /api/contact — público
exports.create = async (req, res) => {
  try {
    const { full_name, email, phone, subject, message } = req.body
    await db.query(
      'INSERT INTO contact_messages (full_name,email,phone,subject,message) VALUES (?,?,?,?,?)',
      [full_name, email, phone || null, subject, message]
    )
    return R.created(res, { message: 'Mensaje enviado' })
  } catch (err) { return R.serverError(res, err) }
}

// GET /api/contact — admin
exports.listAll = async (req, res) => {
  try {
    const { status } = req.query
    let sql = 'SELECT * FROM contact_messages WHERE 1=1'
    const params = []
    if (status) { sql += ' AND status=?'; params.push(status) }
    sql += ' ORDER BY created_at DESC'
    const [rows] = await db.query(sql, params)
    return R.ok(res, rows)
  } catch (err) { return R.serverError(res, err) }
}

// PATCH /api/contact/:id/status — admin
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body
    if (!['new','read','archived','answered'].includes(status)) return R.badRequest(res, 'Estado inválido')
    await db.query('UPDATE contact_messages SET status=? WHERE id=?', [status, req.params.id])
    return R.ok(res, { message: 'Estado actualizado' })
  } catch (err) { return R.serverError(res, err) }
}

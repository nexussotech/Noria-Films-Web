const db = require('../config/db')
const R  = require('../utils/response')

exports.list = async (req, res) => {
  try {
    const isAdmin = req.user?.role === 'admin'
    const sql = isAdmin
      ? 'SELECT * FROM services ORDER BY id'
      : 'SELECT * FROM services WHERE active=1 ORDER BY id'
    const [rows] = await db.query(sql)
    return R.ok(res, rows)
  } catch (err) { return R.serverError(res, err) }
}

exports.create = async (req, res) => {
  try {
    const { name, description, base_price, icon, image_url } = req.body
    const [r] = await db.query(
      'INSERT INTO services (name,description,base_price,icon,image_url) VALUES (?,?,?,?,?)',
      [name, description, base_price || null, icon || null, image_url || null]
    )
    return R.created(res, { id: r.insertId, message: 'Servicio creado' })
  } catch (err) { return R.serverError(res, err) }
}

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, base_price, icon, image_url, active } = req.body
    await db.query(
      'UPDATE services SET name=?,description=?,base_price=?,icon=?,image_url=?,active=? WHERE id=?',
      [name, description, base_price ?? null, icon ?? null, image_url ?? null, active ? 1 : 0, id]
    )
    return R.ok(res, { message: 'Servicio actualizado' })
  } catch (err) { return R.serverError(res, err) }
}

exports.remove = async (req, res) => {
  try {
    await db.query('UPDATE services SET active=0 WHERE id=?', [req.params.id])
    return R.ok(res, { message: 'Servicio desactivado' })
  } catch (err) { return R.serverError(res, err) }
}

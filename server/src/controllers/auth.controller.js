const bcrypt       = require('bcryptjs')
const db           = require('../config/db')
const { sign }     = require('../config/jwt')
const { send, t }  = require('../services/email.service')
const R            = require('../utils/response')

exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body
    const [existing] = await db.query('SELECT id FROM users WHERE email=?', [email])
    if (existing.length) return R.conflict(res, 'El correo ya está registrado')

    const password_hash = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (full_name,email,password_hash,phone) VALUES (?,?,?,?)',
      [full_name, email, password_hash, phone || null]
    )

    send({ to: email, ...t.welcome(full_name) }).catch((e) => console.error('[MAIL welcome]', e.message))

    const token = sign({ id: result.insertId, role: 'user' })
    return R.created(res, { token, user: { id: result.insertId, full_name, email, role: 'user' } })
  } catch (err) { return R.serverError(res, err) }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await db.query(
      'SELECT id,full_name,email,password_hash,role,status FROM users WHERE email=?',
      [email]
    )
    const user = rows[0]
    if (!user) return R.unauthorized(res, 'Credenciales inválidas')
    if (user.status === 'inactive') return R.forbidden(res, 'Cuenta desactivada')

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return R.unauthorized(res, 'Credenciales inválidas')

    const token = sign({ id: user.id, role: user.role })
    return R.ok(res, {
      token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
    })
  } catch (err) { return R.serverError(res, err) }
}

exports.me = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id,full_name,email,phone,role,status,created_at FROM users WHERE id=?',
      [req.user.id]
    )
    if (!rows.length) return R.notFound(res, 'Usuario no encontrado')
    return R.ok(res, rows[0])
  } catch (err) { return R.serverError(res, err) }
}

exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone } = req.body
    await db.query('UPDATE users SET full_name=?,phone=? WHERE id=?',
      [full_name, phone || null, req.user.id])
    return R.ok(res, { message: 'Perfil actualizado' })
  } catch (err) { return R.serverError(res, err) }
}

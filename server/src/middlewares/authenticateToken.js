const { verify }      = require('../config/jwt')
const { unauthorized } = require('../utils/response')

const authenticateToken = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return unauthorized(res, 'Token requerido')
  try {
    req.user = verify(auth.slice(7))
    next()
  } catch {
    return unauthorized(res, 'Token inválido o expirado')
  }
}

module.exports = authenticateToken

const { forbidden } = require('../utils/response')

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return forbidden(res, `Se requiere rol: ${roles.join(' o ')}`)
  }
  next()
}

module.exports = authorizeRoles

const router         = require('express').Router()
const { body }       = require('express-validator')
const ctrl           = require('../controllers/services.controller')
const auth           = require('../middlewares/authenticateToken')
const authorizeRoles = require('../middlewares/authorizeRoles')
const validate       = require('../middlewares/validate')
const { verify }     = require('../config/jwt')

// Inyección opcional de usuario para que admin vea todos
router.get('/', (req, res, next) => {
  const token = req.headers.authorization?.slice(7)
  if (token) { try { req.user = verify(token) } catch {} }
  next()
}, ctrl.list)

const adminMiddleware = [auth, authorizeRoles('admin')]
const serviceValidation = [
  body('name').trim().notEmpty().withMessage('Nombre requerido'),
  body('description').trim().notEmpty().withMessage('Descripción requerida'),
  validate,
]

router.post('/',      ...adminMiddleware, ...serviceValidation, ctrl.create)
router.put('/:id',    ...adminMiddleware, ...serviceValidation, ctrl.update)
router.delete('/:id', ...adminMiddleware, ctrl.remove)

module.exports = router

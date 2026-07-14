const router         = require('express').Router()
const { body }       = require('express-validator')
const ctrl           = require('../controllers/contact.controller')
const auth           = require('../middlewares/authenticateToken')
const authorizeRoles = require('../middlewares/authorizeRoles')
const validate       = require('../middlewares/validate')

// Público — cualquiera puede enviar mensaje
router.post('/',
  body('full_name').trim().notEmpty().withMessage('Nombre requerido').isLength({ max: 120 }).withMessage('Nombre muy largo'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('subject').trim().notEmpty().withMessage('Asunto requerido').isLength({ max: 200 }).withMessage('Asunto muy largo'),
  body('message').trim().notEmpty().withMessage('El mensaje no puede estar vacío').isLength({ max: 2000 }).withMessage('Mensaje muy largo (máx. 2000 caracteres)'),
  body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 30 }).withMessage('Teléfono muy largo'),
  validate, ctrl.create
)

router.get('/',           auth, authorizeRoles('admin'), ctrl.listAll)
router.patch('/:id/status', auth, authorizeRoles('admin'),
  body('status').isIn(['new','read','archived']),
  validate, ctrl.updateStatus
)

module.exports = router

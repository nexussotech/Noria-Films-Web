const router         = require('express').Router()
const { body }       = require('express-validator')
const ctrl           = require('../controllers/contact.controller')
const auth           = require('../middlewares/authenticateToken')
const authorizeRoles = require('../middlewares/authorizeRoles')
const validate       = require('../middlewares/validate')

// Público — cualquiera puede enviar mensaje
router.post('/',
  body('full_name').trim().notEmpty().withMessage('Nombre requerido'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('subject').trim().notEmpty().withMessage('Asunto requerido'),
  body('message').trim().isLength({ min: 10 }).withMessage('Mensaje muy corto'),
  validate, ctrl.create
)

router.get('/',           auth, authorizeRoles('admin'), ctrl.listAll)
router.patch('/:id/status', auth, authorizeRoles('admin'),
  body('status').isIn(['new','read','archived']),
  validate, ctrl.updateStatus
)

module.exports = router

const router         = require('express').Router()
const { body }       = require('express-validator')
const rateLimit      = require('express-rate-limit')
const ctrl           = require('../controllers/contact.controller')
const auth           = require('../middlewares/authenticateToken')
const authorizeRoles = require('../middlewares/authorizeRoles')
const validate       = require('../middlewares/validate')

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados mensajes enviados. Intenta más tarde.' },
})

// Público — cualquiera puede enviar mensaje
router.post('/',
  contactLimiter,
  body('full_name').trim().notEmpty().withMessage('Nombre requerido').isLength({ max: 120 }).withMessage('Nombre muy largo'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('subject').trim().notEmpty().withMessage('Asunto requerido').isLength({ max: 200 }).withMessage('Asunto muy largo'),
  body('message').trim().notEmpty().withMessage('El mensaje no puede estar vacío').isLength({ max: 2000 }).withMessage('Mensaje muy largo (máx. 2000 caracteres)'),
  body('phone').trim().notEmpty().withMessage('Teléfono requerido')
    .matches(/^[+\d\s\-().]{7,20}$/).withMessage('Teléfono inválido'),
  validate, ctrl.create
)

router.get('/',           auth, authorizeRoles('admin'), ctrl.listAll)
router.patch('/:id/status', auth, authorizeRoles('admin'),
  body('status').isIn(['new','read','archived','answered']),
  validate, ctrl.updateStatus
)

module.exports = router

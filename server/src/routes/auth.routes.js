const router      = require('express').Router()
const { body }    = require('express-validator')
const rateLimit   = require('express-rate-limit')
const ctrl        = require('../controllers/auth.controller')
const auth        = require('../middlewares/authenticateToken')
const validate    = require('../middlewares/validate')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Espera 15 minutos e intenta de nuevo.' },
})

router.post('/register',
  authLimiter,
  body('full_name').trim().notEmpty().withMessage('Nombre requerido').isLength({ max: 120 }).withMessage('Nombre muy largo'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
  body('phone').trim().notEmpty().withMessage('Teléfono requerido')
    .matches(/^[+\d\s\-().]{7,20}$/).withMessage('Teléfono inválido'),
  validate, ctrl.register
)
router.post('/login',
  authLimiter,
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Contraseña requerida'),
  validate, ctrl.login
)
router.get('/me',  auth, ctrl.me)
router.put('/me',  auth,
  body('full_name').trim().notEmpty().withMessage('Nombre requerido').isLength({ max: 120 }).withMessage('Nombre muy largo'),
  body('phone').optional({ values: 'falsy' }).trim()
    .matches(/^[+\d\s\-().]{7,20}$/).withMessage('Teléfono inválido'),
  validate, ctrl.updateProfile
)

module.exports = router

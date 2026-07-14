const router   = require('express').Router()
const { body } = require('express-validator')
const ctrl     = require('../controllers/auth.controller')
const auth     = require('../middlewares/authenticateToken')
const validate = require('../middlewares/validate')

router.post('/register',
  body('full_name').trim().notEmpty().withMessage('Nombre requerido').isLength({ max: 120 }).withMessage('Nombre muy largo'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
  body('phone').optional({ values: 'falsy' }).trim()
    .matches(/^[+\d\s\-().]{7,20}$/).withMessage('Teléfono inválido'),
  validate, ctrl.register
)
router.post('/login',
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

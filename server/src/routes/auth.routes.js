const router   = require('express').Router()
const { body } = require('express-validator')
const ctrl     = require('../controllers/auth.controller')
const auth     = require('../middlewares/authenticateToken')
const validate = require('../middlewares/validate')

router.post('/register',
  body('full_name').trim().notEmpty().withMessage('Nombre requerido'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
  validate, ctrl.register
)
router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate, ctrl.login
)
router.get('/me',  auth, ctrl.me)
router.put('/me',  auth,
  body('full_name').trim().notEmpty(),
  validate, ctrl.updateProfile
)

module.exports = router

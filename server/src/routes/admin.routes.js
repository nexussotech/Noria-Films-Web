const router         = require('express').Router()
const { body }       = require('express-validator')
const ctrl           = require('../controllers/admin.controller')
const auth           = require('../middlewares/authenticateToken')
const authorizeRoles = require('../middlewares/authorizeRoles')
const validate       = require('../middlewares/validate')

// Todas las rutas de este router requieren admin
router.use(auth, authorizeRoles('admin'))

// Contact reply
router.post('/contact/:id/reply',
  body('reply_text').trim().notEmpty().withMessage('El texto de respuesta es requerido'),
  validate, ctrl.replyToContact
)

// Dashboard
router.get('/dashboard/stats', ctrl.stats)

module.exports = router

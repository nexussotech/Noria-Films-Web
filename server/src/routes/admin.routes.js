const router         = require('express').Router()
const { body }       = require('express-validator')
const ctrl           = require('../controllers/admin.controller')
const auth           = require('../middlewares/authenticateToken')
const authorizeRoles = require('../middlewares/authorizeRoles')
const validate       = require('../middlewares/validate')

// Todas las rutas de este router requieren admin
router.use(auth, authorizeRoles('admin'))

// Availability slots
router.get('/availability',     ctrl.listSlots)
router.post('/availability',
  body('date').isDate().withMessage('Fecha inválida'),
  body('start_time').matches(/^\d{2}:\d{2}$/).withMessage('Hora inicio inválida (HH:MM)'),
  body('end_time').matches(/^\d{2}:\d{2}$/).withMessage('Hora fin inválida (HH:MM)'),
  validate, ctrl.createSlot
)
router.delete('/availability/:id', ctrl.deleteSlot)

// Blocked dates
router.get('/blocked-dates',     ctrl.listBlocked)
router.post('/blocked-dates',
  body('date').isDate().withMessage('Fecha inválida'),
  validate, ctrl.blockDate
)
router.delete('/blocked-dates/:id', ctrl.unblockDate)

// Contact reply
router.post('/contact/:id/reply',
  body('reply_text').trim().notEmpty().withMessage('El texto de respuesta es requerido'),
  validate, ctrl.replyToContact
)

// Dashboard
router.get('/dashboard/stats', ctrl.stats)

module.exports = router

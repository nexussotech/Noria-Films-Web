const router         = require('express').Router()
const { body }       = require('express-validator')
const ctrl           = require('../controllers/appointments.controller')
const auth           = require('../middlewares/authenticateToken')
const authorizeRoles = require('../middlewares/authorizeRoles')
const validate       = require('../middlewares/validate')

// Pública (usuario autenticado puede ver slots)
router.get('/available-slots', auth, ctrl.availableSlots)

router.post('/',
  auth,
  body('quote_id').isInt({ min: 1 }),
  body('slot_id').isInt({ min: 1 }),
  body('meeting_type').optional().isIn(['presencial','virtual']),
  validate, ctrl.create
)
router.get('/my',  auth, ctrl.myAppointments)
router.get('/',    auth, authorizeRoles('admin'), ctrl.listAll)
router.patch('/:id/status',
  auth, authorizeRoles('admin'),
  body('status').isIn(['pending','confirmed','cancelled','completed']),
  validate, ctrl.updateStatus
)

module.exports = router

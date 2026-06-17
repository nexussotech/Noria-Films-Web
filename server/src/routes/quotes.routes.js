const router         = require('express').Router()
const { body }       = require('express-validator')
const ctrl           = require('../controllers/quotes.controller')
const auth           = require('../middlewares/authenticateToken')
const authorizeRoles = require('../middlewares/authorizeRoles')
const validate       = require('../middlewares/validate')
const {
  VALID_SHOOTING_DURATIONS,
  VALID_DELIVERY_TIMES,
  SHOOTING_DURATION_COST,
  DELIVERY_TIME_COST,
  DRONE_COST,
}                    = require('../utils/pricing')

// Expone configuración de precios para el preview del frontend
router.get('/pricing-config', (_, res) => res.json({
  SHOOTING_DURATION_COST,
  DELIVERY_TIME_COST,
  DRONE_COST,
}))

router.post('/',
  auth,
  body('service_id').isInt({ min: 1 }).withMessage('Servicio requerido'),
  body('shooting_duration')
    .isIn(VALID_SHOOTING_DURATIONS)
    .withMessage(`Duración inválida. Opciones: ${VALID_SHOOTING_DURATIONS.join(', ')}`),
  body('needs_drone').isBoolean().withMessage('needs_drone debe ser true o false'),
  body('delivery_time')
    .isIn(VALID_DELIVERY_TIMES)
    .withMessage(`Entrega inválida. Opciones: ${VALID_DELIVERY_TIMES.join(', ')}`),
  validate,
  ctrl.create
)

router.get('/my',   auth, ctrl.myQuotes)
router.get('/:id',  auth, ctrl.getOne)
router.get('/',     auth, authorizeRoles('admin'), ctrl.listAll)

router.patch('/:id/status',
  auth, authorizeRoles('admin'),
  body('status').isIn(['draft', 'generated', 'scheduled', 'cancelled']),
  validate,
  ctrl.updateStatus
)

module.exports = router

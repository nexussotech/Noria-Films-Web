const router         = require('express').Router()
const ctrl           = require('../controllers/admin.controller')
const auth           = require('../middlewares/authenticateToken')
const authorizeRoles = require('../middlewares/authorizeRoles')

// Todas las rutas de este router requieren admin
router.use(auth, authorizeRoles('admin'))

// Dashboard
router.get('/dashboard/stats', ctrl.stats)

module.exports = router

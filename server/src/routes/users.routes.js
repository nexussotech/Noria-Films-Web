const router         = require('express').Router()
const ctrl           = require('../controllers/users.controller')
const auth           = require('../middlewares/authenticateToken')
const authorizeRoles = require('../middlewares/authorizeRoles')

router.use(auth, authorizeRoles('admin'))

router.get('/',                  ctrl.list)
router.get('/:id',               ctrl.getOne)
router.patch('/:id/status',      ctrl.setStatus)

module.exports = router

const {Router} = require('express')
const {create, remove, startRent, endRent, getAll} = require('../controllers/bikes.controller')
const router = Router()

router.post('/', create)
router.delete('/', remove)
router.post('/start-rent', startRent)
router.post('/end-rent', endRent)
router.get('/', getAll)

module.exports = router

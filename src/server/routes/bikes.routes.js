const {Router} = require('express')
const {create, remove, update, startRent, endRent, getAll} = require('../controllers/bikes.controller')
const router = Router()

router.post('/', create)
router.delete('/', remove)
router.put('/', update)
router.post('/start-rent', startRent)
router.post('/end-rent', endRent)
router.get('/', getAll)

module.exports = router

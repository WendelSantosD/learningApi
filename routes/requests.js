const express = require('express')
const router = express.Router()

const requestsController = require('../controllers/requests-controller')

router.get('/', requestsController.getRequests)
router.post('/', requestsController.postRequests)
router.get('/:id_request', requestsController.getOnceRequest)
router.patch('/', requestsController.patchRequests)
router.delete('/', requestsController.deleteRequests)

module.exports = router
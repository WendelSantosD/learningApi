const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).send({
        message: 'Return the requests'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensage: 'Request created'
    })
})

router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto
    res.status(200).send({
            message: 'Resquest details',
            id: id
    })
    
})

router.patch('/', (req, res, next) => {
    res.status(201).send({
        message: 'Request altered'
    })
})

router.delete('/', (req, res, next) => {
    res.status(201).send({
        message: 'Request deleted'
    })
})

module.exports = router
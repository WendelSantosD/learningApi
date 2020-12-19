const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).send({
        message: 'Using GET within the product route'
    })
})

router.post('/', (req, res, next) => {
    res.status(201).send({
        mensage: 'Using POST within the product route'
    })
})

router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto

    if(id === 'special') {

        res.status(200).send({
            message: 'You discovered the ID',
            id: id
        })
    } else {
        res.status(200).send({
            message: 'You passed an ID'
        })
    }
})

router.patch('/', (req, res, next) => {
    res.status(201).send({
        message: 'Using PATCH within the product route'
    })
})

router.delete('/', (req, res, next) => {
    res.status(201).send({
        message: 'Using DELETE within the product route'
    })
})

module.exports = router
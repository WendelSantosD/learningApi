const express = require('express')
const app = express()
const morgan = require('morgan')

const productRoute = require('./routes/products')
const requestRoute = require('./routes/requests')

app.use(morgan('dev'))

app.use('/products', productRoute)
app.use('/requests', requestRoute)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        error: {
            message: error.message
        }
    })
})

module.exports = app
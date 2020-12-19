const express = require('express')
const app = express()

const productRoute = require('./routes/products')
const requestRoute = require('./routes/requests')

app.use('/products', productRoute)
app.use('/requests', requestRoute)

module.exports = app
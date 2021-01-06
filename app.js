const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const productRoute = require('./routes/products')
const requestRoute = require('./routes/requests')
const usersRoute = require('./routes/users')

app.use('/uploads', express.static('uploads'))
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false})) //just simple datas
app.use(bodyParser.json()) // input json

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*')
    res.header(
        'Acces-Control-Allow-Header', 
        'Origin, X-Requerested-With, Content-Type, Accept, Authorizarion'
    )

    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
            )
        return res.status(200).send({})
    }

    next()
})

app.use('/products', productRoute)
app.use('/requests', requestRoute)
app.use('/users', usersRoute)

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
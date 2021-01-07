const jwt = require('jsonwebtoken')

exports.required = (req, res, next) => {

    try {
        // const decode = jwt.verify(req.body.token, process.env.JWT_KEY)
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        req.user = decode
        next()
    } catch (error) {
        console.log(error)
        console.log(`token: ${req.body.token}`)
        return res.status(401).send({
            message: 'Authentication failed'
        })
    }
}

exports.optional = (req, res, next) => {

    try {
        // const decode = jwt.verify(req.body.token, process.env.JWT_KEY)
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_KEY)
        req.user = decode
        next()
    } catch (error) {
        next()
    }  
}
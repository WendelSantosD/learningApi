const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/register', (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if (err) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM users WHERE email =?',
            [req.body.email],
            (err, results) => {
                if (err) {
                    return res.status(500).send({
                    error: error
                })
                }

                if (results.length > 0) {
                    res.status(409).send({
                        message: "User alredy registed"
                    })
                } else {
                     bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                        if (err) {
                        return res.status(500).send({
                             error: errBcrypt
                        })
            }
            conn.query(
                'INSERT INTO users (email, password) VALUES (?,?)',
                [req.body.email, hash],
                (error, results) => {
                    conn.release()
                    if (error) {
                        return res.status(500).send({
                            error: error
                        })
                    }
                    response = {
                        message: 'User registed !',
                        createdUser: {
                            id_usuario: results.insertId,
                            email: req.body.email
                        }
                    }
                    return res.status(201).send(response)
                }
            )
        })
                }
            }
            
            )    
    })
})

router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        const query = 'SELECT * FROM users WHERE email = ?'
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release()
            if (error) {
                return res.status(500).send({
                    error: error
                })
            }
            if(results.length < 1) {
                return res.status(401).send({
                    message: 'Authentication failed'
                })
            }

            bcrypt.compare(req.body.password, results[0].password, (err, result) => {
                if (err) {
                    return res.status(401).send({
                        message: 'Authentication failed'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        id_user: results[0].id_user,
                        email: results[0].email
                    }, 'process.env.JWT_KEY',
                    {
                        expiresIn: "1h"
                    }
                    )
                    return res.status(200).send({
                        message: 'Successfully authenticated',
                        token: token
                    })
                }

                return res.status(401).send({
                    message: 'Authentication failed'
                })
            })
        })
    })
})

module.exports = router
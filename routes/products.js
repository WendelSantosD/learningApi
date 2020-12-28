const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
            error: error
            })
        }
        conn.query(
            'SELECT * FROM products;',
            (error, result, fields) => {
                if (error) {
                    return res.status(500).send({
                    error: error
                    })
                }
                return res.status(200).send({
                    response: result
                })
            }
        )
    })
})

router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
            error: error
            })
        }
        conn.query(
            'INSERT INTO products (name, price) VALUES (?,?);',
            [req.body.name, req.body.price],
            (error, result, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                    error: error,
                    response: null
                })
                }
                res.status(201).send({
                    message: 'Product insert',
                    id_product: result.insertId
                })
            }    
        )
    })
})

router.get('/:id_product', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM products WHERE id_product = ?;',
            [req.params.id_product],
            (error, result, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }
                return res.status(200).send({
                    response: result
                })
            }
        )
    })
})

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
            error: error
            })
        }
        conn.query(
            `UPDATE     products
             SET        name        = ?,
                        price       = ?
             WHERE      id_product  = ?`,
            [
                req.body.name,
                req.body.price,
                req.body.id_product
            ],
            (error, result, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                    error: error,
                    response: null
                })
                }
                res.status(202).send({
                    message: 'Product altered',
                })
            }    
        )
    })
})

router.delete('/', (req, res, next) => {
   mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
            error: error
            })
        }
        conn.query(
           `DELETE FROM products WHERE id_product = ?`,
            [req.body.id_product],
            (error, result, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                    error: error,
                    response: null
                })
                }
                res.status(202).send({
                    message: 'Product removed',
                })
            }    
        )
    })
})

module.exports = router
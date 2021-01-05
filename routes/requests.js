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
            'SELECT * FROM requests;',
            (error, result, fields) => {
                if (error) {
                    return res.status(500).send({
                    error: error
                    })
                }
                const response = {
                    amount: result.length,
                    requests: result.map(orders => {
                        return {
                            id_request: orders.id_request, 
                            id_product: orders.id_product,
                            amount: orders.amount,
                            request: {
                                type: 'GET',
                                description: 'Return the details of a specific request',
                                url: 'http://localhost:3000/products/' + orders.id_request
                            }
                        }
                    })
                }
                return res.status(200).send({response})
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
        conn.query('SELECT * FROM products WHERE id_product = ?',
        [req.body.id_product],
        (error, result, field) => {
            if (error) {
                return res.status(500).send({
                error: error
                })
            }
            if (result.length == 0) {
                return res.status(404).send({
                    message: "Product not found"
                })
            }

            conn.query('INSERT INTO requests (id_product, amount) VALUES (?,?)',
            [req.body.id_product, req.body.amount],
            (error, result, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                    error: error,
                    response: null
                })
                }
                const response = {
                    message: 'Request inserted',
                    requestCreated: {
                        id_request: result.id_request,
                        id_product: req.id_product,
                        amount: req.body.amount,
                        request: {
                            type: 'GET',
                            description: 'Return all the requests',
                            url: 'http://localhost:3000/requests'
                        }
                    }

                }
                return res.status(201).send(response)
            }    
        )

        }
        )
    })
})

router.get('/:id_request', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error
            })
        }
        conn.query(
            'SELECT * FROM requests WHERE id_request = ?;',
            [req.params.id_request],
            (error, result, fields) => {
                if (error) {
                    return res.status(500).send({
                        error: error
                    })
                }

                if (result.length == 0) {
                    return res.status(404).send({
                        message: 'No request found with this ID'
                    })
                }

                const response = {
                    request: {
                        id_request: result[0].id_request,
                        id_product: result[0].id_product,
                        amount: result[0].amount,
                        request: {
                            type: 'GET',
                            description: 'Return all the requests',
                            url: 'http://localhost:3000/requests'
                        }
                    }
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
            'UPDATE requests SET id_product = ?, amount = ? WHERE id_request = ?',
            [req.body.id_product, req.body.amount, req.body.id_request],
            (error, result, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                    error: error,
                    response: null
                })
                }
                const response = {
                    message: 'Request updated',
                    productUpdated: {
                        id_request: req.body.id_request,
                        id_product: req.body.id_product,
                        amount: req.body.amount,
                        request: {
                            type: 'GET',
                            description: 'Return the details of a specific request',
                            url: 'http://localhost:3000/requests/' + req.body.id_request
                        }
                    }

                }
                return res.status(202).send(response)
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
           `DELETE FROM requests WHERE id_request = ?`,
            [req.body.id_request],
            (error, result, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                    error: error
                })
                const response = {
                    message: 'Request Deleted',
                    request: {
                        type: 'POST',
                        description: 'Insert a request',
                        body: {
                            id_product: 'Number',
                            amount: 'Number'
                        }
                    }
                }
                return res.status(202).send(response)
                }
            }    
        )
    })
})

module.exports = router
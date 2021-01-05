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
                const response = {
                    amount: result.length,
                    products: result.map(prod => {
                        return {
                            id_product: prod.id_product, 
                            name: prod.name,
                            price: prod.price,
                            request: {
                                type: 'GET',
                                description: 'Return the details of a specific product',
                                url: 'http://localhost:3000/products/' + prod.id_product
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
                const response = {
                    message: 'Product inserted',
                    productCreated: {
                        id_product: result.id_product,
                        name: req.body.name,
                        price: req.body.price,
                        request: {
                            type: 'POST',
                            description: 'Insert a product',
                            url: 'http://localhost:3000/prodcuts'
                        }
                    }

                }
                return res.status(201).send(response)
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

                if (result.length == 0) {
                    return res.status(404).send({
                        message: 'No product found with this ID'
                    })
                }

                const response = {
                    product: {
                        id_product: result[0].id_product,
                        name: result[0].name,
                        price: result[0].price,
                        request: {
                            type: 'GET',
                            description: 'Return all the products',
                            url: 'http://localhost:3000'
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
            'UPDATE products SET name = ?, price = ? WHERE id_product = ?',
            [req.body.name, req.body.price, req.body.id_product],
            (error, result, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                    error: error,
                    response: null
                })
                }
                const response = {
                    message: 'Product updated',
                    productUpdated: {
                        id_product: req.body.id_product,
                        name: req.body.name,
                        price: req.body.price,
                        request: {
                            type: 'GET',
                            description: 'Return the details of a specific product',
                            url: 'http://localhost:3000/prodcuts' + req.body.id_product
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
           `DELETE FROM products WHERE id_product = ?`,
            [req.body.id_product],
            (error, result, field) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                    error: error
                })
                const response = {
                    message: 'Product Deleted',
                    request: {
                        type: 'POST',
                        description: 'Insert a product',
                        body: {
                            name: 'String',
                            price: 'Number'
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
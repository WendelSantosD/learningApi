const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

const userController = require('../controllers/users-controller')

router.post('/register', userController.registerUser)

router.post('/login', userController.loginUser)

module.exports = router
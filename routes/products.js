const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const multer = require('multer')
const login = require('../middleware/login')

const storage = multer.diskStorage({
    destination: (req , file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype ==  'image/jpeg' || file.mimetype ==  'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024  * 5
    },
    fileFilter: fileFilter
})

const prodocutsController = require('../controllers/products-controller')

router.get('/', prodocutsController.getProducts)
router.post('/',login.required, upload.single('image_product'), prodocutsController.postProducts)
router.get('/:id_product', prodocutsController.getOnceProduct)
router.patch('/', login.required, prodocutsController.patchProducts)
router.delete('/', login.required, prodocutsController.deleteProducts)

module.exports = router
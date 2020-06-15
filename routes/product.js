const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const productController = require('../controller/product');
const upload = require('../controller/imgBodyParser');

const router = express.Router();

router.get('/', productController.getAllProducts);

router.get('/:Id', productController.getProductById);

router.post('/', checkAuth, upload.single('productImage'), productController.postProduct);

router.put('/:Id', productController.updateProductById);

router.delete('/:Id', productController.deleteProductById);

module.exports = router;

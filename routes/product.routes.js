const router = require('express').Router();
const productController = require('../controller/product.controller');
const authenticateToken = require('../src/middleware/authMiddleware');

router.get('/', productController.getAllProducts);

router.post('/', authenticateToken, productController.createProduct);

module.exports = router;

const router = require('express').Router();
const cartController = require('../controller/cart.controller.js');
const authenticateToken = require('../src/middleware/authMiddleware.js');

router.post('/', authenticateToken, cartController.addToCart);

module.exports = router;

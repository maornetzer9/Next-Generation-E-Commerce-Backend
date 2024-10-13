const express = require('express');
const cartController = require('../controllers/cart');

const router = express.Router();

router.post('/',         cartController.loadCartHandler       );
router.post('/add',      cartController.addToCartHandler      );
router.delete('/remove', cartController.removeFromCartHandler );
router.delete('/delete', cartController.deleteFromCartHandler );

module.exports = { cartRouter: router };
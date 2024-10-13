const express = require('express');
const ordersController = require('../controllers/orders');

const router = express();

router.get('/',     ordersController.loadOrdersHandler );
router.post('/add', ordersController.newOrderHandler   );

module.exports = {  ordersRouter: router };
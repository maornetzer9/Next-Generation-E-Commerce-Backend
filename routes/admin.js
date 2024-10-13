const express = require('express');
const adminController = require('../controllers/admin');

const router = express();

router.get('/user', adminController.loadUsersOrdersHandler );

module.exports = { adminRouter: router };
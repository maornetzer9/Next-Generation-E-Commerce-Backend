const express = require('express');
const userController = require('../controllers/user');

const router = express();

router.get('/auth',       userController.authHandler       );
router.post('/login',     userController.loginHandler      );
router.post('/register',  userController.registerHandler   );
router.put('/update',     userController.updateHandler     );
router.get('/disconnect', userController.disconnectHandler );

module.exports = { userRouter: router };
const express = require('express');

const userController = require('../controller/user');

const router = express.Router();

router.post('/signup', userController.signUp);

router.delete('/:userId', userController.killUserById);

router.get('/', userController.getAllUser);

router.post('/login', userController.login);

module.exports = router;

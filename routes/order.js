const express = require('express');
const checkAuth = require('../middlewares/check-auth');

const orderController = require('../controller/order');

const router = express.Router();

router.get('/', checkAuth, orderController.getAllOrders);

router.get('/:Id', orderController.getOrderByID);

router.post('/', checkAuth, orderController.postOrder);

router.delete('/:Id', orderController.deleteOrderByID);

module.exports = router;

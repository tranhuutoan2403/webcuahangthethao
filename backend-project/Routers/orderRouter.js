const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/OrderControllers');

// Lấy danh sách tất cả đơn hàng
router.get('/', orderController.getAllOrders);

// Lấy chi tiết 1 đơn hàng theo ID
router.get('/:id', orderController.getOrderById);

// ✅ Tạo đơn hàng mới
router.post('/', orderController.createOrder);

router.get("/user/:user_id", orderController.getOrdersByUser);

module.exports = router;

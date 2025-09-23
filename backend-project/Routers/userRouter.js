const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userControllers');
const verifyToken = require("../Middlewares/VerifyToken");

// ==========================
// Các API yêu cầu Token
// ==========================

// Lấy danh sách tất cả user
router.get('/', verifyToken, userController.getAllUsers);

// Lấy chi tiết 1 user
router.get('/:id', verifyToken, userController.getUserById);

// Ẩn user (status = 'inactive')
router.put('/hide/:id', verifyToken, userController.hideUser);

// Khôi phục user (status = 'active')
router.put('/restore/:id', verifyToken, userController.restoreUser);

// Cập nhật user
router.put('/:id', verifyToken, userController.updateUser);

// Đổi mật khẩu user
router.put('/change-password/:id', verifyToken, userController.changePassword);

// Thêm mới user
router.post('/', verifyToken, userController.createUser);

module.exports = router;

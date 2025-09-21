const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userControllers');
const verifyToken = require("../Middlewares/VerifyToken");

// ==========================
// Các API yêu cầu Token
// ==========================

// GET /api/users -> Lấy danh sách tất cả user
router.get('/', verifyToken, userController.getAllUsers);

// GET /api/users/:id -> Lấy chi tiết 1 user
router.get('/:id', verifyToken, userController.getUserById);

// POST /api/users -> Thêm mới user
router.post('/', verifyToken, userController.createUser);

// PUT /api/users/:id -> Cập nhật user
router.put('/:id', verifyToken, userController.updateUser);

// PUT /api/users/hide/:id -> Ẩn user (status = 'inactive')
router.put('/hide/:id', verifyToken, userController.hideUser);

// PUT /api/users/restore/:id -> Khôi phục user (status = 'active')
router.put('/restore/:id', verifyToken, userController.restoreUser);
// change password
router.put("/change-password/:id", userController.changePassword);
module.exports = router;

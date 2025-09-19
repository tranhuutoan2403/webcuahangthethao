const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userControllers');

// GET /api/users -> Lấy danh sách tất cả user
router.get('/', userController.getAllUsers);

// GET /api/users/:id -> Lấy chi tiết 1 user
router.get('/:id', userController.getUserById);

// POST /api/users -> Thêm mới user
router.post('/', userController.createUser);

// PUT /api/users/:id -> Cập nhật user
router.put('/:id', userController.updateUser);

// // DELETE /api/users/:id -> Xóa user (xóa hẳn khỏi database)
// router.delete('/:id', userController.deleteUser);

// PUT /api/users/hide/:id -> Ẩn user (chuyển status = 'inactive')
router.put('/hide/:id', userController.hideUser);

// PUT /api/users/restore/:id -> Khôi phục user (chuyển status = 'active')
router.put('/restore/:id', userController.restoreUser);

module.exports = router;

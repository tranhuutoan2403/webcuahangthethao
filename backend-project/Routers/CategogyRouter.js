// routes/CategogyRoutes.js
const express = require('express');
const router = express.Router();
const CategogyController = require('../Controllers/CategogyControllers');

// 1. Lấy tất cả loại sản phẩm
router.get('/', CategogyController.getAllCategories);

// ✅ Thêm route lấy danh mục theo slug
router.get('/slug/:slug', CategogyController.getCategoryBySlug);

// 2. Lấy 1 loại sản phẩm theo ID
router.get('/:id', CategogyController.getCategoryById);

// 3. Thêm loại sản phẩm mới
router.post('/', CategogyController.createCategory);

// 4. Cập nhật loại sản phẩm
router.put('/:id', CategogyController.updateCategory);

// 5. Xóa loại sản phẩm
router.delete('/:id', CategogyController.deleteCategory);

module.exports = router;

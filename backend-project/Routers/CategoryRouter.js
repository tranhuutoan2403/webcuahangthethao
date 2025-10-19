// routes/CategogyRoutes.js
const express = require('express');
const router = express.Router();
const CategoryController = require('../Controllers/CategoryControllers');

// 1. Lấy tất cả loại sản phẩm
router.get('/', CategoryController.getAllCategories);

// ✅ Thêm route lấy danh mục theo slug
router.get('/slug/:slug', CategoryController.getCategoryBySlug);

// 2. Lấy 1 loại sản phẩm theo ID
router.get('/:id', CategoryController.getCategoryById);

// 3. Thêm loại sản phẩm mới
router.post('/', CategoryController.createCategory);

// 4. Cập nhật loại sản phẩm
router.put('/:id', CategoryController.updateCategory);

// 5. Xóa loại sản phẩm
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;

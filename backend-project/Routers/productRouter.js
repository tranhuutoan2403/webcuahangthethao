const express = require('express');
const router = express.Router();
const productController = require('../Controllers/ProductControllers');
const materialCtrl = require('../Controllers/MaterialProductControllers');

// 💡 IMPORT middleware Multer đã được export từ Controller
const { uploadAny, uploadSingleImage } = materialCtrl; 

// ==========================
// PRODUCT ROUTES
// ==========================

// 1. ROUTE CHÍNH: Tạo mới sản phẩm hoặc thêm biến thể
router.post('/createOrUpdateProduct', uploadAny, materialCtrl.createOrUpdateProduct);

// 2. API KIỂM TRA ID (Dùng cho Frontend)
router.get('/check/:productId', materialCtrl.checkProductExistence);

// 3. Lấy danh sách tất cả sản phẩm
router.get('/', productController.getAllProduct);

// 4. Lấy danh sách categories
router.get('/categories', productController.getAllCategories);

// 5. Lấy tất cả slug của categories
router.get('/slugs', productController.getAllCategorySlugs);


// --- CÁC ROUTE CỤ THỂ (SLUG) ---

// 6. Lấy sản phẩm theo slug (Product Detail)
router.get('/slug/:slug', productController.getProductBySlug);

// 7. Lấy sản phẩm theo categogy slug (ĐÃ SỬA LỖI CHÍNH TẢ)
router.get('/categogy/slug/:slug', productController.getProductsByCategorySlug);


// --- CÁC ROUTE CHUNG CHUNG (ID) ---

// 8. Cập nhật sản phẩm (PUT)
router.put('/:id', uploadSingleImage, productController.updateProduct);

// 9. Xóa sản phẩm (DELETE)
router.delete('/:id', productController.deleteProduct);

// 10. Lấy sản phẩm theo ID (GET)
router.get('/:id', productController.getProductById);


module.exports = router;
const express = require("express");
const router = express.Router();
const productController = require("../Controllers/ProductControllers");

// ==========================
// PRODUCT ROUTES
// ==========================

// 1. Lấy tất cả sản phẩm
router.get("/", productController.getAllProduct);

// 2. Lấy sản phẩm theo slug
router.get("/slug/:slug", productController.getProductBySlug);

// 3. Lấy sản phẩm theo category slug
router.get("/category/:slug", productController.getProductsByCategorySlug);

// 4. Lấy sản phẩm mới nhất theo category slug
router.get("/category/:slug/newest", productController.getNewestProductsByCategorySlug);

// 4. Lấy sản phẩm theo Brand Slug 
router.get("/brand/:slug", productController.getProductsByBrands)

// 2. Lấy sản phẩm theo ID (ĐỂ CUỐI CÙNG)
router.get("/:id", productController.getProductById);

// 5. Tạo sản phẩm mới
router.post("/", productController.uploadSingleImage, productController.createProduct);

// 6. Cập nhật sản phẩm
router.put("/:id", productController.uploadSingleImage, productController.updateProduct);

// 7. Xóa sản phẩm
router.delete("/:id", productController.deleteProduct);

// router.get("/:id/stock", productController.getProductStock);

module.exports = router;

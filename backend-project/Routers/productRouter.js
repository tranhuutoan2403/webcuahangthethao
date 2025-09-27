const express = require("express");
const router = express.Router();
const productController = require("../Controllers/ProductControllers");

// ==========================
// PRODUCT ROUTES
// ==========================

// 1. Lấy tất cả sản phẩm
router.get("/", productController.getAllProduct);

// 3. Lấy sản phẩm theo slug
router.get("/slug/:slug", productController.getProductBySlug);

// 4. Lấy sản phẩm theo category slug
router.get("/categogy/:slug", productController.getProductsByCategorySlug);

// 2. Lấy sản phẩm theo ID (ĐỂ CUỐI CÙNG)
router.get("/:id", productController.getProductById);

// 5. Tạo sản phẩm mới
router.post("/", productController.uploadSingleImage, productController.createProduct);

// 6. Cập nhật sản phẩm
router.put("/:id", productController.uploadSingleImage, productController.updateProduct);

// 7. Xóa sản phẩm
router.delete("/:id", productController.deleteProduct);

module.exports = router;

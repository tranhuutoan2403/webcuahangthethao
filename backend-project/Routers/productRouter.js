const express = require("express");
const router = express.Router();
const productController = require("../Controllers/ProductControllers");

// ==========================
// PRODUCT ROUTES (Đặt route cụ thể trước, động sau)
// ==========================

// 1. Lấy tất cả sản phẩm
router.get("/", productController.getAllProduct);

// 2. Lấy sản phẩm theo slug (phải đặt sớm để không bị nuốt)
router.get("/slug/:slug", productController.getProductBySlug);

// 3. Lấy sản phẩm theo category slug
router.get("/category/:slug", productController.getProductsByCategorySlug);

// 4. Lấy sản phẩm mới nhất theo category slug
router.get("/category/:slug/newest", productController.getNewestProductsByCategorySlug)

// 4. Lấy sản phẩm theo brand slug
router.get("/brand/:slug", productController.getProductsByBrands);

// 5. Lấy sản phẩm theo category + brand
router.get("/:categorySlug/:brandSlug", productController.getProductsByCategoryAndBrand);

// 6. Lấy sản phẩm theo ID (đặt cuối)
router.get("/:id", productController.getProductById);

// 7. Tạo sản phẩm mới
router.post("/", productController.uploadSingleImage, productController.createProduct);

// 8. Cập nhật sản phẩm
router.put("/:id", productController.uploadSingleImage, productController.updateProduct);

// 9. Xóa sản phẩm
router.delete("/:id", productController.deleteProduct);

module.exports = router;

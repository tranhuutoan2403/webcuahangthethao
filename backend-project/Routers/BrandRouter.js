const express = require("express");
const router = express.Router();
const brandController = require("../Controllers/BrandControllers");

// ✅ Lấy tất cả thương hiệu
router.get("/", brandController.getAllBrands);

// ✅ Route lấy thương hiệu theo slug — đặt trước :id
router.get("/slug/:slug", brandController.getBrandBySlug);

// ✅ Lấy thương hiệu theo ID
router.get("/:id", brandController.getBrandById);

// ✅ Thêm mới thương hiệu
router.post("/", brandController.createBrand);

// ✅ Cập nhật thương hiệu
router.put("/:id", brandController.updateBrand);

// ✅ Xóa thương hiệu
router.delete("/:id", brandController.deleteBrand);

module.exports = router;

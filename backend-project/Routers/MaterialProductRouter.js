const express = require("express");
const router = express.Router();

// 💡 SỬA: Import Controller và middleware upload đã được export
const materialController = require("../Controllers/MaterialProductControllers");
const { uploadAny } = materialController; 

// ==========================
// MATERIAL ROUTES
// ==========================

// 1. Thêm mới material hoặc update product + materials
// Sử dụng uploadAny đã được import
router.post(
  "/",
  uploadAny, // <-- ĐÃ SỬA: Dùng biến đã được export từ Controller
  materialController.createOrUpdateProduct
);

// 2. Lấy danh sách material theo product_id
router.get("/:productId", materialController.getMaterialsByProduct);

// 3. Cập nhật thông tin material
router.put("/:id", materialController.updateMaterial);

// 4. Xóa material
router.delete("/:id", materialController.deleteMaterial);

module.exports = router;
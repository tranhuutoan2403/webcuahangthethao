const express = require("express");
const router = express.Router();

// 💡 Import controller và middleware upload
const materialController = require("../Controllers/MaterialProductControllers");
const { uploadAny } = materialController;

// ==========================
// PRODUCT MATERIAL ROUTES
// ==========================

// 1. Thêm 1 biến thể hoặc nhiều biến thể cùng lúc
router.post("/", uploadAny, materialController.addVariants); // frontend gửi FormData + mảng variants

// 2. Lấy tất cả biến thể
router.get("/", materialController.getAllMaterials);

// 3. Lấy danh sách biến thể theo product_id
router.get("/:product_id", materialController.getMaterialsByProduct);

router.get("/:material_id/stock", materialController.getStockMaterial);

router.post("/upsert/:product_id", materialController.uploadAny, materialController.upsertVariants);

router.put("/upsert/:product_id", materialController.uploadAny, materialController.upsertVariants);
// 4. Lấy 1 biến thể theo material_id
router.get("/:id", materialController.getMaterialById);

// 5. Cập nhật biến thể
router.put("/:id", uploadAny, materialController.updateMaterial);

// 6. Xóa biến thể
router.delete("/:id", materialController.deleteMaterial);

module.exports = router;

const express = require("express");
const router = express.Router();
const flashSaleProductController = require("../Controllers/FlashSaleProductControllers");

// Lấy tất cả
router.get("/", flashSaleProductController.getAllFlashSaleProducts);

// Lấy theo ID
router.get("/:id", flashSaleProductController.getFlashSaleProductById);

// Thêm mới
router.post("/", flashSaleProductController.createFlashSaleProduct);

// Cập nhật
router.put("/:id", flashSaleProductController.updateFlashSaleProduct);

// Xóa
router.delete("/:id", flashSaleProductController.deleteFlashSaleProduct);

module.exports = router;

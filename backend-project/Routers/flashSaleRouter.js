const express = require("express");
const router = express.Router();
const flashSaleController = require("../Controllers/flashSaleControllers");

// Lấy flash sale đang active cùng danh sách sản phẩm
router.get("/active", flashSaleController.getActiveFlashSaleWithProducts);

// Lấy tất cả flash sale
router.get("/", flashSaleController.getAllFlashSales);

// Lấy flash sale theo id
router.get("/:id", flashSaleController.getFlashSaleById);

// Tạo flash sale mới
router.post("/", flashSaleController.createFlashSale);

// Thêm sản phẩm vào flash sale
router.post("/:id/products", flashSaleController.addProductToFlashSale);

// Xóa sản phẩm khỏi flash sale
router.delete("/:flashSaleId/products/:productId", flashSaleController.removeProductFromFlashSale);

// Cập nhật flash sale (status, discount, thời gian)
router.put("/:id", flashSaleController.updateFlashSale);

// Xóa flash sale
router.delete("/:id", flashSaleController.deleteFlashSale);

module.exports = router;

const express = require("express");
const router = express.Router();
const preorderController = require("../Controllers/PreorderControllers");

// Tạo đơn đặt hàng trước
router.post("/", preorderController.createPreorder);

// Lấy tất cả đơn đặt hàng trước
router.get("/", preorderController.getAllPreorders);

// ✅ Lấy preorder theo preorder_id (mới)
router.get("/:preorder_id", preorderController.getPreorderById);

// Lấy preorder theo user_id (tuỳ chọn)
router.get("/user/:user_id", preorderController.getPreordersByUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const ProductReviewController = require('../Controllers/ProductReviewsControllers');

// Lấy review theo review_id
router.get('/review/:id', ProductReviewController.getReviewById);

// Lấy review theo product_id
router.get('/product/:product_id', ProductReviewController.getReviewsByProductId);

// Thêm review
router.post('/', ProductReviewController.createReview);

// Cập nhật review
router.put('/:id', ProductReviewController.updateReview);

// Xóa review
router.delete('/:id', ProductReviewController.deleteReview);

module.exports = router;

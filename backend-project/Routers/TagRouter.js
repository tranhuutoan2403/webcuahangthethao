const express = require('express');
const router = express.Router();
const TagControllers = require('../Controllers/TagControllers');

// Core tag routes
router.get("/products", TagControllers.getFilteredProducts);
router.post("/assign-multiple", TagControllers.assignTagToMultipleProducts);
router.delete("/remove-multiple", TagControllers.removeTagFromMultipleProducts);

// CRUD routes
router.post("/", TagControllers.createTag);
router.get("/", TagControllers.getAllTags);
router.get("/:tagId", TagControllers.getTagById);
router.put("/:tagId", TagControllers.updateTag);
router.delete("/:tagId", TagControllers.deleteTag);

// Product-tag relationship routes
router.post('/assign', TagControllers.assignTagToProduct);
router.delete('/remove', TagControllers.removeTagFromProduct);
router.get('/product/:productId', TagControllers.getTagsForProduct);
router.get('/:tagId/products', TagControllers.getProductsByTag);

// Bulk assignment routes
router.post('/bulk', TagControllers.assignTagToMultipleProducts);
router.post('/by-category', TagControllers.assignTagByCategory);
router.post('/by-brand', TagControllers.assignTagByBrand);

module.exports = router;

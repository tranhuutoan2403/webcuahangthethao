const express = require("express");
const router = express.Router();
const PagesController = require("../Controllers/PagesControllers");

// API routes
router.get("/", PagesController.getAllPages); // GET /api/pages
router.get("/:slug", PagesController.getPageBySlug); // GET /api/pages/gioi-thieu
router.post("/", PagesController.createPage); // POST /api/pages
router.put("/:id", PagesController.updatePage); // PUT /api/pages/1
router.delete("/:id", PagesController.deletePage); // DELETE /api/pages/1

module.exports = router;

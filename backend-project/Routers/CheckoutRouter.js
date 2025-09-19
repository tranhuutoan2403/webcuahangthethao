const express = require("express");
const router = express.Router();
const checkoutController = require("../Controllers/checkoutControllers");

router.post("/", checkoutController.checkout);

module.exports = router;
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const cartController = require("../controllers/cartController");

// All cart routes are protected - require login
router.get("/", protect, cartController.getUserCart);
router.post("/", protect, cartController.addItemToCart);
router.put("/:itemId", protect, cartController.updateCartItem);
router.delete("/:itemId", protect, cartController.removeCartItem);
router.delete("/", protect, cartController.clearCart);

module.exports = router;

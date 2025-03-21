const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const orderController = require("../controllers/orderController");

// User routes - requires authentication
router.get("/", protect, orderController.getUserOrders);
router.post("/", protect, orderController.createOrder);
router.get("/:id", protect, orderController.getOrder);
router.put("/:id/pay", protect, orderController.updateOrderToPaid);
router.put("/:id/cancel", protect, orderController.cancelOrder);

// Admin only routes
router.get(
  "/admin",
  protect,
  authorize("admin"),
  orderController.getAdminOrders
);
router.get(
  "/count",
  protect,
  authorize("admin"),
  orderController.getOrderCount
);
router.get(
  "/total-sales",
  protect,
  authorize("admin"),
  orderController.getTotalSales
);
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  orderController.updateOrderStatus
);
router.put(
  "/:id/shipping",
  protect,
  authorize("admin"),
  orderController.updateShipping
);
router.delete("/:id", protect, authorize("admin"), orderController.deleteOrder);

module.exports = router;

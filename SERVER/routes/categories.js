const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const categoryController = require("../controllers/categoryController");

// Public routes
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.get("/slug/:slug", categoryController.getCategoryBySlug);

// Admin routes
router.post(
  "/",
  protect,
  authorize("admin"),
  categoryController.createCategory
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  categoryController.deleteCategory
);

module.exports = router;

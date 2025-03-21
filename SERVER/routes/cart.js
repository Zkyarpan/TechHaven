const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const categoryController = require("../controllers/categoryController");

// Public routes
router.get("/", categoryController.getCategories);
router.get("/tree", categoryController.getCategoryTree);
router.get("/featured", categoryController.getFeaturedCategories);
router.get("/slug/:slug", categoryController.getCategoryBySlug);
router.get("/:id", categoryController.getCategory);

// Protected routes - Admin only
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

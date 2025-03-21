const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const laptopController = require("../controllers/laptopController");
const reviewController = require("../controllers/reviewController");

// Public laptop routes
router.get("/", laptopController.getLaptops);
router.get("/featured", laptopController.getFeaturedLaptops);
router.get("/top-rated", laptopController.getTopRatedLaptops);
router.get("/category/:categoryId", laptopController.getLaptopsByCategory);
router.get("/slug/:slug", laptopController.getLaptopBySlug);
router.get("/:id", laptopController.getLaptop);
router.get("/:id/related", laptopController.getRelatedLaptops);

// Review routes for laptops
router.get("/:laptopId/reviews", reviewController.getLaptopReviews);
router.post("/:laptopId/reviews", protect, reviewController.addReview);

// Protected routes - Admin only
router.post("/", protect, authorize("admin"), laptopController.createLaptop);
router.put("/:id", protect, authorize("admin"), laptopController.updateLaptop);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  laptopController.deleteLaptop
);

module.exports = router;

const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const reviewController = require("../controllers/reviewController");

// Public routes
router.get("/:id", reviewController.getReview);

// Protected routes - requires authentication
router.get("/user", protect, reviewController.getUserReviews);
router.put("/:id", protect, reviewController.updateReview);
router.delete("/:id", protect, reviewController.deleteReview);
router.put("/:id/vote", protect, reviewController.voteReview);

// Admin routes
router.put(
  "/:id/approve",
  protect,
  authorize("admin"),
  reviewController.approveReview
);

module.exports = router;

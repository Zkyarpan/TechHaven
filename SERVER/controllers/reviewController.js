const Review = require("../models/Review");
const Laptop = require("../models/Laptop");
const Order = require("../models/Order");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");
const fs = require("fs");

/**
 * @desc    Get reviews for a laptop
 * @route   GET /api/laptops/:laptopId/reviews
 * @access  Public
 */
exports.getLaptopReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ laptop: req.params.laptopId })
    .populate({
      path: "user",
      select: "name",
    })
    .sort("-createdAt");

  res.status(200).json({
    count: reviews.length,
    data: reviews,
  });
});

/**
 * @desc    Get single review
 * @route   GET /api/reviews/:id
 * @access  Public
 */
exports.getReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate({
      path: "user",
      select: "name",
    })
    .populate({
      path: "laptop",
      select: "name brand images",
    });

  if (!review) {
    return res
      .status(404)
      .json({ message: `Review not found with id of ${req.params.id}` });
  }

  res.status(200).json(review);
});

/**
 * @desc    Add review
 * @route   POST /api/laptops/:laptopId/reviews
 * @access  Private
 */
exports.addReview = asyncHandler(async (req, res) => {
  // Set laptop ID and user ID
  req.body.laptop = req.params.laptopId;
  req.body.user = req.user.id;

  // Check if laptop exists
  const laptop = await Laptop.findById(req.params.laptopId);

  if (!laptop) {
    return res
      .status(404)
      .json({ message: `Laptop not found with id of ${req.params.laptopId}` });
  }

  // Check if user has already reviewed this laptop
  const existingReview = await Review.findOne({
    laptop: req.params.laptopId,
    user: req.user.id,
  });

  if (existingReview) {
    return res
      .status(400)
      .json({ message: "You have already reviewed this laptop" });
  }

  // Check if the user has purchased this laptop (verified purchase)
  const userOrders = await Order.find({
    user: req.user.id,
    "orderItems.laptop": req.params.laptopId,
    status: "delivered",
  });

  // Set verified purchase flag
  req.body.isVerifiedPurchase = userOrders.length > 0;

  // Process Images
  if (req.files) {
    let images = [];

    // Check if req.files.images is an array
    const imageFiles = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    // Loop through images and save
    for (const file of imageFiles) {
      // Create custom filename
      const filename = `review-${Date.now()}${path.parse(file.name).ext}`;

      // Move file to upload path
      file.mv(`./public/uploads/reviews/${filename}`, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Problem with file upload" });
        }
      });

      images.push(`/uploads/reviews/${filename}`);
    }

    // Add images to req.body
    req.body.images = images;
  }

  const review = await Review.create(req.body);

  res.status(201).json(review);
});

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
exports.updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return res
      .status(404)
      .json({ message: `Review not found with id of ${req.params.id}` });
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Not authorized to update this review" });
  }

  // Process Images
  if (req.files) {
    let images = [];

    // Check if req.files.images is an array
    const imageFiles = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    // Loop through images and save
    for (const file of imageFiles) {
      // Create custom filename
      const filename = `review-${Date.now()}${path.parse(file.name).ext}`;

      // Move file to upload path
      file.mv(`./public/uploads/reviews/${filename}`, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Problem with file upload" });
        }
      });

      images.push(`/uploads/reviews/${filename}`);
    }

    // If images are being updated, add them to req.body
    // If not, keep the existing images
    req.body.images =
      images.length > 0 ? [...review.images, ...images] : review.images;
  }

  // Set update timestamp
  req.body.updatedAt = Date.now();

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(review);
});

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res
      .status(404)
      .json({ message: `Review not found with id of ${req.params.id}` });
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this review" });
  }

  // Delete review images
  if (review.images && review.images.length > 0) {
    review.images.forEach((image) => {
      const imagePath = path.join(__dirname, "../public", image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
  }

  await review.deleteOne();

  res.status(200).json({ message: "Review removed successfully" });
});

/**
 * @desc    Get user reviews
 * @route   GET /api/reviews/user
 * @access  Private
 */
exports.getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user.id })
    .populate({
      path: "laptop",
      select: "name brand images",
    })
    .sort("-createdAt");

  res.status(200).json({
    count: reviews.length,
    data: reviews,
  });
});

/**
 * @desc    Vote review as helpful
 * @route   PUT /api/reviews/:id/vote
 * @access  Private
 */
exports.voteReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return res
      .status(404)
      .json({ message: `Review not found with id of ${req.params.id}` });
  }

  // Increment helpful votes
  review.helpfulVotes += 1;

  await review.save();

  res.status(200).json(review);
});

/**
 * @desc    Approve or reject review (admin only)
 * @route   PUT /api/reviews/:id/approve
 * @access  Private/Admin
 */
exports.approveReview = asyncHandler(async (req, res) => {
  const { isApproved } = req.body;

  if (isApproved === undefined) {
    return res
      .status(400)
      .json({ message: "Please provide isApproved status" });
  }

  let review = await Review.findById(req.params.id);

  if (!review) {
    return res
      .status(404)
      .json({ message: `Review not found with id of ${req.params.id}` });
  }

  review.isApproved = isApproved;
  review = await review.save();

  res.status(200).json(review);
});

const Laptop = require("../models/Laptop");
const Category = require("../models/Category");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");
const fs = require("fs");

/**
 * @desc    Get all laptops (with filtering, sorting, pagination)
 * @route   GET /api/laptops
 * @access  Public
 */
exports.getLaptops = asyncHandler(async (req, res) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from filtering
  const removeFields = ["select", "sort", "page", "limit", "search"];

  // Remove fields from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Laptop.find(JSON.parse(queryStr));

  // Search functionality
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, "i");
    query = query.find({
      $or: [
        { name: searchRegex },
        { brand: searchRegex },
        { processor: searchRegex },
        { description: searchRegex },
      ],
    });
  }

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Laptop.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const laptops = await query.populate("category", "name slug");

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    count: laptops.length,
    pagination,
    data: laptops,
  });
});

/**
 * @desc    Get single laptop
 * @route   GET /api/laptops/:id
 * @access  Public
 */
exports.getLaptop = asyncHandler(async (req, res) => {
  const laptop = await Laptop.findById(req.params.id)
    .populate("category", "name slug")
    .populate({
      path: "reviews",
      select: "rating title comment user createdAt",
    });

  if (!laptop) {
    return res
      .status(404)
      .json({ message: `Laptop not found with id of ${req.params.id}` });
  }

  res.status(200).json(laptop);
});

/**
 * @desc    Get laptop by slug
 * @route   GET /api/laptops/slug/:slug
 * @access  Public
 */
exports.getLaptopBySlug = asyncHandler(async (req, res) => {
  const laptop = await Laptop.findOne({ slug: req.params.slug })
    .populate("category", "name slug")
    .populate({
      path: "reviews",
      select: "rating title comment user createdAt",
    });

  if (!laptop) {
    return res
      .status(404)
      .json({ message: `Laptop not found with slug of ${req.params.slug}` });
  }

  res.status(200).json(laptop);
});

/**
 * @desc    Create new laptop
 * @route   POST /api/laptops
 * @access  Private/Admin
 */
exports.createLaptop = asyncHandler(async (req, res) => {
  // If category is provided, check if it exists
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res
        .status(404)
        .json({
          message: `Category not found with id of ${req.body.category}`,
        });
    }
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
      const filename = `laptop-${Date.now()}${path.parse(file.name).ext}`;

      // Move file to upload path
      file.mv(`./public/uploads/laptops/${filename}`, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Problem with file upload" });
        }
      });

      images.push(`/uploads/laptops/${filename}`);
    }

    // Add images to req.body
    req.body.images = images;
  }

  const laptop = await Laptop.create(req.body);

  res.status(201).json(laptop);
});

/**
 * @desc    Update laptop
 * @route   PUT /api/laptops/:id
 * @access  Private/Admin
 */
exports.updateLaptop = asyncHandler(async (req, res) => {
  let laptop = await Laptop.findById(req.params.id);

  if (!laptop) {
    return res
      .status(404)
      .json({ message: `Laptop not found with id of ${req.params.id}` });
  }

  // If category is provided, check if it exists
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res
        .status(404)
        .json({
          message: `Category not found with id of ${req.body.category}`,
        });
    }
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
      const filename = `laptop-${Date.now()}${path.parse(file.name).ext}`;

      // Move file to upload path
      file.mv(`./public/uploads/laptops/${filename}`, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Problem with file upload" });
        }
      });

      images.push(`/uploads/laptops/${filename}`);
    }

    // If images are being updated, add them to req.body
    // If not, keep the existing images
    req.body.images =
      images.length > 0 ? [...laptop.images, ...images] : laptop.images;
  }

  // Update timestamp
  req.body.updatedAt = Date.now();

  laptop = await Laptop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(laptop);
});

/**
 * @desc    Delete laptop
 * @route   DELETE /api/laptops/:id
 * @access  Private/Admin
 */
exports.deleteLaptop = asyncHandler(async (req, res) => {
  const laptop = await Laptop.findById(req.params.id);

  if (!laptop) {
    return res
      .status(404)
      .json({ message: `Laptop not found with id of ${req.params.id}` });
  }

  // Delete images from file system
  if (laptop.images && laptop.images.length > 0) {
    laptop.images.forEach((image) => {
      const imagePath = path.join(__dirname, "../public", image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
  }

  await laptop.deleteOne();

  res.status(200).json({ message: "Laptop removed successfully" });
});

/**
 * @desc    Get featured laptops
 * @route   GET /api/laptops/featured
 * @access  Public
 */
exports.getFeaturedLaptops = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 8;

  const laptops = await Laptop.find({ isFeatured: true })
    .limit(limit)
    .populate("category", "name slug");

  res.status(200).json(laptops);
});

/**
 * @desc    Get top rated laptops
 * @route   GET /api/laptops/top-rated
 * @access  Public
 */
exports.getTopRatedLaptops = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;

  const laptops = await Laptop.find({
    averageRating: { $gt: 4 },
    numReviews: { $gt: 0 },
  })
    .sort({ averageRating: -1 })
    .limit(limit)
    .populate("category", "name slug");

  res.status(200).json(laptops);
});

/**
 * @desc    Get laptops by category
 * @route   GET /api/laptops/category/:categoryId
 * @access  Public
 */
exports.getLaptopsByCategory = asyncHandler(async (req, res) => {
  const laptops = await Laptop.find({
    category: req.params.categoryId,
  }).populate("category", "name slug");

  res.status(200).json({
    count: laptops.length,
    data: laptops,
  });
});

/**
 * @desc    Get related laptops
 * @route   GET /api/laptops/:id/related
 * @access  Public
 */
exports.getRelatedLaptops = asyncHandler(async (req, res) => {
  const laptop = await Laptop.findById(req.params.id);

  if (!laptop) {
    return res
      .status(404)
      .json({ message: `Laptop not found with id of ${req.params.id}` });
  }

  const limit = parseInt(req.query.limit, 10) || 4;

  const laptops = await Laptop.find({
    _id: { $ne: req.params.id },
    $or: [
      { category: laptop.category },
      { brand: laptop.brand },
      { type: laptop.type },
    ],
  })
    .limit(limit)
    .populate("category", "name slug");

  res.status(200).json(laptops);
});

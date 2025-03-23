const Laptop = require("../models/Laptop");
const Category = require("../models/Category");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

/**
 * @desc    Get all laptops (with filtering, sorting, pagination)
 * @route   GET /api/laptops
 * @access  Public
 */
exports.getLaptops = asyncHandler(async (req, res) => {
  try {
    // Check database connection first
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection is not ready");
    }

    // Basic query - avoid initial filters that might exclude data
    let query = {};

    // Copy req.query without modifying initial query yet
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ["select", "sort", "page", "limit", "search"];

    // Remove fields from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string and handle any operators if needed
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Parse back to object
    let parsedQuery = JSON.parse(queryStr);

    // Only apply filters if they are meaningful
    if (Object.keys(parsedQuery).length > 0) {
      query = parsedQuery;
    }

    // Create base query
    let laptopQuery = Laptop.find(query);

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      laptopQuery = laptopQuery.find({
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { processor: searchRegex },
          { description: searchRegex },
        ],
      });
    }

    // Select fields if requested
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      laptopQuery = laptopQuery.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      laptopQuery = laptopQuery.sort(sortBy);
    } else {
      // Default sort by creation date, newest first
      laptopQuery = laptopQuery.sort("-createdAt");
    }

    // Set safe populate options
    const populateOptions = { strictPopulate: false };

    // Only try to populate if the field exists
    try {
      laptopQuery = laptopQuery.populate(
        "category",
        "name slug",
        null,
        populateOptions
      );
    } catch (error) {
      console.log("Category population skipped:", error.message);
    }

    // Count total before pagination (for accurate count)
    const totalCount = await Laptop.countDocuments(laptopQuery.getQuery());

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    laptopQuery = laptopQuery.skip(startIndex).limit(limit);

    // Execute query
    const laptops = await laptopQuery;

    // Fix any laptops with incorrect isAvailable flags
    for (const laptop of laptops) {
      // If isAvailable doesn't match stock status, update it
      const stockStatus = laptop.stock > 0;
      if (laptop.isAvailable !== stockStatus) {
        console.log(`Fixing isAvailable flag for laptop ${laptop._id}`);
        laptop.isAvailable = stockStatus;
        await laptop.save();
      }
    }

    // Console log for debugging
    console.log(`Found ${laptops.length} laptops out of ${totalCount} total`);

    // Pagination result
    const pagination = {};

    if (endIndex < totalCount) {
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
      total: totalCount,
      pagination,
      data: laptops,
    });
  } catch (error) {
    console.error("Error in getLaptops:", error);

    // Provide specific error for database connection issues
    if (
      error.message.includes("Database connection") ||
      mongoose.connection.readyState !== 1
    ) {
      return res.status(503).json({
        message: "Database connection error. Please try again later.",
        error: "Service Unavailable",
      });
    }

    res.status(500).json({
      message: "Server error while fetching laptops",
      error: error.message,
    });
  }
});

// Other controller methods remain the same...

/**
 * @desc    Update laptop
 * @route   PUT /api/laptops/:id
 * @access  Private/Admin
 */
exports.updateLaptop = asyncHandler(async (req, res) => {
  try {
    let laptop = await Laptop.findById(req.params.id);

    if (!laptop) {
      return res
        .status(404)
        .json({ message: `Laptop not found with id of ${req.params.id}` });
    }

    // If category is provided, check if it exists
    if (req.body.category) {
      try {
        const category = await Category.findById(req.body.category);
        if (!category) {
          return res.status(404).json({
            message: `Category not found with id of ${req.body.category}`,
          });
        }
      } catch (error) {
        // If Category model doesn't exist, just skip this validation
        console.log("Skipping category validation:", error.message);
      }
    }

    // Use req.body for JSON data
    let laptopData = { ...req.body };

    // Handle features array if it comes as a string
    if (typeof req.body.features === "string") {
      laptopData.features = req.body.features
        .split(",")
        .map((feature) => feature.trim());
    }

    // Process stock and isAvailable
    if (laptopData.stock !== undefined) {
      laptopData.stock = Number(laptopData.stock);
      // Always set isAvailable based on stock
      laptopData.isAvailable = laptopData.stock > 0;
    }

    // Initialize images array with existing images if provided
    let images = [];

    // Keep existing images if they were sent in the request
    if (req.body.existingImages) {
      const existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];

      images = [...existingImages];
    } else if (!req.files || !req.files.images) {
      // If no new images and no existing images specified, keep the current ones
      images = laptop.images;
    }

    // Handle new uploaded images
    if (req.files && req.files.images) {
      // Make sure images is an array
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      console.log(`Processing ${imageFiles.length} new uploaded image files`);

      // Create upload directory if it doesn't exist
      const uploadDir = path.join(__dirname, "../public/uploads/laptops");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`Created directory: ${uploadDir}`);
      }

      // Save each image
      for (const file of imageFiles) {
        // Create custom filename with timestamp to prevent duplicates
        const filename = `laptop-${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${path.parse(file.name).ext}`;
        const filePath = path.join(uploadDir, filename);

        // Move the file to the upload directory
        await file.mv(filePath);
        console.log(`File saved to: ${filePath}`);

        // Store the relative path to be saved in the database
        images.push(`/uploads/laptops/${filename}`);
      }
    }

    // Add images to laptop data
    laptopData.images = images;

    // Update timestamp
    laptopData.updatedAt = Date.now();

    // Update the laptop with the new data
    laptop = await Laptop.findByIdAndUpdate(req.params.id, laptopData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(laptop);
  } catch (error) {
    console.error("Error updating laptop:", error);
    res.status(500).json({
      message: "Server error while updating laptop",
      error: error.message,
    });
  }
});

/**
 * @desc    Get laptop by slug
 * @route   GET /api/laptops/slug/:slug
 * @access  Public
 */
exports.getLaptopBySlug = asyncHandler(async (req, res) => {
  try {
    // Use a safe populate approach with strictPopulate: false
    const populateOptions = { strictPopulate: false };
    const laptop = await Laptop.findOne({ slug: req.params.slug })
      .populate("category", "name slug", null, populateOptions)
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
  } catch (error) {
    console.error("Error in getLaptopBySlug:", error);
    res.status(500).json({
      message: "Server error while fetching laptop by slug",
      error: error.message,
    });
  }
});

/**
 * @desc    Get single laptop by ID
 * @route   GET /api/laptops/:id
 * @access  Public
 */
exports.getLaptop = asyncHandler(async (req, res) => {
  try {
    // Check if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid laptop ID format",
      });
    }

    // Use a safe populate approach with strictPopulate: false
    const populateOptions = { strictPopulate: false };
    const laptop = await Laptop.findById(req.params.id)
      .populate("category", "name slug", null, populateOptions)
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
  } catch (error) {
    console.error("Error in getLaptop:", error);
    res.status(500).json({
      message: "Server error while fetching laptop",
      error: error.message,
    });
  }
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
      return res.status(404).json({
        message: `Category not found with id of ${req.body.category}`,
      });
    }
  }

  // Use req.body for JSON data
  let laptopData = { ...req.body };

  // Handle features array if it comes as a string
  if (typeof req.body.features === "string") {
    laptopData.features = req.body.features
      .split(",")
      .map((feature) => feature.trim());
  }

  // Ensure stock and isAvailable are properly set
  if (laptopData.stock === undefined) {
    laptopData.stock = 10; // Default to 10 if not specified
  } else {
    laptopData.stock = Number(laptopData.stock);
  }

  // Always set isAvailable based on stock
  laptopData.isAvailable = laptopData.stock > 0;

  let images = [];

  // Check if files were uploaded
  if (req.files) {
    // Handle images upload
    if (req.files.images) {
      // Make sure images is an array
      const imageFiles = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      console.log(`Processing ${imageFiles.length} uploaded image files`);

      // Create upload directory if it doesn't exist
      const uploadDir = path.join(__dirname, "../public/uploads/laptops");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`Created directory: ${uploadDir}`);
      }

      // Save each image
      for (const file of imageFiles) {
        // Create custom filename with timestamp to prevent duplicates
        const filename = `laptop-${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${path.parse(file.name).ext}`;
        const filePath = path.join(uploadDir, filename);

        // Move the file to the upload directory
        await file.mv(filePath);
        console.log(`File saved to: ${filePath}`);

        // Store the relative path to be saved in the database
        images.push(`/uploads/laptops/${filename}`);
      }
    }
  }

  // Add images to laptop data
  laptopData.images = images;

  // Create the laptop record
  const laptop = await Laptop.create(laptopData);

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
      return res.status(404).json({
        message: `Category not found with id of ${req.body.category}`,
      });
    }
  }

  // Use req.body for JSON data
  let laptopData = { ...req.body };

  // Handle features array if it comes as a string
  if (typeof req.body.features === "string") {
    laptopData.features = req.body.features
      .split(",")
      .map((feature) => feature.trim());
  }

  // Process stock and isAvailable
  if (laptopData.stock !== undefined) {
    laptopData.stock = Number(laptopData.stock);
    // Always set isAvailable based on stock
    laptopData.isAvailable = laptopData.stock > 0;
  }

  // Initialize images array with existing images if provided
  let images = [];

  // Keep existing images if they were sent in the request
  if (req.body.existingImages) {
    const existingImages = Array.isArray(req.body.existingImages)
      ? req.body.existingImages
      : [req.body.existingImages];

    images = [...existingImages];
  } else if (!req.files || !req.files.images) {
    // If no new images and no existing images specified, keep the current ones
    images = laptop.images;
  }

  // Handle new uploaded images
  if (req.files && req.files.images) {
    // Make sure images is an array
    const imageFiles = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    console.log(`Processing ${imageFiles.length} new uploaded image files`);

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(__dirname, "../public/uploads/laptops");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`Created directory: ${uploadDir}`);
    }

    // Save each image
    for (const file of imageFiles) {
      // Create custom filename with timestamp to prevent duplicates
      const filename = `laptop-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.parse(file.name).ext}`;
      const filePath = path.join(uploadDir, filename);

      // Move the file to the upload directory
      await file.mv(filePath);
      console.log(`File saved to: ${filePath}`);

      // Store the relative path to be saved in the database
      images.push(`/uploads/laptops/${filename}`);
    }
  }

  // Add images to laptop data
  laptopData.images = images;

  // Update timestamp
  laptopData.updatedAt = Date.now();

  // Update the laptop with the new data
  laptop = await Laptop.findByIdAndUpdate(req.params.id, laptopData, {
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
        console.log(`Deleted image: ${imagePath}`);
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

  // Use a safe populate approach with strictPopulate: false
  const populateOptions = { strictPopulate: false };
  const laptops = await Laptop.find({ isFeatured: true })
    .limit(limit)
    .populate("category", "name slug", null, populateOptions);

  res.status(200).json(laptops);
});

/**
 * @desc    Get top rated laptops
 * @route   GET /api/laptops/top-rated
 * @access  Public
 */
exports.getTopRatedLaptops = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 5;

  // Use a safe populate approach with strictPopulate: false
  const populateOptions = { strictPopulate: false };
  const laptops = await Laptop.find({
    rating: { $gt: 4 },
    numReviews: { $gt: 0 },
  })
    .sort({ rating: -1 })
    .limit(limit)
    .populate("category", "name slug", null, populateOptions);

  res.status(200).json(laptops);
});

/**
 * @desc    Get laptops by category
 * @route   GET /api/laptops/category/:categoryId
 * @access  Public
 */
exports.getLaptopsByCategory = asyncHandler(async (req, res) => {
  // Use a safe populate approach with strictPopulate: false
  const populateOptions = { strictPopulate: false };
  const laptops = await Laptop.find({
    category: req.params.categoryId,
  }).populate("category", "name slug", null, populateOptions);

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

  // Use a safe populate approach with strictPopulate: false
  const populateOptions = { strictPopulate: false };
  const laptops = await Laptop.find({
    _id: { $ne: req.params.id },
    $or: [
      { category: laptop.category },
      { brand: laptop.brand },
      { type: laptop.type },
    ],
  })
    .limit(limit)
    .populate("category", "name slug", null, populateOptions);

  res.status(200).json(laptops);
});

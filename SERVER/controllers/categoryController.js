const Category = require("../models/Category");
const asyncHandler = require("../middleware/asyncHandler");
const path = require("path");
const fs = require("fs");

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
exports.getCategories = asyncHandler(async (req, res) => {
  try {
    let query = Category.find();

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("displayOrder name");
    }

    // Execute query
    const categories = await query;

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories",
      error: error.message,
    });
  }
});

/**
 * @desc    Get category tree structure
 * @route   GET /api/categories/tree
 * @access  Public
 */
exports.getCategoryTree = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().sort("displayOrder name");

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching category tree:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching category tree",
      error: error.message,
    });
  }
});

/**
 * @desc    Get featured categories
 * @route   GET /api/categories/featured
 * @access  Public
 */
exports.getFeaturedCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort("displayOrder")
      .limit(6);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured categories",
      error: error.message,
    });
  }
});

/**
 * @desc    Get single category
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(`Error fetching category ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching category",
      error: error.message,
    });
  }
});

/**
 * @desc    Get category by slug
 * @route   GET /api/categories/slug/:slug
 * @access  Public
 */
exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found with slug of ${req.params.slug}`,
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(`Error fetching category by slug ${req.params.slug}:`, error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching category by slug",
      error: error.message,
    });
  }
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
exports.createCategory = asyncHandler(async (req, res) => {
  try {
    let categoryData = { ...req.body };

    // Handle file upload
    if (req.files && req.files.image) {
      const file = req.files.image;

      // Create filename
      const filename = `category-${Date.now()}${path.parse(file.name).ext}`;

      // Create directory if it doesn't exist
      const uploadDir = path.join(__dirname, "../public/uploads/categories");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Move file to upload directory
      await file.mv(path.join(uploadDir, filename));

      // Set image path in category data
      categoryData.image = `/uploads/categories/${filename}`;
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating category",
      error: error.message,
    });
  }
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
exports.updateCategory = asyncHandler(async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found with id of ${req.params.id}`,
      });
    }

    let categoryData = { ...req.body };

    // Handle file upload
    if (req.files && req.files.image) {
      const file = req.files.image;

      // Delete old image if exists
      if (category.image) {
        const oldImagePath = path.join(__dirname, "../public", category.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Create filename
      const filename = `category-${Date.now()}${path.parse(file.name).ext}`;

      // Create directory if it doesn't exist
      const uploadDir = path.join(__dirname, "../public/uploads/categories");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Move file to upload directory
      await file.mv(path.join(uploadDir, filename));

      // Set image path in category data
      categoryData.image = `/uploads/categories/${filename}`;
    }

    category = await Category.findByIdAndUpdate(req.params.id, categoryData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error(`Error updating category ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Server error while updating category",
      error: error.message,
    });
  }
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
exports.deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category not found with id of ${req.params.id}`,
      });
    }

    // Delete image if exists
    if (category.image) {
      const imagePath = path.join(__dirname, "../public", category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(`Error deleting category ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting category",
      error: error.message,
    });
  }
});

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
  let query;

  // Finding resource
  query = Category.find();

  // Filter by parent (top-level or subcategories)
  if (req.query.parent === "null" || req.query.parent === "undefined") {
    query = query.where("parent").equals(null);
  } else if (req.query.parent) {
    query = query.where("parent").equals(req.query.parent);
  }

  // Filter by featured
  if (req.query.featured === "true") {
    query = query.where("featured").equals(true);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("name");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Category.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Populate subcategories
  if (req.query.populate === "true") {
    query = query.populate("subcategories");
  }

  // Execute query
  const categories = await query;

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
    count: categories.length,
    pagination,
    data: categories,
  });
});

/**
 * @desc    Get single category
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate(
    "subcategories"
  );

  if (!category) {
    return res
      .status(404)
      .json({ message: `Category not found with id of ${req.params.id}` });
  }

  res.status(200).json(category);
});

/**
 * @desc    Get category by slug
 * @route   GET /api/categories/slug/:slug
 * @access  Public
 */
exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate(
    "subcategories"
  );

  if (!category) {
    return res
      .status(404)
      .json({ message: `Category not found with slug of ${req.params.slug}` });
  }

  res.status(200).json(category);
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
exports.createCategory = asyncHandler(async (req, res) => {
  // Check if parent category exists if specified
  if (req.body.parent) {
    const parentCategory = await Category.findById(req.body.parent);
    if (!parentCategory) {
      return res
        .status(404)
        .json({
          message: `Parent category not found with id of ${req.body.parent}`,
        });
    }
  }

  // Process Image
  if (req.files && req.files.image) {
    const file = req.files.image;

    // Create custom filename
    const filename = `category-${Date.now()}${path.parse(file.name).ext}`;

    // Move file to upload path
    file.mv(`./public/uploads/categories/${filename}`, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Problem with file upload" });
      }
    });

    // Add image to req.body
    req.body.image = `/uploads/categories/${filename}`;
  }

  const category = await Category.create(req.body);

  res.status(201).json(category);
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
exports.updateCategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return res
      .status(404)
      .json({ message: `Category not found with id of ${req.params.id}` });
  }

  // Check if parent category exists if specified
  if (req.body.parent) {
    const parentCategory = await Category.findById(req.body.parent);
    if (!parentCategory) {
      return res
        .status(404)
        .json({
          message: `Parent category not found with id of ${req.body.parent}`,
        });
    }

    // Prevent circular reference
    if (req.body.parent === req.params.id) {
      return res
        .status(400)
        .json({ message: "Category cannot be its own parent" });
    }
  }

  // Process Image
  if (req.files && req.files.image) {
    const file = req.files.image;

    // Create custom filename
    const filename = `category-${Date.now()}${path.parse(file.name).ext}`;

    // Move file to upload path
    file.mv(`./public/uploads/categories/${filename}`, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Problem with file upload" });
      }
    });

    // Delete old image
    if (category.image) {
      const oldImagePath = path.join(__dirname, "../public", category.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Add image to req.body
    req.body.image = `/uploads/categories/${filename}`;
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(category);
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res
      .status(404)
      .json({ message: `Category not found with id of ${req.params.id}` });
  }

  // Check if category has subcategories
  const subcategories = await Category.countDocuments({
    parent: req.params.id,
  });
  if (subcategories > 0) {
    return res
      .status(400)
      .json({ message: "Cannot delete category with subcategories" });
  }

  // Delete image if exists
  if (category.image) {
    const imagePath = path.join(__dirname, "../public", category.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await category.deleteOne();

  res.status(200).json({ message: "Category removed successfully" });
});

/**
 * @desc    Get category tree (hierarchical structure)
 * @route   GET /api/categories/tree
 * @access  Public
 */
exports.getCategoryTree = asyncHandler(async (req, res) => {
  // First get all parent categories
  const parentCategories = await Category.find({ parent: null }).sort("name");

  // Then populate their subcategories
  const populatedCategories = [];

  for (const category of parentCategories) {
    const subcategories = await Category.find({ parent: category._id }).sort(
      "name"
    );

    populatedCategories.push({
      ...category._doc,
      subcategories,
    });
  }

  res.status(200).json(populatedCategories);
});

/**
 * @desc    Get featured categories
 * @route   GET /api/categories/featured
 * @access  Public
 */
exports.getFeaturedCategories = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 6;

  const categories = await Category.find({ featured: true })
    .limit(limit)
    .sort("name");

  res.status(200).json(categories);
});

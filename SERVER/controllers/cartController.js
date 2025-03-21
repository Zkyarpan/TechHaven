const Cart = require("../models/Cart");
const Laptop = require("../models/Laptop");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
exports.getUserCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate({
    path: "items.laptop",
    select: "name brand images price stock isAvailable",
  });

  if (!cart) {
    return res.status(200).json({
      items: [],
      totalItems: 0,
      subtotal: 0,
    });
  }

  // Check if any products in cart are no longer available or have insufficient stock
  const updatedItems = [];
  let cartModified = false;

  for (const item of cart.items) {
    if (!item.laptop) {
      // Item no longer exists
      cartModified = true;
      continue;
    }

    if (!item.laptop.isAvailable) {
      // Item no longer available
      cartModified = true;
      continue;
    }

    if (item.laptop.stock < item.quantity) {
      // Adjust quantity to available stock
      item.quantity = item.laptop.stock;
      cartModified = true;
    }

    updatedItems.push(item);
  }

  // Update cart if needed
  if (cartModified) {
    cart.items = updatedItems;
    await cart.save();
  }

  res.status(200).json(cart);
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
exports.addItemToCart = asyncHandler(async (req, res) => {
  const {
    laptopId,
    quantity = 1,
    warrantyOption = { id: "standard", name: "Standard Warranty", price: 0 },
  } = req.body;

  // Check if laptop exists and is available
  const laptop = await Laptop.findById(laptopId);

  if (!laptop) {
    return res
      .status(404)
      .json({ message: `Laptop not found with id of ${laptopId}` });
  }

  if (!laptop.isAvailable) {
    return res.status(400).json({ message: "Laptop is not available" });
  }

  if (laptop.stock < quantity) {
    return res
      .status(400)
      .json({ message: `Insufficient stock. Available: ${laptop.stock}` });
  }

  // Find user's cart or create one
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [],
      totalItems: 0,
      subtotal: 0,
    });
  }

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.laptop.toString() === laptopId
  );

  if (existingItemIndex !== -1) {
    // Update existing item
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    // Check if new quantity exceeds stock
    if (newQuantity > laptop.stock) {
      return res.status(400).json({
        message: `Cannot add more units. Maximum available: ${laptop.stock}`,
      });
    }

    cart.items[existingItemIndex].quantity = newQuantity;
    cart.items[existingItemIndex].warrantyOption = warrantyOption;
  } else {
    // Add new item
    cart.items.push({
      laptop: laptopId,
      quantity,
      price: laptop.price,
      warrantyOption,
    });
  }

  // Save cart
  await cart.save();

  // Return updated cart with populated laptop details
  const updatedCart = await Cart.findById(cart._id).populate({
    path: "items.laptop",
    select: "name brand images price stock isAvailable",
  });

  res.status(200).json(updatedCart);
});

/**
 * @desc    Update cart item
 * @route   PUT /api/cart/:itemId
 * @access  Private
 */
exports.updateCartItem = asyncHandler(async (req, res) => {
  const { quantity, warrantyOption } = req.body;
  const { itemId } = req.params;

  // Find user's cart
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Find the item in the cart
  const cartItem = cart.items.id(itemId);

  if (!cartItem) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  // Check laptop availability and stock
  const laptop = await Laptop.findById(cartItem.laptop);

  if (!laptop) {
    return res.status(404).json({ message: "Laptop no longer exists" });
  }

  if (!laptop.isAvailable) {
    return res.status(400).json({ message: "Laptop is not available" });
  }

  if (quantity && laptop.stock < quantity) {
    return res
      .status(400)
      .json({ message: `Insufficient stock. Available: ${laptop.stock}` });
  }

  // Update cart item
  if (quantity) cartItem.quantity = quantity;
  if (warrantyOption) cartItem.warrantyOption = warrantyOption;

  // Save cart
  await cart.save();

  // Return updated cart with populated laptop details
  const updatedCart = await Cart.findById(cart._id).populate({
    path: "items.laptop",
    select: "name brand images price stock isAvailable",
  });

  res.status(200).json(updatedCart);
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:itemId
 * @access  Private
 */
exports.removeCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  // Find user's cart
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Remove the item
  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

  // Save cart
  await cart.save();

  // Return updated cart with populated laptop details
  const updatedCart = await Cart.findById(cart._id).populate({
    path: "items.laptop",
    select: "name brand images price stock isAvailable",
  });

  res.status(200).json(updatedCart);
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
exports.clearCart = asyncHandler(async (req, res) => {
  // Find and delete user's cart
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(200).json({
    message: "Cart cleared successfully",
    items: [],
    totalItems: 0,
    subtotal: 0,
  });
});

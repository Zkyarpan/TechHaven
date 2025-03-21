const Order = require("../models/Order");
const Laptop = require("../models/Laptop");
const Cart = require("../models/Cart");
const asyncHandler = require("../middleware/asyncHandler");

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/orders/admin
 * @access  Private/Admin
 */
exports.getAdminOrders = asyncHandler(async (req, res) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from filtering
  const removeFields = ["select", "sort", "page", "limit"];

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
  query = Order.find(JSON.parse(queryStr)).populate({
    path: "user",
    select: "name email",
  });

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
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Order.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Execute query
  const orders = await query;

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
    count: orders.length,
    pagination,
    data: orders,
  });
});

/**
 * @desc    Get user orders
 * @route   GET /api/orders
 * @access  Private
 */
exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort("-createdAt");

  res.status(200).json(orders);
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate({
    path: "user",
    select: "name email",
  });

  if (!order) {
    return res
      .status(404)
      .json({ message: `Order not found with id of ${req.params.id}` });
  }

  // Make sure user owns order or is admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Not authorized to access this order" });
  }

  res.status(200).json(order);
});

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    tax,
    shippingCost,
    totalPrice,
    shippingMethod,
  } = req.body;

  // Validate required fields
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  if (!shippingAddress) {
    return res.status(400).json({ message: "No shipping address" });
  }

  if (!paymentMethod) {
    return res.status(400).json({ message: "No payment method" });
  }

  // Validate product availability and prices
  for (const item of orderItems) {
    const laptop = await Laptop.findById(item.laptop);

    if (!laptop) {
      return res
        .status(404)
        .json({ message: `Laptop not found with id of ${item.laptop}` });
    }

    if (laptop.stock < item.quantity) {
      return res.status(400).json({
        message: `${laptop.name} has insufficient stock. Available: ${laptop.stock}`,
      });
    }

    // Verify price matches what's in database
    if (laptop.price !== item.price) {
      return res
        .status(400)
        .json({ message: `Price mismatch for ${laptop.name}` });
    }

    // Decrement stock
    laptop.stock -= item.quantity;
    if (laptop.stock === 0) {
      laptop.isAvailable = false;
    }
    await laptop.save();
  }

  // Create order
  const order = await Order.create({
    user: req.user.id,
    orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    tax,
    shippingCost,
    totalPrice,
    shippingMethod,
  });

  // Clear user's cart after successful order
  await Cart.findOneAndDelete({ user: req.user.id });

  res.status(201).json(order);
});

/**
 * @desc    Update order to paid
 * @route   PUT /api/orders/:id/pay
 * @access  Private
 */
exports.updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res
      .status(404)
      .json({ message: `Order not found with id of ${req.params.id}` });
  }

  // Verify user owns order or is admin
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Not authorized to update this order" });
  }

  // Update order
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address,
  };

  const updatedOrder = await order.save();

  res.status(200).json(updatedOrder);
});

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Please provide status" });
  }

  // Validate status
  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ message: `Status must be one of: ${validStatuses.join(", ")}` });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res
      .status(404)
      .json({ message: `Order not found with id of ${req.params.id}` });
  }

  // If order is being cancelled, restore product stock
  if (status === "cancelled" && order.status !== "cancelled") {
    for (const item of order.orderItems) {
      const laptop = await Laptop.findById(item.laptop);

      if (laptop) {
        laptop.stock += item.quantity;
        laptop.isAvailable = true;
        await laptop.save();
      }
    }
  }

  // If order is being delivered
  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  // Update order status
  order.status = status;
  order.updatedAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json(updatedOrder);
});

/**
 * @desc    Update shipping details
 * @route   PUT /api/orders/:id/shipping
 * @access  Private/Admin
 */
exports.updateShipping = asyncHandler(async (req, res) => {
  const { trackingNumber, estimatedDelivery } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res
      .status(404)
      .json({ message: `Order not found with id of ${req.params.id}` });
  }

  // Update shipping details
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
  order.updatedAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json(updatedOrder);
});

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res
      .status(404)
      .json({ message: `Order not found with id of ${req.params.id}` });
  }

  // Make sure user owns order or is admin
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Not authorized to cancel this order" });
  }

  // Can only cancel if order is pending or processing
  if (order.status !== "pending" && order.status !== "processing") {
    return res
      .status(400)
      .json({ message: `Cannot cancel order in ${order.status} status` });
  }

  // Restore stock
  for (const item of order.orderItems) {
    const laptop = await Laptop.findById(item.laptop);

    if (laptop) {
      laptop.stock += item.quantity;
      laptop.isAvailable = true;
      await laptop.save();
    }
  }

  // Update order
  order.status = "cancelled";
  order.updatedAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json(updatedOrder);
});

/**
 * @desc    Delete order
 * @route   DELETE /api/orders/:id
 * @access  Private/Admin
 */
exports.deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res
      .status(404)
      .json({ message: `Order not found with id of ${req.params.id}` });
  }

  await order.deleteOne();

  res.status(200).json({ message: "Order removed" });
});

/**
 * @desc    Get order count
 * @route   GET /api/orders/count
 * @access  Private/Admin
 */
exports.getOrderCount = asyncHandler(async (req, res) => {
  const count = await Order.countDocuments();
  res.status(200).json({ count });
});

/**
 * @desc    Get total sales
 * @route   GET /api/orders/total-sales
 * @access  Private/Admin
 */
exports.getTotalSales = asyncHandler(async (req, res) => {
  const totalSales = await Order.aggregate([
    {
      $match: { status: { $ne: "cancelled" } },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  res.status(200).json({
    totalSales: totalSales.length > 0 ? totalSales[0].totalSales : 0,
  });
});

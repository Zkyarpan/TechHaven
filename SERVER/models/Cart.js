const mongoose = require("mongoose");

// Cart Item Schema (Sub-document)
const CartItemSchema = new mongoose.Schema(
  {
    laptop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laptop",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less than 1"],
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    warrantyOption: {
      id: {
        type: String,
        default: "standard",
      },
      name: {
        type: String,
        default: "Standard Warranty",
      },
      price: {
        type: Number,
        default: 0,
        min: [0, "Warranty price cannot be negative"],
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    _id: true, // Enable _id for subdocuments
  }
);

// Cart Schema
const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One cart per user
    },
    items: [CartItemSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total items in cart
CartSchema.virtual("totalItems").get(function () {
  if (!this.items || this.items.length === 0) return 0;
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for cart subtotal
CartSchema.virtual("subtotal").get(function () {
  if (!this.items || this.items.length === 0) return 0;

  return this.items.reduce((total, item) => {
    // Product price
    const productTotal = item.price * item.quantity;

    // Warranty price if any
    const warrantyTotal =
      item.warrantyOption && item.warrantyOption.price
        ? item.warrantyOption.price * item.quantity
        : 0;

    return total + productTotal + warrantyTotal;
  }, 0);
});

// Update timestamps on save
CartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Cart", CartSchema);

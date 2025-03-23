const mongoose = require("mongoose");
const slugify = require("slugify");

const laptopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    brand: {
      type: String,
      required: [true, "Please add a brand"],
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    processor: {
      type: String,
      trim: true,
    },
    ram: {
      type: String,
      trim: true,
    },
    storage: {
      type: String,
      trim: true,
    },
    graphics: {
      type: String,
      trim: true,
    },
    display: {
      type: String,
      trim: true,
    },
    resolution: {
      type: String,
      trim: true,
    },
    battery: {
      type: String,
      trim: true,
    },
    connectivity: {
      type: String,
      trim: true,
    },
    ports: {
      type: String,
      trim: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    dimensions: {
      type: String,
      trim: true,
    },
    operatingSystem: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0.01, "Price must be greater than 0"],
    },
    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Please add stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 10,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    features: {
      type: [String],
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    warrantyOptions: [
      {
        id: String,
        name: String,
        duration: String,
        price: Number,
        coverage: String,
      },
    ],
    shippingOptions: [
      {
        id: String,
        name: String,
        duration: String,
        price: Number,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create laptop slug from the name
laptopSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }

  // IMPORTANT: Always ensure isAvailable is correctly set based on stock
  this.isAvailable = this.stock > 0;

  next();
});

// Add index for better search performance
laptopSchema.index({
  name: "text",
  brand: "text",
  description: "text",
  processor: "text",
});

module.exports = mongoose.model("Laptop", laptopSchema);

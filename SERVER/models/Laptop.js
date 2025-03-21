const mongoose = require('mongoose');
const slugify = require('slugify');

const LaptopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a laptop name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug: String,
  brand: {
    type: String,
    required: [true, 'Please specify the brand'],
    enum: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Microsoft', 'Razer', 'MSI', 'Samsung', 'Other']
  },
  type: {
    type: String,
    required: [true, 'Please specify the laptop type'],
    enum: ['Ultrabook', '2-in-1', 'Gaming', 'Budget', 'Business', 'Chromebook', 'Workstation']
  },
  processor: {
    type: String,
    required: [true, 'Please specify the processor']
  },
  ram: {
    type: String,
    required: [true, 'Please specify the RAM']
  },
  storage: {
    type: String,
    required: [true, 'Please specify the storage']
  },
  graphics: String,
  display: {
    type: String,
    required: [true, 'Please specify the display']
  },
  resolution: String,
  battery: String,
  connectivity: String,
  ports: String,
  weight: String,
  dimensions: String,
  operatingSystem: String,
  color: String,
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be positive']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price must be positive']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  features: {
    type: [String],
    required: [true, 'Please add at least one feature']
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one image']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create laptop slug from name
LaptopSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Cascade delete reviews when a laptop is deleted
LaptopSchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({ laptop: this._id });
  next();
});

// Reverse populate with virtuals
LaptopSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'laptop',
  justOne: false
});

module.exports = mongoose.model('Laptop', LaptopSchema);
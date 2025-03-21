const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  laptop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laptop',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Please add a title for your review'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  pros: {
    type: [String]
  },
  cons: {
    type: [String]
  },
  images: {
    type: [String]
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one review per laptop
ReviewSchema.index({ laptop: 1, user: 1 }, { unique: true });

// Static method to calculate average rating and save
ReviewSchema.statics.getAverageRating = async function(laptopId) {
  const obj = await this.aggregate([
    {
      $match: { laptop: laptopId }
    },
    {
      $group: {
        _id: '$laptop',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Laptop').findByIdAndUpdate(laptopId, {
      averageRating: obj[0]?.averageRating || 0,
      numReviews: obj[0]?.numReviews || 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.laptop);
});

// Call getAverageRating after remove
ReviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.laptop);
});

module.exports = mongoose.model('Review', ReviewSchema);
const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0.01
  },
  imageUrl: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  items: [wishlistItemSchema],
  itemCount: {
    type: Number,
    default: 0
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

// Update itemCount before saving
wishlistSchema.pre('save', function(next) {
  this.itemCount = this.items.length;
  this.updatedAt = new Date();
  next();
});

// Index for faster queries
wishlistSchema.index({ userId: 1 });
wishlistSchema.index({ 'items.productId': 1 });
wishlistSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
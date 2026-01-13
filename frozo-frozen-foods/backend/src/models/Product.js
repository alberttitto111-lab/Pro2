const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: true,
    min: 0.01,
    max: 10000,
    set: v => parseFloat(v.toFixed(2)) // Store with 2 decimal places
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Vegetables', 'Fruits', 'Ready Meals', 'Snacks'],
      message: '{VALUE} is not a valid category'
    }
  },
  weight: {
    type: String,
    required: [true, 'Weight is required'],
    trim: true,
    maxlength: [50, 'Weight cannot exceed 50 characters']
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function(v) {
        if (v === '') return true;
        
        try {
          new URL(v);
          
          // Accept various image URLs
          const imagePatterns = [
            /\.(jpeg|jpg|gif|png|webp|bmp|svg)(\?.*)?$/i,
            /unsplash\.com/i,
            /cloudinary\.com/i,
            /picsum\.photos/i,
            /images\.pexels\.com/i
          ];
          
          return imagePatterns.some(pattern => pattern.test(v));
        } catch {
          return false;
        }
      },
      message: 'Please provide a valid image URL'
    }
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
    set: v => parseFloat(v.toFixed(1)) // Store with 1 decimal place
  },
  reviewCount: {
    type: Number,
    min: [0, 'Review count cannot be negative'],
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Review count must be an integer'
    }
  },
  inStock: {
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

// Update updatedAt on save
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for better query performance
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
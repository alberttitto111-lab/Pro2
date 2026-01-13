const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
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
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
 tax: {
  type: Number,
  default: 0,
  get: function(v) { return parseFloat(v.toFixed(2)); },
  set: function(v) { return parseFloat(v.toFixed(2)); }
},
  total: {
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



// cartSchema.pre('save', function(next) {
  // Always recalculate everything
  // this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  // this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // this.shipping = this.subtotal > 50 ? 0 : 5.99;
  // this.tax = parseFloat((this.subtotal * 0.08).toFixed(2)); // Force 8% tax
  // this.total = parseFloat((this.subtotal + this.shipping + this.tax).toFixed(2));
  // this.updatedAt = new Date();
  // next();
// });


// Update totals before saving
cartSchema.pre('save', function(next) {
  // Calculate total items
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate subtotal
  // this.subtotal = this.items.reduce((sum, item) => {
  //   return sum + (item.price * item.quantity);
  // }, 0);
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  
  // Calculate shipping (free over $50)
  this.shipping = this.subtotal > 50 ? 0 : 5.99;
  
  // Calculate tax (8% on subtotal only, not including shipping)
  this.tax = parseFloat((this.subtotal * 0.08).toFixed(2));
  
  // Calculate total
  this.total = parseFloat((this.subtotal + this.shipping + this.tax).toFixed(2));
  
  // Update timestamp
  this.updatedAt = new Date();
  
  console.log('📊 Cart Calculations:');
  console.log(`   Subtotal: $${this.subtotal.toFixed(2)}`);
  console.log(`   Shipping: $${this.shipping.toFixed(2)}`);
  console.log(`   Tax (8%): $${this.tax.toFixed(2)}`);
  console.log(`   Total: $${this.total.toFixed(2)}`);
  
  next();
});

// Index for faster queries
cartSchema.index({ userId: 1 });
cartSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Cart', cartSchema);
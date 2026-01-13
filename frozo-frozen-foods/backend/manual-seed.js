const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./src/models/Product');

const testProduct = {
  name: 'Mixed Vegetables',
  description: 'A delicious mix of fresh frozen vegetables',
  price: 4.99,
  category: 'Vegetables',
  weight: '1kg Pack',
  imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
  rating: 4.8,
  reviewCount: 48
};

async function manualSeed() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/frozo_products';
    
    console.log('Connecting to:', mongoURI.replace(/:[^:]*@/, ':****@'));
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Add test product
    const product = new Product(testProduct);
    await product.save();
    
    console.log('✅ Test product added successfully!');
    console.log('Product ID:', product._id);
    console.log('Name:', product.name);
    console.log('Price:', product.price);
    
    // Verify it's in database
    const count = await Product.countDocuments();
    console.log('Total products in database:', count);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

manualSeed();
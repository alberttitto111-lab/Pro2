// backend/src/scripts/debugCartStructure.js
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
require('dotenv').config();

async function debugCartStructure() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const carts = await Cart.find({}).limit(3);
    
    console.log('🔍 Checking cart structure...\n');
    
    carts.forEach((cart, cartIndex) => {
      console.log(`=== Cart ${cartIndex + 1} (User: ${cart.userId}) ===`);
      console.log(`Total Items: ${cart.items.length}`);
      
      cart.items.forEach((item, itemIndex) => {
        console.log(`\n  Item ${itemIndex + 1}:`);
        console.log(`    Name: ${item.name}`);
        console.log(`    ProductId Type: ${typeof item.productId}`);
        console.log(`    ProductId Value: ${item.productId}`);
        console.log(`    ProductId toString(): ${item.productId.toString()}`);
        console.log(`    ProductId _id: ${item._id}`);
        console.log(`    Has _id: ${!!item._id}`);
        
        // Check Mongoose document properties
        console.log(`    Is Mongoose Document: ${item.constructor.name === 'model'}`);
        console.log(`    To Object:`, item.toObject ? 'Yes' : 'No');
      });
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugCartStructure();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');
const Admin = require('./src/models/Admin');

dotenv.config();

const sampleProducts = [
  // ... (same products as before) ...
];

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Atlas connected successfully');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Admin.deleteMany({});
    
    // Create default admin
    console.log('👤 Creating default admin...');
    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      email: 'admin@frozo.com',
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Default admin created');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@frozo.com');
    
    // Insert sample products
    console.log('📦 Inserting sample products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${insertedProducts.length} products inserted successfully`);
    
    // Display summary
    console.log('\n📊 Database Seeding Complete!');
    console.log('=============================');
    console.log(`Total Products: ${insertedProducts.length}`);
    console.log('Default Admin: admin / admin123');
    console.log('\n🌐 Application URLs:');
    console.log('   Storefront: http://localhost:3000');
    console.log('   Admin Panel: http://localhost:3000/admin');
    console.log('\n🚀 Start your application:');
    console.log('   1. Backend: cd backend && npm run dev');
    console.log('   2. Frontend: cd frontend && npm start');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
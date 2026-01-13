const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create default admin
    const admin = new Admin({
      username: 'admin',
      password: 'admin123', // Will be hashed automatically
      email: 'admin@frozo.com',
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Default admin created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Email: admin@frozo.com');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

seedAdmin();
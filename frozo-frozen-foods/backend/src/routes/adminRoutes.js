const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find admin by username
    const admin = await Admin.findOne({ username, isActive: true });
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid username or password' 
      });
    }
    
    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid username or password' 
      });
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: admin._id, 
        username: admin.username, 
        role: admin.role,
        email: admin.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true,
      message: 'Login successful', 
      token,
      admin: admin.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login' 
    });
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin still exists and is active
    const admin = await Admin.findOne({ 
      _id: decoded.id, 
      isActive: true 
    }).select('-password');
    
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        error: 'Admin not found' 
      });
    }
    
    res.json({ 
      success: true,
      admin 
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      success: false,
      error: 'Invalid or expired token' 
    });
  }
});

// Get admin profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided' 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(404).json({ 
        success: false,
        error: 'Admin not found' 
      });
    }
    
    res.json({ 
      success: true,
      admin 
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
});

// Create admin (for initial setup - protect this in production!)
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false,
        error: 'Admin already exists' 
      });
    }
    
    const admin = new Admin({
      username,
      password,
      email,
      role: 'admin'
    });
    
    await admin.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Admin created successfully',
      admin: admin.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;
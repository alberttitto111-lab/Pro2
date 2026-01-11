const Product = require('../models/Product');
const path = require('path');
const fs = require('fs');

// Update getAllProducts to ensure consistent format
exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Sorting
    const sortOptions = {
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'rating-desc': { rating: -1 },
      'name-asc': { name: 1 },
      'createdAt-desc': { createdAt: -1 },
      'createdAt-asc': { createdAt: 1 }
    };
    
    const sort = sortOptions[`${sortBy}-${order}`] || { createdAt: -1 };
    
    const products = await Product.find(query).sort(sort);
    
 // Always return consistent format
    res.json({
      success: true,
      count: products.length,
      products: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
};

// Update getProductById for consistent format
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product: product
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
};

// Create product (protected - admin only)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update product (protected - admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', ')
      });
    }
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Delete product (protected - admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// Upload product image
exports.uploadProductImage = async (req, res) => {
  try {
    console.log('Uploading image...', req.file);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    // Get the file information
    const file = req.file;
    
    // Create a URL that the frontend can access
    // In development, use the full URL including your server address
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const imageUrl = `${baseUrl}/uploads/${file.filename}`;
    
    console.log('Image uploaded successfully:', imageUrl);
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      fileName: file.filename,
      fileSize: file.size,
      mimetype: file.mimetype
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image: ' + error.message
    });
  }
};
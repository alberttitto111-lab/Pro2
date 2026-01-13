// backend/src/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload'); // Add this import

// GET all products
router.get('/', productController.getAllProducts);

// GET single product by ID
router.get('/:id', productController.getProductById);

// POST create new product
router.post('/', productController.createProduct);

// PUT update product
router.put('/:id', productController.updateProduct);

// DELETE product
router.delete('/:id', productController.deleteProduct);

// POST upload product image
router.post('/upload-image', upload.single('image'), productController.uploadProductImage); // This line is now correct

module.exports = router;
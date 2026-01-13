const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get user's cart
router.get('/:userId', cartController.getCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update item quantity
router.put('/:userId/item/:productId', cartController.updateCartItem);

// Remove item from cart
router.delete('/:userId/item/:productId', cartController.removeFromCart);

// Clear cart
router.delete('/:userId/clear', cartController.clearCart);

module.exports = router;
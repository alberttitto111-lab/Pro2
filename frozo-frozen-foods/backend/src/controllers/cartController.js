const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let cart = await Cart.findOne({ userId }).populate('items.productId', 'name price imageUrl category weight');
    
    if (!cart) {
      // Create empty cart if doesn't exist
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    res.json({
      success: true,
      cart
    });
    
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart'
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    
    console.log('🛒 Adding to cart:', { userId, productId, quantity });
    
    // Validate input
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        error: 'userId and productId are required'
      });
    }
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    console.log(`📦 Product: ${product.name}, Price: $${product.price}`);
    
    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log('🆕 Creating new cart for user:', userId);
      cart = new Cart({ userId, items: [] });
    } else {
      console.log('📋 Existing cart items:', cart.items.length);
    }
    
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );

    // In cartController.js, add a helper function:
const calculateCartTotals = (cart) => {
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cart.shipping = cart.subtotal > 50 ? 0 : 5.99;
  cart.tax = parseFloat((cart.subtotal * 0.08).toFixed(2));
  cart.total = parseFloat((cart.subtotal + cart.shipping + cart.tax).toFixed(2));
  cart.updatedAt = new Date();
  return cart;
};
    
    if (existingItemIndex > -1) {
  cart.items[existingItemIndex].quantity += quantity;
} else {
  cart.items.push({
    productId,
    name: product.name,
    price: product.price,
    quantity,
    imageUrl: product.imageUrl || '',
    category: product.category,
    weight: product.weight
  });
}
    // Calculate totals
cart = calculateCartTotals(cart);
    await cart.save();
    
    
    console.log('✅ Cart saved successfully');
    console.log(`📊 Final cart: ${cart.totalItems} items, Subtotal: $${cart.subtotal}, Tax: $${cart.tax}, Total: $${cart.total}`);
    
    res.json({
      success: true,
      message: 'Item added to cart',
      cart: {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        tax: cart.tax,
        total: cart.total,
        items: cart.items
      }
    });
    
  } catch (error) {
    console.error('❌ Error adding to cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart'
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1'
      });
    }
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    res.json({
      success: true,
      message: 'Cart updated',
      cart: {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        total: cart.total,
        items: cart.items
      }
    });
    
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart'
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => 
      item.productId.toString() !== productId
    );
    
    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }
    
    await cart.save();
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        total: cart.total,
        items: cart.items
      }
    });
    
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart'
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({
      success: true,
      message: 'Cart cleared',
      cart
    });
    
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart'
    });
  }
};
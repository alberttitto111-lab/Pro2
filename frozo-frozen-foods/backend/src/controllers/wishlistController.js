const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
// In the getWishlist function, ensure consistent formatting:

exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    let wishlist = await Wishlist.findOne({ userId }).populate('items.productId', 'name price imageUrl category weight rating reviewCount');

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
      await wishlist.save();
    }

    // Ensure consistent productId format
    const formattedItems = wishlist.items.map(item => {
      const productInfo = item.productId || {};
      return {
        _id: item._id,
        productId: item.productId ? item.productId._id || item.productId.toString() : null,
        name: productInfo.name || item.name,
        price: productInfo.price || item.price,
        imageUrl: productInfo.imageUrl || item.imageUrl,
        category: productInfo.category || item.category,
        weight: productInfo.weight || item.weight,
        rating: productInfo.rating || item.rating,
        reviewCount: productInfo.reviewCount || item.reviewCount
      };
    });

    res.json({
      success: true,
      wishlist: {
        _id: wishlist._id,
        userId: wishlist.userId,
        items: formattedItems,
        itemCount: wishlist.items.length,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wishlist'
    });
  }
};


// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
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
    
    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }
    
    // Check if product already in wishlist
    const existingItem = wishlist.items.find(item => 
      item.productId.toString() === productId
    );
    
    if (existingItem) {
      return res.status(400).json({
        success: false,
        error: 'Product already in wishlist'
      });
    }
    
    // Add new item to wishlist
    wishlist.items.push({
      productId,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || '',
      category: product.category,
      weight: product.weight,
      rating: product.rating,
      reviewCount: product.reviewCount
    });
    
    await wishlist.save();
    
    res.json({
      success: true,
      message: 'Product added to wishlist',
      wishlist: {
        items: wishlist.items,
        itemCount: wishlist.itemCount
      }
    });
    
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to wishlist'
    });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'Wishlist not found'
      });
    }
    
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(item => 
      item.productId.toString() !== productId
    );
    
    if (wishlist.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in wishlist'
      });
    }
    
    await wishlist.save();
    
    res.json({
      success: true,
      message: 'Item removed from wishlist',
      wishlist: {
        items: wishlist.items,
        itemCount: wishlist.itemCount
      }
    });
    
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from wishlist'
    });
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'Wishlist not found'
      });
    }
    
    wishlist.items = [];
    await wishlist.save();
    
    res.json({
      success: true,
      message: 'Wishlist cleared',
      wishlist
    });
    
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear wishlist'
    });
  }
};
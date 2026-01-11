// frontend/src/contexts/WishlistContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

// Helper to normalize wishlist data
const normalizeWishlistData = (wishlistData) => {
  if (!wishlistData) return { items: [], itemCount: 0 };

  const normalizedItems = (wishlistData.items || []).map(item => {
    // Extract product ID from different possible sources
    let productId = '';
    
    if (item.productId) {
      productId = typeof item.productId === 'object' 
        ? (item.productId._id || item.productId.toString())
        : String(item.productId);
    } else if (item._id) {
      productId = item._id.toString();
    }

    return {
      ...item,
      productId: productId || '',
      _id: item._id || productId, // Ensure _id is always present
      price: parseFloat(item.price || 0),
      rating: parseFloat(item.rating || 0),
      reviewCount: parseInt(item.reviewCount || 0)
    };
  });

  return {
    items: normalizedItems,
    itemCount: parseInt(wishlistData.itemCount || 0)
  };
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(normalizeWishlistData({}));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user ID (same as cart)
  const getUserId = () => {
    let userId = localStorage.getItem('frozo_userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('frozo_userId', userId);
    }
    return userId;
  };

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError('');
      const userId = getUserId();
      const response = await API.get(`/wishlist/${userId}`);
      
      if (response.data.success) {
        const normalizedWishlist = normalizeWishlistData(response.data.wishlist);
        console.log('Fetched wishlist items:', normalizedWishlist.items);
        setWishlist(normalizedWishlist);
      } else {
        setWishlist(normalizeWishlistData({}));
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setWishlist(normalizeWishlistData({}));
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (product) => {
    try {
      setLoading(true);
      const userId = getUserId();
      const productId = product._id ? product._id.toString() : '';
      
      console.log('Adding to wishlist:', { userId, productId, productName: product.name });
      
      const response = await API.post('/wishlist/add', {
        userId,
        productId
      });

      if (response.data.success) {
        const normalizedWishlist = normalizeWishlistData(response.data.wishlist);
        console.log('Wishlist after add:', normalizedWishlist.items);
        setWishlist(normalizedWishlist);
        return { success: true, message: 'Added to wishlist' };
      }
      return { success: false, error: response.data.error };
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      return { success: false, error: 'Failed to add to wishlist' };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (wishlistItemId) => {
    try {
      setLoading(true);
      const userId = getUserId();
      
      // Ensure wishlistItemId is a string
      const wishlistItemIdStr = wishlistItemId ? wishlistItemId.toString() : '';
      console.log('Removing from wishlist:', { userId, wishlistItemId: wishlistItemIdStr });
      
      // Find the item in current wishlist to get the correct productId
      const wishlistItem = wishlist.items.find(item => {
        const itemProductId = item.productId ? item.productId.toString() : '';
        const itemId = item._id ? item._id.toString() : '';
        return itemProductId === wishlistItemIdStr || itemId === wishlistItemIdStr;
      });
      
      if (!wishlistItem) {
        console.error('Item not found in wishlist:', wishlistItemIdStr);
        return { success: false, error: 'Item not found in wishlist' };
      }
      
      // Use the productId from the wishlist item
      const itemProductId = wishlistItem.productId || wishlistItem._id;
      const finalProductId = itemProductId ? itemProductId.toString() : wishlistItemIdStr;
      
      console.log('Actual productId to remove from wishlist:', finalProductId);
      
      const response = await API.delete(`/wishlist/${userId}/item/${finalProductId}`);
      
      if (response.data.success) {
        const normalizedWishlist = normalizeWishlistData(response.data.wishlist);
        setWishlist(normalizedWishlist);
        return { success: true, message: 'Removed from wishlist' };
      }
      return { success: false, error: response.data.error };
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      console.error('Error details:', err.response?.data);
      return { success: false, error: 'Failed to remove from wishlist' };
    } finally {
      setLoading(false);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    if (!productId) return false;
    const productIdStr = productId.toString();
    
    return wishlist.items.some(item => {
      const itemProductId = item.productId ? item.productId.toString() : '';
      const itemId = item._id ? item._id.toString() : '';
      return itemProductId === productIdStr || itemId === productIdStr;
    });
  };

  // Toggle wishlist item
  const toggleWishlist = async (product) => {
    const productId = product._id ? product._id.toString() : '';
    
    if (isInWishlist(productId)) {
      // Find the wishlist item to get the correct identifier
      const wishlistItem = wishlist.items.find(item => {
        const itemProductId = item.productId ? item.productId.toString() : '';
        const itemId = item._id ? item._id.toString() : '';
        return itemProductId === productId || itemId === productId;
      });
      
      if (wishlistItem) {
        const identifier = wishlistItem._id || wishlistItem.productId;
        return await removeFromWishlist(identifier);
      }
    } else {
      return await addToWishlist(product);
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const response = await API.delete(`/wishlist/${userId}/clear`);
      
      if (response.data.success) {
        setWishlist(normalizeWishlistData({}));
        return { success: true };
      }
      return { success: false, error: response.data.error };
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      return { success: false, error: 'Failed to clear wishlist' };
    } finally {
      setLoading(false);
    }
  };

  // Load wishlist on mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  const value = {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
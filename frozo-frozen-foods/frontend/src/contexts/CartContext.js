// frontend/src/contexts/CartContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Helper to normalize cart data
const normalizeCartData = (cartData) => {
  if (!cartData) return { items: [], totalItems: 0, subtotal: 0, shipping: 0, tax: 0, total: 0 };

  const normalizedItems = (cartData.items || []).map(item => {
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
      // Ensure all numeric fields are numbers
      price: parseFloat(item.price || 0),
      quantity: parseInt(item.quantity || 1)
    };
  });

  return {
    items: normalizedItems,
    totalItems: parseInt(cartData.totalItems || 0),
    subtotal: parseFloat(cartData.subtotal || 0),
    shipping: parseFloat(cartData.shipping || 0),
    tax: parseFloat(cartData.tax || 0),
    total: parseFloat(cartData.total || 0)
  };
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(normalizeCartData({}));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user ID
  const getUserId = () => {
    let userId = localStorage.getItem('frozo_userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('frozo_userId', userId);
    }
    return userId;
  };

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError('');
      const userId = getUserId();
      const response = await API.get(`/cart/${userId}`);
      
      if (response.data.success) {
        const normalizedCart = normalizeCartData(response.data.cart);
        console.log('Fetched cart items:', normalizedCart.items);
        setCart(normalizedCart);
      } else {
        setCart(normalizeCartData({}));
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCart(normalizeCartData({}));
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      const userId = getUserId();
      const productId = product._id ? product._id.toString() : '';
      
      console.log('Adding to cart:', { userId, productId, productName: product.name });
      
      const response = await API.post('/cart/add', {
        userId,
        productId,
        quantity
      });

      if (response.data.success) {
        const normalizedCart = normalizeCartData(response.data.cart);
        console.log('Cart after add:', normalizedCart.items);
        setCart(normalizedCart);
        return { success: true };
      }
      return { success: false, error: response.data.error };
    } catch (err) {
      console.error('Error adding to cart:', err);
      return { success: false, error: 'Failed to add to cart' };
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const userId = getUserId();
      
      // Ensure productId is a string
      const productIdStr = productId ? productId.toString() : '';
      console.log('Updating quantity:', { userId, productId: productIdStr, quantity });
      
      // Find the item in current cart to get the correct productId
      const cartItem = cart.items.find(item => {
        const itemProductId = item.productId ? item.productId.toString() : '';
        const itemId = item._id ? item._id.toString() : '';
        return itemProductId === productIdStr || itemId === productIdStr;
      });
      
      if (!cartItem) {
        console.error('Item not found in cart:', productIdStr);
        return { success: false, error: 'Item not found in cart' };
      }
      
      // Use the productId from the cart item (this handles both cases)
      const itemProductId = cartItem.productId || cartItem._id;
      const finalProductId = itemProductId ? itemProductId.toString() : productIdStr;
      
      console.log('Actual productId to update:', finalProductId);
      
      const response = await API.put(`/cart/${userId}/item/${finalProductId}`, { quantity });
      
      if (response.data.success) {
        const normalizedCart = normalizeCartData(response.data.cart);
        setCart(normalizedCart);
        return { success: true };
      }
      return { success: false, error: response.data.error };
    } catch (err) {
      console.error('Error updating cart:', err);
      console.error('Error details:', err.response?.data);
      return { success: false, error: 'Failed to update cart' };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const userId = getUserId();
      
      // Ensure productId is a string
      const productIdStr = productId ? productId.toString() : '';
      console.log('Removing item:', { userId, productId: productIdStr });
      
      // Find the item in current cart to get the correct productId
      const cartItem = cart.items.find(item => {
        const itemProductId = item.productId ? item.productId.toString() : '';
        const itemId = item._id ? item._id.toString() : '';
        return itemProductId === productIdStr || itemId === productIdStr;
      });
      
      if (!cartItem) {
        console.error('Item not found in cart:', productIdStr);
        return { success: false, error: 'Item not found in cart' };
      }
      
      // Use the productId from the cart item
      const itemProductId = cartItem.productId || cartItem._id;
      const finalProductId = itemProductId ? itemProductId.toString() : productIdStr;
      
      console.log('Actual productId to remove:', finalProductId);
      
      const response = await API.delete(`/cart/${userId}/item/${finalProductId}`);
      
      if (response.data.success) {
        const normalizedCart = normalizeCartData(response.data.cart);
        setCart(normalizedCart);
        return { success: true };
      }
      return { success: false, error: response.data.error };
    } catch (err) {
      console.error('Error removing from cart:', err);
      console.error('Error details:', err.response?.data);
      return { success: false, error: 'Failed to remove item' };
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const response = await API.delete(`/cart/${userId}/clear`);
      
      if (response.data.success) {
        setCart(normalizeCartData({}));
        return { success: true };
      }
      return { success: false, error: response.data.error };
    } catch (err) {
      console.error('Error clearing cart:', err);
      return { success: false, error: 'Failed to clear cart' };
    } finally {
      setLoading(false);
    }
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    if (!productId) return false;
    const productIdStr = productId.toString();
    
    return cart.items.some(item => {
      const itemProductId = item.productId ? item.productId.toString() : '';
      const itemId = item._id ? item._id.toString() : '';
      return itemProductId === productIdStr || itemId === productIdStr;
    });
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    if (!productId) return 0;
    const productIdStr = productId.toString();
    
    const item = cart.items.find(item => {
      const itemProductId = item.productId ? item.productId.toString() : '';
      const itemId = item._id ? item._id.toString() : '';
      return itemProductId === productIdStr || itemId === productIdStr;
    });
    
    return item ? item.quantity : 0;
  };

  // Load cart on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQuantity,
    refreshCart: fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
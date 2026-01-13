import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
  items: [],
  totalItems: 0,
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user ID (for demo, use localStorage or generate a unique ID)
  const getUserId = () => {
    let userId = localStorage.getItem('frozo_userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('frozo_userId', userId);
    }
    return userId;
  };

  // Fetch cart from API
//   const fetchCart = async () => {
//   try {
//     setLoading(true);
//     const userId = getUserId();
//     const response = await API.get(`/cart/${userId}`);
    
//     if (response.data.success && response.data.cart) {
//       const cartData = response.data.cart;
//       setCart({
//         items: cartData.items || [],
//         totalItems: cartData.totalItems || 0,
//         subtotal: cartData.subtotal || 0,
//         shipping: cartData.shipping || 0,
//         tax: cartData.tax || 0,
//         total: cartData.total || 0
//       });
//     } else {
//       // If no cart exists, use defaults
//       setCart({
//         items: [],
//         totalItems: 0,
//         subtotal: 0,
//         shipping: 0,
//         tax: 0,
//         total: 0
//       });
//     }
//   } catch (err) {
//     console.error('Error fetching cart:', err);
//     // Use defaults on error
//     setCart({
//       items: [],
//       totalItems: 0,
//       subtotal: 0,
//       shipping: 0,
//       tax: 0,
//       total: 0
//     });
//   } finally {
//     setLoading(false);
//   }
// };

// In CartContext.js, add a normalizeCartData function:
const normalizeCartData = (cartData) => {
  if (!cartData) return { items: [], totalItems: 0, subtotal: 0, shipping: 0, tax: 0, total: 0 };
  
  const normalizedItems = (cartData.items || []).map(item => ({
    ...item,
    // Ensure productId is always a string
    productId: item.productId 
      ? (typeof item.productId === 'object' ? item.productId.toString() : String(item.productId))
      : item._id ? item._id.toString() : '',
    // Ensure all numeric fields are numbers
    price: parseFloat(item.price || 0),
    quantity: parseInt(item.quantity || 1)
  }));
  
  return {
    items: normalizedItems,
    totalItems: parseInt(cartData.totalItems || 0),
    subtotal: parseFloat(cartData.subtotal || 0),
    shipping: parseFloat(cartData.shipping || 0),
    tax: parseFloat(cartData.tax || 0),
    total: parseFloat(cartData.total || 0)
  };
};

// Update fetchCart function to use it:
const fetchCart = async () => {
  try {
    setLoading(true);
    const userId = getUserId();
    const response = await API.get(`/cart/${userId}`);
    
    if (response.data.success && response.data.cart) {
      const normalizedCart = normalizeCartData(response.data.cart);
      setCart(normalizedCart);
    } else {
      setCart(normalizeCartData({}));
    }
  } catch (err) {
    console.error('Error fetching cart:', err);
    setCart(normalizeCartData({}));
  } finally {
    setLoading(false);
  }
};




  // Add item to cart
//   const addToCart = async (product, quantity = 1) => {
//     try {
//       setLoading(true);
//       const userId = getUserId();
      
//       const response = await API.post('/cart/add', {
//         userId,
//         productId: product._id,
//         quantity
//       });

//       if (response.data.success) {
//         // setCart({
//         //   items: response.data.cart.items,
//         //   totalItems: response.data.cart.totalItems,
//         //   subtotal: response.data.cart.subtotal,
//         //   shipping: response.data.cart.shipping,
//         //   tax: response.data.cart.tax,
//         //   total: response.data.cart.total
//         // });
//         setCart({
//   items: response.data.cart.items || [],
//   totalItems: response.data.cart.totalItems || 0,
//   subtotal: response.data.cart.subtotal || 0,
//   shipping: response.data.cart.shipping || 0,
//   tax: response.data.cart.tax || parseFloat(((response.data.cart.subtotal || 0) * 0.08).toFixed(2)), // Calculate if missing
//   total: response.data.cart.total || 0
// });
//         return { success: true };
//       }
//       return { success: false, error: response.data.error };
//     } catch (err) {
//       console.error('Error adding to cart:', err);
//       return { success: false, error: 'Failed to add to cart' };
//     } finally {
//       setLoading(false);
//     }
//   };


// In CartContext.js, update the addToCart function:
const addToCart = async (product, quantity = 1) => {
  try {
    setLoading(true);
    const userId = getUserId();
    
    // Ensure product._id is a string
    const productId = product._id ? product._id.toString() : '';
    
    const response = await API.post('/cart/add', {
      userId,
      productId,
      quantity
    });

    if (response.data.success) {
      const normalizedCart = normalizeCartData(response.data.cart);
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
    
    // Make sure productId is a string for comparison
    const productIdStr = productId.toString();
    
    const response = await API.put(`/cart/${userId}/item/${productIdStr}`, { quantity });

    if (response.data.success) {
        // setCart({
        //   items: response.data.cart.items,
        //   totalItems: response.data.cart.totalItems,
        //   subtotal: response.data.cart.subtotal,
        //   shipping: response.data.cart.shipping,
        //   tax: response.data.cart.tax,
        //   total: response.data.cart.total
        // });
        setCart({
  items: response.data.cart.items || [],
  totalItems: response.data.cart.totalItems || 0,
  subtotal: response.data.cart.subtotal || 0,
  shipping: response.data.cart.shipping || 0,
  // tax: response.data.cart.tax || parseFloat(((response.data.cart.subtotal || 0) * 0.08).toFixed(2)), 
  tax: response.data.cart.tax || 0,
  // Calculate if missing
  total: response.data.cart.total || 0
});
        return { success: true };
    }
    return { success: false, error: response.data.error };
  } catch (err) {
    console.error('Error updating cart:', err);
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
    
    // Make sure productId is a string for comparison
    const productIdStr = productId.toString();
    
    const response = await API.delete(`/cart/${userId}/item/${productIdStr}`);

    if (response.data.success) {
        // setCart({
        //   items: response.data.cart.items,
        //   totalItems: response.data.cart.totalItems,
        //   subtotal: response.data.cart.subtotal,
        //   shipping: response.data.cart.shipping,
        //   tax: response.data.cart.tax,
        //   total: response.data.cart.total
        // });
        setCart({
  items: response.data.cart.items || [],
  totalItems: response.data.cart.totalItems || 0,
  subtotal: response.data.cart.subtotal || 0,
  shipping: response.data.cart.shipping || 0,
  // tax: response.data.cart.tax || parseFloat(((response.data.cart.subtotal || 0) * 0.08).toFixed(2)), 
  tax: response.data.cart.tax || 0,
  // Calculate if missing
  total: response.data.cart.total || 0
});
        return { success: true };
    }
    return { success: false, error: response.data.error };
  } catch (err) {
    console.error('Error removing from cart:', err);
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
        setCart({
          items: [],
          totalItems: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0
        });
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

  // Calculate item total
  const getItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  // Check if item is in cart
  // const isInCart = (productId) => {
  //   return cart.items.some(item => item.productId === productId);
  // };

  // // Get item quantity in cart
  // const getItemQuantity = (productId) => {
  //   const item = cart.items.find(item => item.productId === productId);
  //   return item ? item.quantity : 0;
  // };

  const isInCart = (productId) => {
  if (!productId) return false;
  const productIdStr = productId.toString();
  return cart.items.some(item => {
    // Handle both string and ObjectId comparisons
    const itemProductId = item.productId ? item.productId.toString() : item._id;
    return itemProductId === productIdStr;
  });
};

// Get item quantity in cart - FIXED
const getItemQuantity = (productId) => {
  if (!productId) return 0;
  const productIdStr = productId.toString();
  const item = cart.items.find(item => {
    // Handle both string and ObjectId comparisons
    const itemProductId = item.productId ? item.productId.toString() : item._id;
    return itemProductId === productIdStr;
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
    getItemTotal,
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
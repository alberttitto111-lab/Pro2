// frontend/src/pages/Cart.js

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon,
  ArrowBack as ArrowBackIcon,
  RemoveShoppingCart as ClearCartIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();
  const [updatingItem, setUpdatingItem] = useState(null);

  // Safe access to cart properties with defaults
  const cartItems = cart?.items || [];
  const totalItems = cart?.totalItems || 0;
  const subtotal = cart?.subtotal || 0;
  const shipping = cart?.shipping || 0;
  const tax = cart?.tax || 0;
  const total = cart?.total || 0;

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingItem(productId);
    const productIdStr = productId ? productId.toString() : '';
    await updateQuantity(productIdStr, newQuantity);
    setUpdatingItem(null);
  };

  const handleRemoveItem = async (productId) => {
    const productIdStr = productId ? productId.toString() : '';
    await removeFromCart(productIdStr);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality coming soon!');
  };

  if (loading && cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your cart...
        </Typography>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Add some delicious frozen foods to get started!
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ArrowBackIcon />}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          to="/products"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Continue Shopping
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Cart Items
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<ClearCartIcon />}
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Total</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => {
                    const itemProductId = item.productId || item._id;
                    const itemIdStr = itemProductId ? itemProductId.toString() : '';
                    
                    return (
                      <TableRow key={itemIdStr} hover>
                        <TableCell>
                          {/* Updated Product Cell with Image */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {/* Product Image */}
                            <Box
                              sx={{
                                width: 70,
                                height: 70,
                                borderRadius: 1,
                                overflow: 'hidden',
                                flexShrink: 0,
                                border: '1px solid #e0e0e0',
                                bgcolor: 'grey.100'
                              }}
                            >
                              <img
                                src={item.imageUrl || 'https://via.placeholder.com/70x70?text=No+Image'}
                                alt={item.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/70x70?text=No+Image';
                                }}
                              />
                            </Box>
                            
                            {/* Product Details */}
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {item.name}
                              </Typography>
                              {item.category && (
                                <Chip
                                  label={item.category}
                                  size="small"
                                  color={
                                    item.category === 'Vegetables' ? 'success' :
                                    item.category === 'Fruits' ? 'warning' :
                                    item.category === 'Snacks' ? 'info' : 'error'
                                  }
                                  sx={{ height: 20, fontSize: '0.65rem', mb: 0.5 }}
                                />
                              )}
                              {item.weight && (
                                <Typography variant="caption" color="text.secondary" display="block">
                                  {item.weight}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${(item.price || 0).toFixed(2)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(itemIdStr, (item.quantity || 1) - 1)}
                              disabled={(item.quantity || 1) <= 1 || updatingItem === itemIdStr}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity || 1}
                              onChange={(e) => handleQuantityChange(itemIdStr, parseInt(e.target.value) || 1)}
                              disabled={updatingItem === itemIdStr}
                              sx={{ width: 60, mx: 1 }}
                              inputProps={{
                                style: { textAlign: 'center' },
                                min: 1
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(itemIdStr, (item.quantity || 1) + 1)}
                              disabled={updatingItem === itemIdStr}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        
                        <TableCell align="right">
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveItem(itemIdStr)}
                            disabled={updatingItem === itemIdStr}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon />
              Order Summary
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal ({totalItems} items)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  ${subtotal.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Shipping
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: shipping === 0 ? 'success.main' : 'inherit' }}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Tax (8%)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    8% of ${subtotal.toFixed(2)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  ${tax.toFixed(2)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {subtotal < 50 && subtotal > 0 && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Spend ${(50 - subtotal).toFixed(2)} more to get FREE shipping!</strong>
                </Typography>
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleCheckout}
              disabled={loading}
              sx={{ py: 1.5, fontWeight: 600, mb: 2 }}
            >
              Proceed to Checkout
            </Button>

            <Button
              component={Link}
              to="/products"
              variant="outlined"
              color="primary"
              size="large"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Continue Shopping
            </Button>
          </Paper>

          {/* Shipping Info */}
          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ShippingIcon fontSize="small" color="action" />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Shipping Information
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                • Orders ship within 24 hours<br />
                • Free shipping on orders over $50<br />
                • Delivery in 2-3 business days<br />
                • Frozen at optimal temperature
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Rating,
  Divider,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Delete as DeleteIcon,
  AddShoppingCart as AddCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ArrowBack as ArrowBackIcon,
  RemoveShoppingCart as ClearIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist, loading, error, removeFromWishlist, clearWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [processingItem, setProcessingItem] = useState(null);

  const wishlistItems = wishlist?.items || [];
  const itemCount = wishlist?.itemCount || 0;

  const handleRemoveFromWishlist = async (productId) => {
    setProcessingItem(productId);
    const result = await removeFromWishlist(productId);
    if (result.success) {
      showSnackbar('Removed from wishlist', 'info');
    }
    setProcessingItem(null);
  };

  const handleAddToCart = async (product) => {
    setProcessingItem(product.productId);
    const result = await addToCart(product, 1);
    if (result.success) {
      showSnackbar('Added to cart!', 'success');
    } else {
      showSnackbar(result.error || 'Failed to add to cart', 'error');
    }
    setProcessingItem(null);
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      const result = await clearWishlist();
      if (result.success) {
        showSnackbar('Wishlist cleared', 'info');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && wishlistItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your wishlist...
        </Typography>
      </Container>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <FavoriteBorderIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Save your favorite products to wishlist for later!
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ArrowBackIcon />}
          >
            Browse Products
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
              My Wishlist
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} saved for later
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<ClearIcon />}
            onClick={handleClearWishlist}
            disabled={loading}
          >
            Clear Wishlist
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Wishlist Items Grid */}
      <Grid container spacing={3}>
        {wishlistItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.productId || item._id}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }
            }}>
              {/* Product Image */}
              <CardMedia
                component="img"
                height="160"
                image={item.imageUrl || 'https://via.placeholder.com/300x160'}
                alt={item.name}
                sx={{ objectFit: 'cover' }}
              />

              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                {/* Category Chip */}
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={item.category}
                    size="small"
                    color={
                      item.category === 'Vegetables' ? 'success' :
                      item.category === 'Fruits' ? 'warning' :
                      item.category === 'Snacks' ? 'info' : 'error'
                    }
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                </Box>

                {/* Product Name */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    lineHeight: 1.3,
                    mb: 1,
                    minHeight: '2.5rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {item.name}
                </Typography>

                {/* Weight */}
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                  {item.weight}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Rating
                    value={item.rating || 0}
                    readOnly
                    precision={0.5}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {item.rating?.toFixed(1) || '0.0'} ({item.reviewCount || 0})
                  </Typography>
                </Box>

                {/* Price */}
                <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                  ${(item.price || 0).toFixed(2)}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  fullWidth
                  startIcon={<AddCartIcon />}
                  onClick={() => handleAddToCart(item)}
                  disabled={processingItem === item.productId}
                  sx={{ 
                    py: 0.75,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: 1
                  }}
                >
                  Add to Cart
                </Button>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleRemoveFromWishlist(item.productId)}
                  disabled={processingItem === item.productId}
                  sx={{
                    border: '1px solid',
                    borderColor: 'error.main',
                    borderRadius: 1
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Wishlist;
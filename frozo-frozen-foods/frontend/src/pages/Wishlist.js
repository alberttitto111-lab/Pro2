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

  const handleRemoveFromWishlist = async (wishlistItemId, productName) => {
    setProcessingItem(wishlistItemId);
    
    // Find the wishlist item to get the correct identifier
    const wishlistItem = wishlistItems.find(item => {
      const itemId = item._id ? item._id.toString() : '';
      const itemProductId = item.productId ? item.productId.toString() : '';
      return itemId === wishlistItemId || itemProductId === wishlistItemId;
    });
    
    if (wishlistItem) {
      // Use the _id first, then productId as fallback
      const identifier = wishlistItem._id || wishlistItem.productId;
      const result = await removeFromWishlist(identifier);
      
      if (result.success) {
        showSnackbar(`"${productName}" removed from wishlist`, 'info');
      } else {
        showSnackbar(result.error || 'Failed to remove from wishlist', 'error');
      }
    }
    
    setProcessingItem(null);
  };

  // Fixed: Create a proper product object from wishlist item
  const createProductFromWishlistItem = (wishlistItem) => {
    return {
      _id: wishlistItem.productId || wishlistItem._id,
      name: wishlistItem.name,
      price: wishlistItem.price || 0,
      imageUrl: wishlistItem.imageUrl || '',
      category: wishlistItem.category || '',
      weight: wishlistItem.weight || '',
      rating: wishlistItem.rating || 0,
      reviewCount: wishlistItem.reviewCount || 0,
      description: wishlistItem.description || ''
    };
  };

  const handleAddToCart = async (wishlistItem, e) => {
    if (e) {
      e.stopPropagation(); // Prevent card click when clicking Add to Cart button
    }
    
    const itemId = wishlistItem._id || wishlistItem.productId;
    const itemIdStr = itemId ? itemId.toString() : '';
    
    setProcessingItem(itemIdStr);
    
    try {
      // Create a proper product object from the wishlist item
      const product = createProductFromWishlistItem(wishlistItem);
      console.log('Adding to cart from wishlist:', product);
      
      const result = await addToCart(product, 1);
      
      if (result.success) {
        showSnackbar(`"${product.name}" added to cart!`, 'success');
      } else {
        showSnackbar(result.error || 'Failed to add to cart', 'error');
      }
    } catch (err) {
      console.error('Error adding to cart from wishlist:', err);
      showSnackbar('Failed to add item to cart', 'error');
    } finally {
      setProcessingItem(null);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      const result = await clearWishlist();
      if (result.success) {
        showSnackbar('Wishlist cleared successfully', 'info');
      } else {
        showSnackbar(result.error || 'Failed to clear wishlist', 'error');
      }
    }
  };

  const handleViewProduct = (productId, e) => {
    if (e) {
      e.stopPropagation(); // Prevent event bubbling if called from nested element
    }
    navigate(`/products/${productId}`);
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
            disabled={loading || wishlistItems.length === 0}
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
        {wishlistItems.map((item) => {
          const itemId = item._id || item.productId;
          const itemIdStr = itemId ? itemId.toString() : '';
          const isProcessing = processingItem === itemIdStr;
          const productId = item.productId || item._id;
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={itemIdStr}>
              {/* Wrapper Box for clickable area */}
              <Box
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  '&:hover .wishlist-card': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }
                }}
                onClick={() => handleViewProduct(productId)}
              >
                <Card 
                  className="wishlist-card"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  {/* Product Image */}
                  <Box
                    sx={{
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={item.imageUrl || 'https://via.placeholder.com/300x160'}
                      alt={item.name}
                      sx={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                    {/* Category Badge */}
                    <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
                      <Chip
                        label={item.category || 'Uncategorized'}
                        size="small"
                        color={
                          item.category === 'Vegetables' ? 'success' :
                          item.category === 'Fruits' ? 'warning' :
                          item.category === 'Snacks' ? 'info' : 'error'
                        }
                        sx={{
                          fontSize: '0.7rem',
                          height: 22,
                          fontWeight: 600,
                          backdropFilter: 'blur(4px)',
                          backgroundColor: 'rgba(205, 62, 148, 0.9)',
                          color: '#fff'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Optional: Filter by category
                          // navigate(`/products?category=${item.category.toLowerCase()}`);
                        }}
                      />
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
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
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      {item.name}
                    </Typography>

                    {/* Weight */}
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                      {item.weight || 'No weight specified'}
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
                        {(item.rating || 0).toFixed(1)} ({item.reviewCount || 0})
                      </Typography>
                    </Box>

                    {/* Price */}
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
                      ${(item.price || 0).toFixed(2)}
                    </Typography>
                  </CardContent>

                  <CardActions 
                    sx={{ p: 2, pt: 0, gap: 1 }} 
                    onClick={(e) => e.stopPropagation()} // Stop propagation for button clicks
                  >
                    {/* Add to Cart Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      fullWidth
                      startIcon={isProcessing ? <CircularProgress size={16} /> : <AddCartIcon />}
                      onClick={(e) => handleAddToCart(item, e)}
                      disabled={isProcessing}
                      sx={{
                        py: 0.75,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        borderRadius: 1,
                        minHeight: '36px'
                      }}
                    >
                      {isProcessing ? 'Adding...' : 'Add to Cart'}
                    </Button>

                    {/* Delete Button */}
                    <IconButton
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(itemIdStr, item.name);
                      }}
                      disabled={isProcessing}
                      sx={{
                        border: '1px solid',
                        borderColor: 'error.main',
                        borderRadius: 1,
                        minWidth: '36px',
                        minHeight: '36px',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'error.dark'
                        }
                      }}
                      title="Remove from wishlist"
                    >
                      {isProcessing ? <CircularProgress size={16} /> : <DeleteIcon fontSize="small" />}
                    </IconButton>
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            '& .MuiAlert-message': {
              fontSize: '0.9rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Wishlist;
import React from 'react';
import { Box, Typography, Chip, Rating, Button, IconButton } from '@mui/material';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const CategoryProductCard = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Vegetables': 'success',
      'Fruits': 'warning',
      'Ready Meals': 'error',
      'Snacks': 'info',
    };
    return colors[category] || 'primary';
  };

  return (
    <Box className="category-product-card" sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      overflow: 'hidden',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e0e0e0',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
      }
    }}>
      {/* Wishlist Heart Button (Top Right) */}
      <IconButton
        size="small"
        onClick={handleToggleWishlist}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
          width: 32,
          height: 32,
        }}
      >
        {isInWishlist(product._id) ? (
          <FavoriteIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
        ) : (
          <FavoriteBorderIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
        )}
      </IconButton>

      {/* Product Image */}
      <Box
        component="img"
        src={product.imageUrl || 'https://via.placeholder.com/300x200'}
        alt={product.name}
        sx={{
          width: '100%',
          height: 200,
          objectFit: 'cover'
        }}
      />

      <Box sx={{
        flexGrow: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Category Chip */}
        <Box sx={{ mb: 1.5 }}>
          <Chip
            label={product.category}
            size="small"
            color={getCategoryColor(product.category)}
            sx={{
              height: 24,
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          />
        </Box>

        {/* Product Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.3,
            mb: 1.5,
            minHeight: '2.8rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>

        {/* Weight */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.weight}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Rating
            value={product.rating}
            readOnly
            precision={0.5}
            size="medium"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1.5 }}>
            {product.rating.toFixed(1)} ({product.reviewCount})
          </Typography>
        </Box>

        {/* Price and Actions */}
        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
            ${product.price.toFixed(2)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              sx={{
                borderRadius: 1.5,
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              {isInCart(product._id) ? `Added (${getItemQuantity(product._id)})` : 'Add'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryProductCard;
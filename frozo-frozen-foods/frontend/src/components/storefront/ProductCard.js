import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Chip, Button, IconButton } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const quantityInCart = getItemQuantity(product._id);
  const isInWishlistItem = isInWishlist(product._id);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Card className="product-card" sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 1.5,
      overflow: 'hidden',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      position: 'relative', // Added for wishlist button positioning
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
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
        {isInWishlistItem ? (
          <FavoriteIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
        ) : (
          <FavoriteBorderIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
        )}
      </IconButton>

      {/* Product Image */}
      <CardMedia
        component="img"
        height="140"
        image={product.imageUrl || 'https://via.placeholder.com/300x140'}
        alt={product.name}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
        }}
      />

      <CardContent sx={{
        flexGrow: 1,
        p: 1.5,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Category Chip */}
        <Box sx={{ mb: 0.75 }}>
          <Chip
            label={product.category}
            size="small"
            color={
              product.category === 'Vegetables' ? 'success' :
              product.category === 'Fruits' ? 'warning' :
              product.category === 'Snacks' ? 'info' : 'error'
            }
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 600,
              px: 0.5
            }}
          />
        </Box>

        {/* Product Name */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: '0.85rem',
            lineHeight: 1.2,
            mb: 0.5,
            minHeight: '2rem',
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
        <Typography variant="caption" color="text.secondary" sx={{
          mb: 1,
          display: 'block',
          fontSize: '0.7rem'
        }}>
          {product.weight}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.25 }}>
          <Rating
            value={product.rating}
            readOnly
            precision={0.5}
            size="small"
            sx={{ fontSize: '0.9rem' }}
          />
          <Typography variant="caption" color="text.secondary" sx={{
            ml: 0.75,
            fontSize: '0.7rem'
          }}>
            {product.rating.toFixed(1)}
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="primary" sx={{
            fontWeight: 800,
            fontSize: '1.1rem',
            lineHeight: 1
          }}>
            ${(product.price || 0).toFixed(2)}
          </Typography>
        </Box>

        {/* Add to Cart Button */}
        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            sx={{
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 1,
              textTransform: 'none',
              bgcolor: isInCart(product._id) ? 'success.main' : 'primary.main',
              '&:hover': {
                bgcolor: isInCart(product._id) ? 'success.dark' : 'primary.dark',
              }
            }}
          >
            {isInCart(product._id) ? `Added (${quantityInCart})` : 'Add to Cart'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
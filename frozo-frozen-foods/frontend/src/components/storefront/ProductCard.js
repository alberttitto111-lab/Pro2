import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Chip } from '@mui/material';

const ProductCard = ({ product }) => {
  return (
    <Card className="product-card" sx={{ 
      height: '100%',
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: 1.5,
      overflow: 'hidden',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    }}>
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
        {/* Category Chip - Smaller */}
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
        
        {/* Product Name - Compact */}
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
        
        {/* Weight - Smaller */}
        <Typography variant="caption" color="text.secondary" sx={{ 
          mb: 1, 
          display: 'block',
          fontSize: '0.7rem'
        }}>
          {product.weight}
        </Typography>
        
        {/* Rating - Smaller */}
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
        
        {/* Price - Takes remaining space */}
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="h6" color="primary" sx={{ 
            fontWeight: 800, 
            fontSize: '1.1rem',
            lineHeight: 1
          }}>
            ${product.price.toFixed(2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
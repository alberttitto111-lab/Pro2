import React from 'react';
import { Container, Grid, Typography, Box, Button, Paper, Rating, Chip } from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        
        // Handle different response structures
        let productData = null;
        
        if (response.data && response.data.success) {
          productData = response.data.product;
        } else if (response.data && response.data._id) {
          productData = response.data;
        }
        
        if (!productData) {
          throw new Error('Product not found');
        }
        
        setProduct(productData);
        setError('');
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Loading product details...</Typography>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error || 'Product not found'}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Back to Products
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Box sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          to="/products" 
          sx={{ color: 'primary.main' }}
          startIcon={<span>←</span>}
        >
          Back to Products
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={product.imageUrl || 'https://via.placeholder.com/500x400?text=No+Image'}
              alt={product.name}
              style={{ 
                maxWidth: '100%', 
                maxHeight: 500, 
                borderRadius: 8,
                objectFit: 'cover'
              }}
            />
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Chip 
              label={product.category} 
              color="primary" 
              size="small"
              sx={{ mb: 2 }}
            />
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 800,
              color: '#1a237e'
            }}>
              {product.name}
            </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ${product.price.toFixed(2)}
              </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Rating 
              value={product.rating} 
              readOnly 
              precision={0.5} 
              size="large"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {product.rating} • {product.reviewCount} reviews
            </Typography>
          </Box>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Weight/Package:
              </Typography>
              <Typography variant="body1">
                {product.weight}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description:
              </Typography>
              <Typography variant="body1">
                {product.description || 'No description available.'}
              </Typography>
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              sx={{ flex: 1 }}
            >
              Add to Cart
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              size="large"
              sx={{ flex: 1 }}
            >
              Add to Wishlist
            </Button>
          </Box>

          {/* Additional Info */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Storage Instructions:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Keep frozen at -18°C or below. Once thawed, do not refreeze. Consume within 24 hours after thawing.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Related Products Section (Optional) */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>
          You might also like
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Other products in the {product.category} category
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {/* This would typically be populated with related products */}
          <Paper sx={{ minWidth: 200, p: 2, textAlign: 'center' }}>
            <Typography variant="body2">More {product.category} coming soon...</Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetailPage;
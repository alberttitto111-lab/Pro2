import React from 'react';
import { 
  Typography, 
  Grid, 
  Box, 
  Container, 
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/storefront/ProductCard';
import { getProducts } from '../services/api';

const Products = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getProducts();
      
      let productsData = [];
      
      if (response.data && response.data.success) {
        productsData = response.data.products || [];
      } else if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      }
      
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];

  // Handle card click
  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Box sx={{ width: '100%', py: { xs: 3, md: 4 } }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Page Heading - LEFT ALIGNED */}
        <Box sx={{ 
          mb: { xs: 3, md: 4 },
          textAlign: 'left'
        }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 800,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            color: '#1a237e',
            mb: 1
          }}>
            All Products
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '1rem', md: '1.1rem' }
          }}>
            Browse our complete collection of premium frozen foods
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={fetchProducts}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : safeProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products available yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back soon for new arrivals!
            </Typography>
            <Button variant="outlined" onClick={fetchProducts} sx={{ mt: 2 }}>
              Refresh
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {safeProducts.length} product{safeProducts.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            
            {/* Products Grid - Reduced spacing */}
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
              {safeProducts.map((product) => (
                <Grid item key={product._id} xs={6} sm={4} md={3} lg={2}>
                  <Box 
                    onClick={() => handleCardClick(product._id)}
                    sx={{ 
                      cursor: 'pointer',
                      height: '100%',
                      '&:hover .product-card': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      }
                    }}
                  >
                    <ProductCard product={product} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Products;
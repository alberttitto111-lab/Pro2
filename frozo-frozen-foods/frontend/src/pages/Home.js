import React from 'react';
import { Typography, Button, Grid, Box, Container, CircularProgress, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/storefront/ProductCard';
import { getProducts } from '../services/api';

const Home = () => {
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
  const sortedProducts = [...safeProducts]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  // Handle card click
  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Section */}
      <Box sx={{ 
        width: '100%',
        textAlign: 'center', 
        py: { xs: 6, md: 10 },
        background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography variant="h1" sx={{ 
            fontWeight: 900, 
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            Frozo
          </Typography>
          <Typography variant="h4" sx={{ 
            fontWeight: 500, 
            mb: 3,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
          }}>
            Premium Frozen Foods
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: 4, 
            maxWidth: 800, 
            mx: 'auto',
            opacity: 0.9,
            fontSize: { xs: '1rem', sm: '1.2rem', md: '1.3rem' }
          }}>
            Discover our wide range of premium frozen foods delivered fresh to your doorstep
          </Typography>
          <Button 
            component={Link} 
            to="/products" 
            variant="contained" 
            sx={{ 
              bgcolor: 'white', 
              color: '#2196F3',
              fontSize: '1.1rem',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 'bold',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: '#f5f5f5',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.25)'
              }
            }}
            size="large"
          >
            Shop Now
          </Button>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ 
        width: '100%', 
        py: { xs: 4, md: 6 },
        bgcolor: '#f8fafc'
      }}>
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Featured Products Heading - LEFT ALIGNED */}
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
              Featured Products
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '1rem', md: '1.1rem' }
            }}>
              Handpicked selection of our premium frozen foods
            </Typography>
          </Box>
          
          {/* Products Grid - Reduced spacing */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Alert severity="error" sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
                {error}
              </Alert>
              <Button variant="outlined" onClick={fetchProducts}>
                Retry
              </Button>
            </Box>
          ) : sortedProducts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products available
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Check back soon for new arrivals!
              </Typography>
              <Button variant="outlined" onClick={fetchProducts}>
                Refresh
              </Button>
            </Box>
          ) : (
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
              {sortedProducts.map((product) => (
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
          )}
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ 
        width: '100%',
        textAlign: 'center', 
        py: { xs: 6, md: 8 },
        px: { xs: 2, sm: 3, md: 4 },
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
        color: 'white'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            mb: 3,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}>
            Ready to explore more?
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: 4, 
            opacity: 0.9,
            fontSize: { xs: '1rem', md: '1.2rem' }
          }}>
            Browse our complete collection of premium frozen foods, all available for quick delivery.
          </Typography>
          <Button 
            component={Link} 
            to="/products" 
            variant="contained" 
            color="secondary" 
            size="large" 
            sx={{ 
              fontSize: '1.1rem',
              px: 5,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 'bold',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.4)'
              }
            }}
          >
            View All Products
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
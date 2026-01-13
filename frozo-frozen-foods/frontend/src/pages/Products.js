import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  Grid,
  Box,
  Container,
  CircularProgress,
  Alert,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Chip,
  IconButton,
  Rating
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/storefront/ProductCard';
import { getProducts } from '../services/api';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CategoryProductCard from '../components/storefront/CategoryProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  // Refs for horizontal scrolling
  const vegetableRef = useRef(null);
  const fruitsRef = useRef(null);
  const snacksRef = useRef(null);
  const mealsRef = useRef(null);

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'Vegetables', label: 'Vegetables' },
    { value: 'Fruits', label: 'Fruits' },
    { value: 'Ready Meals', label: 'Ready Meals' },
    { value: 'Snacks', label: 'Snacks' }
  ];

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
      setFilteredProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by category
  useEffect(() => {
    if (categoryFilter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === categoryFilter));
    }
  }, [categoryFilter, products]);

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setCategoryFilter(newCategory);
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Get category counts
  const getCategoryCount = (category) => {
    if (category === 'all') return products.length;
    return products.filter(p => p.category === category).length;
  };

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter(p => p.category === category);
  };

  // Scroll functions for horizontal navigation
  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Category sections data
  const categorySections = [
    { id: 'vegetables', name: 'Vegetables', ref: vegetableRef, color: 'success' },
    { id: 'fruits', name: 'Fruits', ref: fruitsRef, color: 'warning' },
    { id: 'snacks', name: 'Snacks', ref: snacksRef, color: 'info' },
    { id: 'meals', name: 'Ready Meals', ref: mealsRef, color: 'error' }
  ];

  return (
    <Box sx={{ width: '100%', py: { xs: 3, md: 4 } }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Page Heading */}
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

        {/* Category Filter */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Filter by Category
          </Typography>
          <ToggleButtonGroup
            value={categoryFilter}
            exclusive
            onChange={handleCategoryChange}
            aria-label="product category"
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            {categories.map((category) => (
              <ToggleButton
                key={category.value}
                value={category.value}
                sx={{
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: categoryFilter === category.value ? 'primary.main' : 'grey.300',
                  color: categoryFilter === category.value ? 'primary.main' : 'text.primary',
                  fontWeight: categoryFilter === category.value ? 600 : 400,
                  px: 3,
                  py: 1
                }}
              >
                {category.label} ({getCategoryCount(category.value)})
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Paper>

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
        ) : filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products found in this category
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try selecting a different category
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => setCategoryFilter('all')} 
              sx={{ mt: 2 }}
            >
              View All Products
            </Button>
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {categoryFilter !== 'all' && ` in ${categoryFilter}`}
              </Typography>
            </Box>

            {/* Products Grid */}
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
              {filteredProducts.map((product) => (
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
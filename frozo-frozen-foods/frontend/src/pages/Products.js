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

            {/* Category Sections (Only when viewing all products) */}
            {categoryFilter === 'all' && (
              <>
                {categorySections.map((section) => {
                  const categoryProducts = getProductsByCategory(section.name);
                  if (categoryProducts.length === 0) return null;
                  
                  return (
                    <Box key={section.id} sx={{ mt: 8 }}>
                      {/* Category Header */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 3 
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip 
                            label={section.name} 
                            color={section.color}
                            size="medium"
                            sx={{ fontWeight: 600, fontSize: '1rem' }}
                          />
                          <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {section.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => scrollLeft(section.ref)}
                            sx={{
                              border: '1px solid',
                              borderColor: 'grey.300',
                              borderRadius: 1
                            }}
                          >
                            <ArrowBackIosIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => scrollRight(section.ref)}
                            sx={{
                              border: '1px solid',
                              borderColor: 'grey.300',
                              borderRadius: 1
                            }}
                          >
                            <ArrowForwardIosIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      {/* Category Description */}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Explore our collection of premium {section.name.toLowerCase()}
                      </Typography>

                      {/* Horizontal Scroll Container */}
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          ref={section.ref}
                          sx={{
                            display: 'flex',
                            gap: 3,
                            overflowX: 'auto',
                            scrollbarWidth: 'none', // Firefox
                            '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
                            py: 2,
                            px: 1,
                            scrollBehavior: 'smooth'
                          }}
                        >
                          {/* {categoryProducts.map((product) => (
                            <Box
                              key={product._id}
                              onClick={() => handleCardClick(product._id)}
                              sx={{
                                cursor: 'pointer',
                                minWidth: { xs: '180px', sm: '220px', md: '250px' },
                                flexShrink: 0,
                                '&:hover .category-product-card': {
                                  transform: 'translateY(-6px)',
                                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                                }
                              }} */}
                              {categoryProducts.map((product) => (
                                <Box
                                  key={product._id}
                                  onClick={() => handleCardClick(product._id)}
                                  sx={{
                                    cursor: 'pointer',
                                    minWidth: { xs: '220px', sm: '280px', md: '320px' },
                                    flexShrink: 0,
                                    px: 1
                                  }}
                            >
                              {/* Custom larger card for category section */}
                              <Box className="category-product-card" sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                border: '1px solid #e0e0e0'
                              }}>
                                {/* Product Image - Larger */}
                                <Box
                                  component="img"
                                  src={product.imageUrl || 'https://via.placeholder.com/300x180'}
                                  alt={product.name}
                                  sx={{
                                    width: '100%',
                                    height: { xs: 150, sm: 180, md: 200 },
                                    objectFit: 'cover'
                                  }}
                                />

                                <Box sx={{
                                  flexGrow: 1,
                                  p: { xs: 1.5, sm: 2 },
                                  display: 'flex',
                                  flexDirection: 'column'
                                }}>
                                  {/* Category Chip */}
                                  <Box sx={{ mb: 1 }}>
                                    <Chip
                                      label={product.category}
                                      size="small"
                                      color={section.color}
                                      sx={{
                                        height: 22,
                                        fontSize: '0.7rem',
                                        fontWeight: 600
                                      }}
                                    />
                                  </Box>

                                  {/* Product Name - Larger */}
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: 600,
                                      fontSize: { xs: '0.9rem', sm: '1rem' },
                                      lineHeight: 1.3,
                                      mb: 1,
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
                                  <Typography variant="caption" color="text.secondary" sx={{
                                    mb: 1.5,
                                    display: 'block',
                                    fontSize: { xs: '0.7rem', sm: '0.8rem' }
                                  }}>
                                    {product.weight}
                                  </Typography>

                                  {/* Rating */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Rating
                                        value={product.rating}
                                        readOnly
                                        precision={0.5}
                                        size="small"
                                        sx={{ fontSize: { xs: '1rem', sm: '1.1rem' } }}
                                      />
                                      <Typography variant="caption" color="text.secondary" sx={{
                                        ml: 0.75,
                                        fontSize: { xs: '0.7rem', sm: '0.8rem' }
                                      }}>
                                        {product.rating.toFixed(1)}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  {/* Price and Button */}
                                  <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" color="primary" sx={{
                                      fontWeight: 800,
                                      fontSize: { xs: '1.1rem', sm: '1.2rem' }
                                    }}>
                                      ${product.price.toFixed(2)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>

                        {/* Scroll indicators */}
                        {categoryProducts.length > 4 && (
                          <>
                            {/* Left gradient fade */}
                            <Box sx={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: '60px',
                              background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
                              pointerEvents: 'none',
                              zIndex: 1
                            }} />
                            {/* Right gradient fade */}
                            <Box sx={{
                              position: 'absolute',
                              right: 0,
                              top: 0,
                              bottom: 0,
                              width: '60px',
                              background: 'linear-gradient(270deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
                              pointerEvents: 'none',
                              zIndex: 1
                            }} />
                          </>
                        )}
                      </Box>

                      {/* View All Button */}
                      {categoryProducts.length > 4 && (
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setCategoryFilter(section.name)}
                            sx={{ borderRadius: 2 }}
                          >
                            View All {section.name} ({categoryProducts.length})
                          </Button>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Products;
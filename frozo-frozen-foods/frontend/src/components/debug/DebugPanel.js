import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';
import { getProducts, createProduct } from '../../services/api';

const DebugPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getProducts();
      setProducts(response.data.products || []);
    } catch (err) {
      setError('Failed to fetch products: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const testCreateProduct = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    const testProduct = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 9.99,
      category: 'Vegetables',
      weight: '500g Pack',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      rating: 4.5,
      reviewCount: 10
    };

    try {
      const response = await createProduct(testProduct);
      setSuccess('Test product created successfully!');
      fetchProducts();
    } catch (err) {
      setError('Failed to create product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Paper sx={{ p: 3, mt: 3, bgcolor: '#f5f5f5' }}>
      <Typography variant="h6" gutterBottom>
        🐛 Debug Panel
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={fetchProducts}
          disabled={loading}
        >
          Refresh Products
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={testCreateProduct}
          disabled={loading}
        >
          Test Create Product
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Typography variant="subtitle2" gutterBottom>
        Current Products in Database: {products.length}
      </Typography>
      
      {products.map((product) => (
        <Box key={product._id} sx={{ mb: 1, p: 1, bgcolor: 'white', borderRadius: 1 }}>
          {product.name} - ${product.price} - {product.category}
        </Box>
      ))}
      
      {products.length === 0 && !loading && (
        <Alert severity="info">
          No products found in database
        </Alert>
      )}
    </Paper>
  );
};

export default DebugPanel;
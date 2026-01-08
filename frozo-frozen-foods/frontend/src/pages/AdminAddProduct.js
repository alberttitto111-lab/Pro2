import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductForm from '../components/admin/ProductForm';

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin')}
          sx={{ mb: 2 }}
        >
          Back to Admin
        </Button>
        
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Add New Product
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Fill in the details below to add a new product to your store.
          </Typography>
          
          <ProductForm onSuccess={handleSuccess} />
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminAddProduct;
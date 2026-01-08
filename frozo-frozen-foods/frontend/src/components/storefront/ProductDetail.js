import React from 'react';
import { Container, Grid, Typography, Box, Rating, Button, Paper } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button component={Link} to="/products" sx={{ mb: 3 }}>
        ← Back to Products
      </Button>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <img
              src={product.imageUrl || 'https://via.placeholder.com/500x400'}
              alt={product.name}
              style={{ width: '100%', height: 'auto', borderRadius: 8 }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Category: {product.category}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {product.rating} ({product.reviewCount} reviews)
            </Typography>
          </Box>
          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Weight: {product.weight}
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;
import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Rating,
  Chip,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../services/api'; // Added getProducts import
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [relatedProducts, setRelatedProducts] = React.useState([]); // Moved hook to top level
  
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Fetch main product
  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        
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

  // Fetch related products
  React.useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;
      
      try {
        const response = await getProducts();
        if (response.data && response.data.success) {
          const related = response.data.products
            .filter(p => p.category === product.category && p._id !== product._id)
            .slice(0, 4); // Show max 4 related products
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    };
    
    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    const result = await addToCart(product, 1);
    if (result.success) {
      // Optional: Show success message
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    
    const result = await toggleWishlist(product);
    if (result.success) {
      // Optional: Show success message
    }
  };

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

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              sx={{ flex: 1 }}
            >
              {isInCart(product._id) ? `Added (${getItemQuantity(product._id)})` : 'Add to Cart'}
            </Button>
            
            <IconButton
              color={isInWishlist(product._id) ? 'secondary' : 'default'}
              size="large"
              onClick={handleToggleWishlist}
              sx={{
                border: '1px solid',
                borderColor: isInWishlist(product._id) ? 'secondary.main' : 'grey.400',
                borderRadius: 2,
                width: 56,
                height: 56
              }}
            >
              {isInWishlist(product._id) ? (
                <FavoriteIcon sx={{ color: 'secondary.main' }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
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

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            More {product.category} You Might Like
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Other products in the {product.category} category
          </Typography>
          <Grid container spacing={2}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item xs={6} sm={4} md={3} key={relatedProduct._id}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={relatedProduct.imageUrl || 'https://via.placeholder.com/300x120'}
                    alt={relatedProduct.name}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      {relatedProduct.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {relatedProduct.weight}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${relatedProduct.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      component={Link}
                      to={`/products/${relatedProduct._id}`}
                      fullWidth
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetailPage;
import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar
} from '@mui/material';
import { Delete, Edit, Image as ImageIcon, Visibility, Fastfood, EmojiNature, LocalDining, Cake, Close } from '@mui/icons-material';
import { getProducts, deleteProduct } from '../services/api';
import ProductForm from '../components/admin/ProductForm';

// Example product templates
const productTemplates = {
  vegetables: {
    name: 'Mixed Vegetables',
    description: 'A delicious mix of fresh frozen vegetables including carrots, peas, corn, and green beans. Perfect for stir-fries, soups, and side dishes.',
    price: 4.99,
    category: 'Vegetables',
    weight: '1kg Pack',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 48
  },
  fruits: {
    name: 'Berry Mix',
    description: 'Sweet and tangy mix of strawberries, blueberries, raspberries, and blackberries. Great for smoothies, desserts, or as a healthy snack.',
    price: 6.99,
    category: 'Fruits',
    weight: '500g Pack',
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop',
    rating: 4.6,
    reviewCount: 36
  },
  snacks: {
    name: 'Chicken Nuggets',
    description: 'Crispy, golden-brown chicken nuggets made with 100% chicken breast meat. Ready in minutes for a quick and tasty meal.',
    price: 8.99,
    category: 'Snacks',
    weight: '750g Pack',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    rating: 4.9,
    reviewCount: 62
  }
};

const Admin = () => {
  const [products, setProducts] = React.useState([]);
  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState(null);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  // In the fetchProducts function, update it similar to Home.js:
const fetchProducts = async () => {
  try {
    setLoading(true);
    const response = await getProducts();
    
    // Handle different response structures
    let productsData = [];
    
    if (response.data && response.data.success) {
      productsData = response.data.products || [];
    } else if (Array.isArray(response.data)) {
      productsData = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      productsData = response.data.data;
    }
    
    console.log('Admin - Products fetched:', productsData.length);
    setProducts(productsData);
  } catch (error) {
    console.error('Admin - Error fetching products:', error);
    showSnackbar('Error loading products', 'error');
    setProducts([]); // Ensure it's always an array
  } finally {
    setLoading(false);
  }
};

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Vegetables': 'success',
      'Fruits': 'warning',
      'Ready Meals': 'error',
      'Snacks': 'info',
    };
    return colors[category] || 'default';
  };

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    setEditingProduct({ ...productTemplates[templateKey] });
    setFormModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedTemplate(null);
    setEditingProduct(null);
    setFormModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedTemplate(null);
    setEditingProduct(product);
    setFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    setFormModalOpen(false);
    setEditingProduct(null);
    setSelectedTemplate(null);
    fetchProducts();
    showSnackbar('Product saved successfully!', 'success');
  };

  const handleFormClose = () => {
    setFormModalOpen(false);
    setEditingProduct(null);
    setSelectedTemplate(null);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete._id);
        fetchProducts();
        showSnackbar('Product deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        showSnackbar('Error deleting product', 'error');
      }
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 4,
        p: { xs: 2, sm: 3 },
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
          }}>
            Product Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your frozen food products. Add, edit, or remove items from your store.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleAddNew}
          size="large"
          sx={{ 
            minWidth: { xs: '100%', sm: 200 },
            mt: { xs: 2, sm: 0 }
          }}
        >
          + Add New Product
        </Button>
      </Box>

      {/* Quick Add Templates */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Fastfood /> Quick Templates
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Click on a template to open the form with pre-filled data
        </Typography>
        
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                border: selectedTemplate === 'vegetables' ? '2px solid #4caf50' : '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 6px 12px rgba(76, 175, 80, 0.2)',
                  borderColor: '#4caf50'
                }
              }}
              onClick={() => handleTemplateSelect('vegetables')}
            >
              <EmojiNature sx={{ fontSize: 40, color: '#4caf50', mb: 2 }} />
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Vegetables Template
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Mixed vegetables with 1kg pack
              </Typography>
              <Button 
                variant="outlined" 
                color="success" 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateSelect('vegetables');
                }}
              >
                Use Template
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                border: selectedTemplate === 'fruits' ? '2px solid #ff9800' : '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 6px 12px rgba(255, 152, 0, 0.2)',
                  borderColor: '#ff9800'
                }
              }}
              onClick={() => handleTemplateSelect('fruits')}
            >
              <Cake sx={{ fontSize: 40, color: '#ff9800', mb: 2 }} />
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Fruits Template
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Berry mix with 500g pack
              </Typography>
              <Button 
                variant="outlined" 
                color="warning" 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateSelect('fruits');
                }}
              >
                Use Template
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                border: selectedTemplate === 'snacks' ? '2px solid #2196f3' : '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { 
                  transform: 'translateY(-4px)', 
                  boxShadow: '0 6px 12px rgba(33, 150, 243, 0.2)',
                  borderColor: '#2196f3'
                }
              }}
              onClick={() => handleTemplateSelect('snacks')}
            >
              <LocalDining sx={{ fontSize: 40, color: '#2196f3', mb: 2 }} />
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Snacks Template
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Chicken nuggets with 750g pack
              </Typography>
              <Button 
                variant="outlined" 
                color="info" 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTemplateSelect('snacks');
                }}
              >
                Use Template
              </Button>
            </Paper>
          </Grid>
        </Grid>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Click a template to open the form with pre-filled data
        </Typography>
      </Paper>

      {/* Stats Summary */}
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">
              {products.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Products
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main">
              {products.filter(p => p.category === 'Vegetables').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vegetables
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main">
              {products.filter(p => p.category === 'Fruits').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fruits
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h3" color="info.main">
              {products.filter(p => p.category === 'Snacks' || p.category === 'Ready Meals').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Meals & Snacks
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Products Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 4 }}>
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          {/* LEFT ALIGNED Heading */}
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 700,
              color: '#1a237e',
              mb: 0.5
            }}>
              Your Products ({products.length})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click Edit to modify or Delete to remove products
            </Typography>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography>Loading products...</Typography>
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Box sx={{ mb: 3 }}>
              <Fastfood sx={{ fontSize: 60, color: 'grey.400' }} />
            </Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No products yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
              Use the templates above or click "Add New Product" to get started
            </Typography>
            <Button variant="contained" onClick={handleAddNew}>
              Add Your First Product
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 4,
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              bgcolor: 'grey.100',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 1,
                            }}
                          >
                            <ImageIcon sx={{ color: 'grey.400' }} />
                          </Box>
                        )}
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                            {product.description?.substring(0, 60)}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.category}
                        color={getCategoryColor(product.category)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                        ${product.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{product.weight}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 1, fontWeight: 500 }}>
                          {product.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({product.reviewCount})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => window.open(`/products/${product._id}`, '_blank')}
                          title="View in store"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleEdit(product)}
                          title="Edit product"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(product)}
                          title="Delete product"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Sync Info */}
      <Alert severity="info" sx={{ mt: 4 }}>
        <Typography variant="body2">
          <strong>Auto-Sync:</strong> Products added, edited, or deleted here will automatically appear or update on the Home and Products pages.
        </Typography>
      </Alert>

      {/* Product Form Modal */}
      <Dialog 
        open={formModalOpen} 
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {editingProduct && editingProduct._id ? 'Edit Product' : 'Add New Product'}
            </Typography>
            {selectedTemplate && (
              <Typography variant="body2" color="info.main" sx={{ mt: 0.5 }}>
                Using {selectedTemplate} template
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleFormClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <ProductForm 
            product={editingProduct} 
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
        
        {/* <DialogActions sx={{ 
          px: 3, 
          py: 2, 
          borderTop: '1px solid #e0e0e0',
          bgcolor: 'grey.50'
        }}>
          <Button onClick={handleFormClose} color="inherit">
            Cancel
          </Button>
          <Button 
            type="submit"
            form="product-form" 
            variant="contained" 
            color="primary"
          >
            {editingProduct && editingProduct._id ? 'Update Product' : 'Save Product'}
          </Button>
        </DialogActions> */}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{productToDelete?.name}"?
            This product will be removed from the Home and Products pages.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. The product will be permanently deleted.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Delete Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Admin;
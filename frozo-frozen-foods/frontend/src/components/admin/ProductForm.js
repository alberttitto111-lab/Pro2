import React from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Grid,
  Typography,
  Divider,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createProduct, updateProduct } from '../../services/api';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import ImageIcon from '@mui/icons-material/Image';
import CancelIcon from '@mui/icons-material/Cancel';

const ProductForm = ({ product, onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, setValue } = useForm({
    defaultValues: product || {
      name: '',
      description: '',
      price: '',
      category: 'Vegetables',
      weight: '',
      imageUrl: '',
      rating: 0,
      reviewCount: 0
    }
  });

  const category = watch('category');
  const imageUrl = watch('imageUrl');
  const priceValue = watch('price');
  const ratingValue = watch('rating');

  React.useEffect(() => {
    if (product) {
      reset(product);
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    console.log('Submitting product data:', data);
    
    try {
      const productData = {
        name: data.name.trim(),
        description: data.description.trim(),
        price: parseFloat(parseFloat(data.price).toFixed(2)),
        category: data.category,
        weight: data.weight.trim(),
        imageUrl: data.imageUrl?.trim() || '',
        rating: parseFloat(parseFloat(data.rating).toFixed(1)),
        reviewCount: parseInt(data.reviewCount) || 0
      };

      console.log('Formatted product data:', productData);

      let response;
      if (product && product._id) {
        response = await updateProduct(product._id, productData);
      } else {
        response = await createProduct(productData);
      }
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        if (onSuccess) onSuccess();
      } else {
        alert('Failed to save product: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error.response?.data?.error || error.message));
    }
  };

  // Validate decimal numbers
  const validateDecimal = (value, fieldName, min = 0, max = null, decimalPlaces = 2) => {
    if (value === '' || value === null || value === undefined) {
      return `${fieldName} is required`;
    }
    
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return `${fieldName} must be a valid number`;
    }
    
    if (num < min) {
      return `${fieldName} must be at least ${min}`;
    }
    
    if (max !== null && num > max) {
      return `${fieldName} must be at most ${max}`;
    }
    
    const stringValue = value.toString();
    const decimalPart = stringValue.split('.')[1];
    if (decimalPart && decimalPart.length > decimalPlaces) {
      return `${fieldName} can have maximum ${decimalPlaces} decimal place${decimalPlaces === 1 ? '' : 's'}`;
    }
    
    return true;
  };

  const isValidImageUrl = (url) => {
    if (!url || url.trim() === '') return true;
    
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const formatDecimalDisplay = (value, decimalPlaces = 2) => {
    if (!value) return '0.00';
    const num = parseFloat(value);
    return isNaN(num) ? '0.00' : num.toFixed(decimalPlaces);
  };

  return (
    <Box component="form" id="product-form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Product Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All fields marked with * are required
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
        </Grid>

        {/* Current Values Preview */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Current Values:
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography variant="body2">
                  <strong>Price:</strong> ${formatDecimalDisplay(priceValue, 2)}
                </Typography>
                <Typography variant="body2">
                  <strong>Rating:</strong> {formatDecimalDisplay(ratingValue, 1)} ⭐
                </Typography>
                <Typography variant="body2">
                  <strong>Category:</strong> {category}
                </Typography>
              </Box>
            </Box>
          </Alert>
        </Grid>

        {/* Product Name */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Product Name *"
            {...register('name', { 
              required: 'Product name is required',
              minLength: {
                value: 2,
                message: 'Product name must be at least 2 characters'
              }
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            size="small"
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />
        </Grid>

        {/* Category */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Category *"
            select
            {...register('category', { required: 'Category is required' })}
            error={!!errors.category}
            helperText={errors.category?.message}
            size="small"
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          >
            <MenuItem value="Vegetables">Vegetables</MenuItem>
            <MenuItem value="Fruits">Fruits</MenuItem>
            <MenuItem value="Ready Meals">Ready Meals</MenuItem>
            <MenuItem value="Snacks">Snacks</MenuItem>
          </TextField>
        </Grid>

        {/* Price */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Price ($) *"
            type="number"
            step="0.01"
            inputProps={{
              min: "0.01",
              max: "10000",
              step: "0.01",
              pattern: "\\d+(\\.\\d{1,2})?"
            }}
            {...register('price', { 
              required: 'Price is required',
              validate: (value) => validateDecimal(value, 'Price', 0.01, 10000, 2)
            })}
            error={!!errors.price}
            helperText={errors.price?.message || 'Enter price with up to 2 decimal places (e.g., 4.99, 12.50)'}
            size="small"
            disabled={isSubmitting}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            onBlur={(e) => {
              if (e.target.value) {
                const num = parseFloat(e.target.value);
                if (!isNaN(num)) {
                  setValue('price', num.toFixed(2));
                }
              }
            }}
          />
        </Grid>

        {/* Weight */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Weight/Package *"
            {...register('weight', { 
              required: 'Weight is required',
              minLength: {
                value: 2,
                message: 'Weight must be at least 2 characters'
              }
            })}
            error={!!errors.weight}
            helperText={errors.weight?.message}
            size="small"
            disabled={isSubmitting}
            sx={{ mb: 2 }}
            placeholder="e.g., 500g Pack, 1kg Pack"
          />
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description *"
            multiline
            rows={3}
            {...register('description', { 
              required: 'Description is required',
              minLength: {
                value: 10,
                message: 'Description must be at least 10 characters'
              }
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
            size="small"
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />
        </Grid>

        {/* Image URL */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Image URL"
            {...register('imageUrl', {
              validate: (value) => {
                if (!value || value.trim() === '') return true;
                return isValidImageUrl(value) || 'Please enter a valid URL';
              }
            })}
            error={!!errors.imageUrl}
            helperText={errors.imageUrl?.message || 'Enter a valid image URL or leave empty'}
            size="small"
            disabled={isSubmitting}
            sx={{ mb: 2 }}
            placeholder="https://images.unsplash.com/photo-..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ImageIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Rating */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Rating (0-5) *"
            type="number"
            step="0.1"
            inputProps={{
              min: "0",
              max: "5",
              step: "0.1",
              pattern: "[0-5](\\.\\d)?"
            }}
            {...register('rating', { 
              required: 'Rating is required',
              validate: (value) => validateDecimal(value, 'Rating', 0, 5, 1)
            })}
            error={!!errors.rating}
            helperText={errors.rating?.message || 'Enter rating from 0 to 5 with 1 decimal place (e.g., 4.5, 3.7)'}
            size="small"
            disabled={isSubmitting}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StarIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            onBlur={(e) => {
              if (e.target.value) {
                const num = parseFloat(e.target.value);
                if (!isNaN(num)) {
                  setValue('rating', Math.min(5, Math.max(0, num)).toFixed(1));
                }
              }
            }}
          />
        </Grid>

        {/* Review Count */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Review Count *"
            type="number"
            inputProps={{
              min: "0",
              step: "1"
            }}
            {...register('reviewCount', { 
              required: 'Review count is required',
              min: {
                value: 0,
                message: 'Review count must be 0 or greater'
              },
              validate: (value) => {
                const num = parseInt(value);
                if (isNaN(num)) return 'Must be a valid number';
                if (num < 0) return 'Must be 0 or greater';
                if (!Number.isInteger(num)) return 'Must be a whole number';
                return true;
              }
            })}
            error={!!errors.reviewCount}
            helperText={errors.reviewCount?.message}
            size="small"
            disabled={isSubmitting}
            sx={{ mb: 2 }}
          />
        </Grid>

        {/* Decimal Examples */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              💡 Decimal Input Examples:
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Price Examples:</strong>
                </Typography>
                <Typography variant="body2" component="div">
                  • $4.99 (2 decimal places)
                </Typography>
                <Typography variant="body2" component="div">
                  • $12.50 (2 decimal places)
                </Typography>
                <Typography variant="body2" component="div">
                  • $0.99 (2 decimal places)
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Rating Examples:</strong>
                </Typography>
                <Typography variant="body2" component="div">
                  • 4.5 (1 decimal place)
                </Typography>
                <Typography variant="body2" component="div">
                  • 3.7 (1 decimal place)
                </Typography>
                <Typography variant="body2" component="div">
                  • 5.0 (1 decimal place)
                </Typography>
              </Grid>
            </Grid>
          </Alert>
        </Grid>

        {/* Image Preview */}
        {imageUrl && imageUrl.trim() !== '' && (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
              Image Preview
            </Alert>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <img
                src={imageUrl}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                }}
              />
            </Box>
          </Grid>
        )}

        {/* Action Buttons - ONLY ONE SET HERE */}
        <Grid item xs={12}>
          <Box sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: '1px solid #e0e0e0',
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 2 
          }}>
            <Button
              onClick={onSuccess}
              variant="outlined"
              color="inherit"
              startIcon={<CancelIcon />}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 150 }}
            >
              {isSubmitting ? 'Saving...' : (product && product._id ? 'Update Product' : 'Save Product')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductForm;
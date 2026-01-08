import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Product APIs with proper error handling
export const getProducts = async () => {
  try {
    const response = await API.get('/products');
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await API.get(`/products/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    console.log('Creating product:', productData);
    const response = await API.post('/products', productData);
    return response;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await API.put(`/products/${id}`, productData);
    return response;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await API.delete(`/products/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Admin Auth APIs
export const adminLogin = async (credentials) => {
  try {
    const response = await API.post('/admin/login', credentials);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const verifyToken = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('No token');
    
    const response = await API.post('/admin/verify', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
};

export default API;
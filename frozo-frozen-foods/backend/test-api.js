const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');
    
    // Test 1: Get all products
    console.log('1. Testing GET /api/products');
    const productsResponse = await axios.get('http://localhost:5000/api/products');
    console.log('   Status:', productsResponse.status);
    console.log('   Response format:', Object.keys(productsResponse.data));
    console.log('   Has products array?', Array.isArray(productsResponse.data.products));
    console.log('   Products count:', productsResponse.data.count || productsResponse.data.length || 0);
    
    // Test 2: Test create product (if you have auth token)
    console.log('\n2. Testing POST /api/products (if authenticated)');
    try {
      const testProduct = {
        name: 'API Test Product',
        description: 'Product created via API test',
        price: 19.99,
        category: 'Vegetables',
        weight: '1kg Pack',
        rating: 4.5,
        reviewCount: 10
      };
      
      // You'll need to add authentication token here if required
      const createResponse = await axios.post('http://localhost:5000/api/products', testProduct);
      console.log('   Create status:', createResponse.status);
      console.log('   Created product ID:', createResponse.data.product?._id);
    } catch (createError) {
      console.log('   Create error (might need auth):', createError.response?.status, createError.response?.data?.error);
    }
    
    console.log('\n✅ API Tests Complete');
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

testAPI();
const express = require('express');
const router = express.Router();

// Test endpoint to check if backend is working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Test notification endpoint
router.post('/test-notification', (req, res) => {
  console.log('Test notification received:', req.body);
  res.json({
    success: true,
    message: 'Test notification received successfully!',
    data: req.body
  });
});

module.exports = router;
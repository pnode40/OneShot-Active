const express = require('express');
const { authenticateToken } = require('../auth');

const router = express.Router();

// Protected route to get current user info
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    message: 'Authenticated successfully',
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

// Mock authentication endpoint
router.post('/login', (req, res) => {
  // This is a simplified mock - in a real app, you'd verify credentials
  const token = 'mock-jwt-token-for-testing';
  
  res.json({
    success: true,
    token,
    user: {
      id: 'user123',
      name: 'Test User'
    }
  });
});

module.exports = router;

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

module.exports = router;

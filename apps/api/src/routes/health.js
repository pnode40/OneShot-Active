const express = require('express');
const { testConnection } = require('../db-connection');

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const dbConnected = await testConnection();

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
      version: '1.0.0',
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

module.exports = router;

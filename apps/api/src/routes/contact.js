const express = require('express');
const { sendContactEmail } = require('../contact-form');
const { validateContactMiddleware } = require('../validation');

const router = express.Router();

// Contact form endpoint with validation
router.post('/', validateContactMiddleware, async (req, res) => {
  try {
    await sendContactEmail(req.body);

    res.status(200).json({
      message: 'Message sent successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: error.message,
    });
  }
});

module.exports = router;

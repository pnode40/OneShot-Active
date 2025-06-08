const jwt = require('jsonwebtoken');

// JWT secret from environment variable
const JWT_SECRET =
  process.env.JWT_SECRET || 'oneshot-mvp-secret-change-in-production';

/**
 * Generate JWT token for user
 * @param {Object} user - User object with id and email
 * @returns {string} JWT token
 */
function generateToken(user) {
  if (!user || !user.id) {
    throw new Error('User object with id is required');
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  // Token expires in 24 hours
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Add user info to request object
    req.user = decoded;
    next();
  });
}

module.exports = {
  generateToken,
  authenticateToken,
};

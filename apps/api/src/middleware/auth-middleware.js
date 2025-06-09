const { verifyToken, findUserById } = require('../services/auth-service');

/**
 * Authentication middleware for protected routes
 * Validates JWT token and attaches user to request object
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No token provided. Please include Authorization header with Bearer token.',
      timestamp: new Date().toISOString()
    });
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Token is expired, malformed, or invalid.',
      timestamp: new Date().toISOString()
    });
  }
  
  // Verify user still exists
  const user = findUserById(decoded.id);
  
  if (!user) {
    return res.status(401).json({
      error: 'User not found',
      message: 'Token is valid but user no longer exists.',
      timestamp: new Date().toISOString()
    });
  }
  
  // Attach user info to request (without password)
  // eslint-disable-next-line no-unused-vars
  const { password_hash: _, ...userWithoutPassword } = user;
  req.user = userWithoutPassword;
  req.token = decoded;
  
  next();
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't block request if invalid
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    const decoded = verifyToken(token);
    
    if (decoded) {
      const user = findUserById(decoded.id);
      
      if (user) {
        // eslint-disable-next-line no-unused-vars
        const { password_hash: _, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
        req.token = decoded;
      }
    }
  }
  
  next();
}

/**
 * Admin-only middleware
 * Requires authentication and admin role (future enhancement)
 */
function requireAdmin(req, res, next) {
  // First authenticate
  authenticateToken(req, res, (error) => {
    if (error) return;
    
    // For now, all authenticated users are considered admins
    // In the future, add role-based checks here
    if (!req.user) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin access required.',
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  });
}

/**
 * Rate limiting middleware for auth endpoints
 */
const authRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again in 15 minutes.',
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  authRateLimit
}; 
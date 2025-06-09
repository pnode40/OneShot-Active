const express = require('express');
const { registerSchema, loginSchema } = require('../validation/auth');
const { 
  createUser, 
  authenticateUser, 
  generateToken,
  getAllUsers 
} = require('../services/auth-service');
const { 
  authenticateToken, 
  optionalAuth, 
  authRateLimit 
} = require('../middleware/auth-middleware');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post('/register', authRateLimit, async (req, res) => {
  try {
    // Validate request body
    const validation = registerSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input and try again.',
        details: validation.error.errors.map(err => ({
          field: err.path[0],
          message: err.message
        })),
        timestamp: new Date().toISOString()
      });
    }
    
    const { email, password } = validation.data;
    
    // Create new user
    const user = await createUser({ email, password });
    
    // Generate JWT token
    const token = generateToken(user);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      token,
      expires_in: '24h',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle known errors
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'An account with this email address already exists.',
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred while creating your account. Please try again.',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', authRateLimit, async (req, res) => {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please provide valid email and password.',
        details: validation.error.errors.map(err => ({
          field: err.path[0],
          message: err.message
        })),
        timestamp: new Date().toISOString()
      });
    }
    
    const { email, password } = validation.data;
    
    // Authenticate user
    const user = await authenticateUser(email, password);
    
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password.',
        timestamp: new Date().toISOString()
      });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      token,
      expires_in: '24h',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during authentication. Please try again.',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user information
 */
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    token_info: {
      issued_at: new Date(req.token.iat * 1000).toISOString(),
      expires_at: new Date(req.token.exp * 1000).toISOString()
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/auth/logout
 * Logout user (client should delete token)
 */
router.post('/logout', optionalAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully. Please delete your token.',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/auth/users
 * Get all users (admin/development endpoint)
 */
router.get('/users', authenticateToken, (req, res) => {
  try {
    const users = getAllUsers();
    
    res.json({
      success: true,
      count: users.length,
      users,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    
    res.status(500).json({
      error: 'Failed to fetch users',
      message: 'An error occurred while retrieving user list.',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/auth/verify
 * Verify if a token is valid (useful for frontend)
 */
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    valid: true,
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

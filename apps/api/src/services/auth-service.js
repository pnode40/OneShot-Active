const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// In-memory users store (will be replaced with database later)
let users = [
  {
    id: '1',
    email: 'test@example.com',
    password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    created_at: '2025-06-08T10:00:00Z',
    updated_at: '2025-06-08T10:00:00Z'
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const BCRYPT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare a password with its hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} Password match result
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    iat: Math.floor(Date.now() / 1000)
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Object|null} User object or null if not found
 */
function findUserByEmail(email) {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Object|null} User object or null if not found
 */
function findUserById(id) {
  return users.find(user => user.id === id) || null;
}

/**
 * Create a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user object (without password)
 */
async function createUser(userData) {
  const { email, password } = userData;
  
  // Check if user already exists
  if (findUserByEmail(email)) {
    throw new Error('User with this email already exists');
  }
  
  // Hash password
  const password_hash = await hashPassword(password);
  
  // Create user object
  const newUser = {
    id: uuidv4(),
    email: email.toLowerCase().trim(),
    password_hash,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Add to users array
  users.push(newUser);
  
  // Return user without password hash
  // eslint-disable-next-line no-unused-vars
  const { password_hash: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object|null>} User object (without password) or null if invalid
 */
async function authenticateUser(email, password) {
  const user = findUserByEmail(email);
  
  if (!user) {
    return null;
  }
  
  const isValidPassword = await comparePassword(password, user.password_hash);
  
  if (!isValidPassword) {
    return null;
  }
  
  // Return user without password hash
  // eslint-disable-next-line no-unused-vars
  const { password_hash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Get all users (admin function - without passwords)
 * @returns {Array} Array of users without password hashes
 */
function getAllUsers() {
  return users.map(user => {
    // eslint-disable-next-line no-unused-vars
    const { password_hash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  findUserByEmail,
  findUserById,
  createUser,
  authenticateUser,
  getAllUsers,
  // Export users array for debugging (remove in production)
  users: process.env.NODE_ENV === 'development' ? users : undefined
};
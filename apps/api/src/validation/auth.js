const { z } = require('zod');

/**
 * User registration validation schema
 * Validates email format and password strength requirements
 */
const registerSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim(),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

/**
 * User login validation schema
 * Validates email and password for authentication
 */
const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  
  password: z
    .string()
    .min(1, 'Password is required'),
});

/**
 * Password change validation schema
 * For future password update functionality
 */
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'New password must not exceed 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'New password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
};
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');

// Import all schemas
const { users } = require('./schema/users');

// Database connection configuration
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://localhost:5432/oneshot_mvp',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

// Initialize Drizzle with the PostgreSQL pool
const db = drizzle(pool, {
  schema: {
    users,
  },
});

/**
 * Test database connection
 * @returns {Promise<boolean>} Connection status
 */
async function testConnection() {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Gracefully close database connection
 */
async function closeConnection() {
  try {
    await pool.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}

module.exports = {
  db,
  pool,
  testConnection,
  closeConnection,
};
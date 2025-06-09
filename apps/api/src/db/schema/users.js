const { pgTable, uuid, text, timestamp } = require('drizzle-orm/pg-core');

/**
 * Users table schema for authentication
 * Stores user account information with secure password hashing
 */
const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

module.exports = { users };
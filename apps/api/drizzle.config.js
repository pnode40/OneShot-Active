const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
  schema: './src/db/schema/*.js',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/oneshot_mvp',
  },
  verbose: true,
  strict: true,
});
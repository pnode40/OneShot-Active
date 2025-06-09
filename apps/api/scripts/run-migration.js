const fs = require('fs');
const path = require('path');
const { pool } = require('../src/db-connection');

async function runMigration() {
  const migrationPath = path.join(__dirname, '../src/db/migrations/0001_create_users_table.sql');
  
  try {
    console.log('🚀 Running users table migration...');
    
    // Read the migration SQL file
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('✅ Users table migration completed successfully');
    console.log('📋 Created:');
    console.log('  - users table with UUID primary key');
    console.log('  - email uniqueness constraint');
    console.log('  - automatic updated_at trigger');
    console.log('  - performance indexes');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('🎯 Migration process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };
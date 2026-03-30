const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, 'backend/src/db/migrations/003_usage_tracking.sql'),
      'utf8'
    );
    
    console.log('Running migration...');
    await pool.query(sql);
    console.log('✅ Migration complete!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

runMigration();

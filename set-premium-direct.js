// Direct database update for premium status
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setPremium() {
  try {
    const result = await pool.query(
      `UPDATE users SET tier = 'premium' WHERE email = 'jeffrey.holst@gmail.com' RETURNING email, tier`
    );
    
    if (result.rows.length === 0) {
      console.log('❌ No user found with that email');
      process.exit(1);
    }
    
    console.log('✅ Premium status set!');
    console.log(result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setPremium();

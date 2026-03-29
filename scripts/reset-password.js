// Quick script to reset a user's password
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function resetPassword(email, newPassword) {
  try {
    const hash = await bcrypt.hash(newPassword, 10);
    
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email',
      [hash, email]
    );
    
    if (result.rows.length === 0) {
      console.log('❌ User not found:', email);
    } else {
      console.log('✅ Password reset for:', result.rows[0].email);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

// Get args
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node reset-password.js <email> <password>');
  process.exit(1);
}

resetPassword(email, password);

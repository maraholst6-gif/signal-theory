const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://signal_theory_db_user:Vddt7GZzlGNxW3ByKlr4WpNZD6PdCCeP@dpg-d73s62ldvhlc73b0pf60-a.oregon-postgres.render.com/signal_theory_db';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkUser() {
  const email = 'jeffrey.holst@gmail.com';
  
  try {
    const result = await pool.query(
      `SELECT id, email, tier, subscription_status FROM users WHERE email = $1`,
      [email]
    );
    
    if (result.rows.length === 0) {
      console.log('❌ User not found in database');
    } else {
      console.log('✅ User found:');
      console.log(JSON.stringify(result.rows[0], null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkUser();

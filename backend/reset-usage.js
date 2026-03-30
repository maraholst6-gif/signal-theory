const {Pool} = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false}
});

(async () => {
  try {
    await pool.query(`DELETE FROM user_usage WHERE user_id='df1a52fb-9239-47db-a991-614d13ecc91a'`);
    console.log('✅ Usage reset for jeffrey.holst@gmail.com');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();

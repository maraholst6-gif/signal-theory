const { Pool } = require('pg');

const DATABASE_URL = 'postgresql://signal_theory_db_user:Vddt7GZzlGNxW3ByKlr4WpNZD6PdCCeP@dpg-d73s62ldvhlc73b0pf60-a.oregon-postgres.render.com/signal_theory_db';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query(`UPDATE users SET tier = 'premium' WHERE email = 'maraholst6@gmail.com' RETURNING email, tier`)
  .then(result => {
    console.log('✅ Result:', result.rows);
    pool.end();
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
    pool.end();
    process.exit(1);
  });

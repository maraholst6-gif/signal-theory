const {Pool} = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://signal_theory_db_user:gw0BLFlYvNm8dZ6VTQ3ET4l53p4n6RsW@dpg-d74bbu15pdvs73849l6g-a.oregon-postgres.render.com/signal_theory_db',
  ssl: { rejectUnauthorized: false }
});

// First check ALL users
pool.query("SELECT id, email, created_at FROM users ORDER BY created_at DESC")
  .then(r => {
    console.log('Found users:', r.rows);
    if (r.rows.length > 0) {
      return pool.query("DELETE FROM users WHERE email = 'jeffrey.holst@gmail.com'");
    } else {
      console.log('No user found to delete');
      pool.end();
    }
  })
  .then(r => {
    if (r) {
      console.log('✅ Deleted:', r.rowCount, 'rows');
    }
    pool.end();
  })
  .catch(e => {
    console.error('❌ Error:', e.message);
    pool.end();
  });

const {Pool} = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://signal_theory_db_0u6q_user:IbmZ3MBMVQ4j0A0oLaT6hCFPUBUxeAdp@dpg-ctjt4cij1k6c73alj6eg-a.ohio-postgres.render.com/signal_theory_db_0u6q',
  ssl: { rejectUnauthorized: false }
});

pool.query("UPDATE email_subscribers SET quiz_profile = $1 WHERE email = $2", ['anxious-overreader', 'maraholst6@gmail.com'])
  .then(r => {
    console.log('Updated', r.rowCount, 'row(s)');
    pool.end();
  })
  .catch(err => {
    console.error('Error:', err);
    pool.end();
  });

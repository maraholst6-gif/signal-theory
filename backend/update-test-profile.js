const pool = require('./dist/db/pool').default;

pool.query("UPDATE email_subscribers SET quiz_profile = $1 WHERE email = $2 RETURNING email, quiz_profile", ['anxious-overreader', 'maraholst6@gmail.com'])
  .then(r => {
    console.log('Updated:', r.rows[0]);
    pool.end();
  })
  .catch(err => {
    console.error('Error:', err);
    pool.end();
  });

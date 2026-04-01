const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSubscribers() {
  try {
    const result = await pool.query(
      `SELECT email, first_name, quiz_profile, source, created_at 
       FROM email_subscribers 
       WHERE email IN ($1, $2) 
       ORDER BY created_at DESC`,
      ['jdholst78@gmail.com', 'holstrealestate@gmail.com']
    );

    if (result.rows.length === 0) {
      console.log('No subscribers found for those email addresses.');
    } else {
      console.log(`Found ${result.rows.length} subscriber(s):\n`);
      result.rows.forEach(row => {
        console.log(`Email: ${row.email}`);
        console.log(`Name: ${row.first_name || '(none)'}`);
        console.log(`Quiz Profile: ${row.quiz_profile || '(none)'}`);
        console.log(`Source: ${row.source}`);
        console.log(`Created: ${row.created_at}`);
        console.log('---');
      });
    }

    await pool.end();
  } catch (err) {
    console.error('Query error:', err);
    process.exit(1);
  }
}

checkSubscribers();

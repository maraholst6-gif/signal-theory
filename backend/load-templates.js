// One-time script to load action plans from markdown files into database
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const PROFILE_FILES = {
  'ready-navigator': 'ready-navigator.md',
  'rusty-romantic': 'rusty-romantic.md',
  'eager-rebuilder': 'eager-rebuilder.md',
  'cautious-observer': 'cautious-observer.md',
  'wounded-analyst': 'wounded-analyst.md',
  'pattern-repeater': 'pattern-repeater.md',
  'inconsistent-dater': 'inconsistent-dater-example.md',
  'self-aware-learner': 'self-aware-learner.md',
};

async function loadTemplates() {
  const dir = path.join(__dirname, 'email-action-plans');
  
  for (const [profileId, filename] of Object.entries(PROFILE_FILES)) {
    const filePath = path.join(dir, filename);
    const markdown = fs.readFileSync(filePath, 'utf-8');
    
    // Extract subject
    const subjectMatch = markdown.match(/\*\*Subject:\*\*\s*(.+)/);
    const subject = subjectMatch ? subjectMatch[1].trim() : `Your Dating Readiness Profile`;
    
    // Store the full markdown (we'll convert to HTML on the fly)
    await pool.query(
      `INSERT INTO email_templates (profile_id, subject, body)
       VALUES ($1, $2, $3)
       ON CONFLICT (profile_id) DO UPDATE
       SET subject = EXCLUDED.subject, body = EXCLUDED.body, updated_at = NOW()`,
      [profileId, subject, markdown]
    );
    
    console.log(`✓ Loaded ${profileId}`);
  }
  
  await pool.end();
  console.log('Done!');
}

loadTemplates().catch(console.error);

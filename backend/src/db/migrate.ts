import fs from 'fs';
import path from 'path';
import pool from './pool';

async function migrate(): Promise<void> {
  const migrationDir = path.join(__dirname, 'migrations');
  const files = fs
    .readdirSync(migrationDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log('[migrate] Running migrations...');

  for (const file of files) {
    const filePath = path.join(migrationDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');
    console.log(`[migrate] Applying: ${file}`);
    await pool.query(sql);
    console.log(`[migrate] Done: ${file}`);
  }

  console.log('[migrate] All migrations complete.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('[migrate] Failed:', err);
  process.exit(1);
});

import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db/pool';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Middleware: require admin
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = (req as any).user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query('SELECT is_admin FROM users WHERE id = $1', [userId]);
    if (!result.rows[0]?.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Failed to verify admin status' });
  }
}

// DELETE /api/admin/subscribers/delete — delete a subscriber by email
router.delete('/subscribers/delete', async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'email query param required' });
    return;
  }
  try {
    // Delete queue entries first (foreign key)
    await pool.query(
      `DELETE FROM email_queue WHERE subscriber_id IN (SELECT id FROM email_subscribers WHERE email = $1)`,
      [email.trim().toLowerCase()]
    );
    await pool.query(
      `DELETE FROM email_log WHERE subscriber_id IN (SELECT id FROM email_subscribers WHERE email = $1)`,
      [email.trim().toLowerCase()]
    );
    const result = await pool.query(
      'DELETE FROM email_subscribers WHERE email = $1 RETURNING email',
      [email.trim().toLowerCase()]
    );
    res.json({ deleted: result.rowCount });
  } catch (err) {
    console.error('[admin/delete]', err);
    res.status(500).json({ error: 'Delete failed', message: String(err) });
  }
});

// GET /api/admin/templates/check — check if email templates are loaded
router.get('/templates/check', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT profile_id, subject FROM email_templates ORDER BY profile_id');
    res.json({ 
      count: result.rows.length,
      templates: result.rows 
    });
  } catch (err) {
    console.error('[admin/templates]', err);
    res.status(500).json({ error: 'Query failed', message: String(err) });
  }
});

// GET /api/admin/subscribers/since/:timestamp — get subscribers created after timestamp (for CRM sync)
router.get('/subscribers/since/:timestamp', async (req: Request, res: Response) => {
  const { timestamp } = req.params;
  const sinceDate = new Date(timestamp);

  if (isNaN(sinceDate.getTime())) {
    res.status(400).json({ error: 'Invalid timestamp. Use ISO 8601 format (e.g. 2024-01-01T00:00:00Z)' });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT id, email, first_name, quiz_profile, source, created_at, unsubscribed_at
       FROM email_subscribers
       WHERE created_at > $1
       ORDER BY created_at ASC`,
      [sinceDate.toISOString()]
    );

    res.json({
      count: result.rows.length,
      since: sinceDate.toISOString(),
      subscribers: result.rows
    });
  } catch (err) {
    console.error('[admin/subscribers/since]', err);
    res.status(500).json({ error: 'Query failed', message: String(err) });
  }
});

// GET /api/admin/subscribers/all — get all subscribers (for CRM initial import)
router.get('/subscribers/all', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, quiz_profile, source, created_at, unsubscribed_at
       FROM email_subscribers
       ORDER BY created_at ASC`
    );

    res.json({
      count: result.rows.length,
      subscribers: result.rows
    });
  } catch (err) {
    console.error('[admin/subscribers/all]', err);
    res.status(500).json({ error: 'Query failed', message: String(err) });
  }
});

// GET /api/admin/subscribers/check — check if emails exist in database
router.get('/subscribers/check', async (req: Request, res: Response) => {
  const { emails } = req.query;
  
  if (!emails || typeof emails !== 'string') {
    res.status(400).json({ error: 'emails query param required (comma-separated)' });
    return;
  }

  const emailList = emails.split(',').map(e => e.trim().toLowerCase());

  try {
    const result = await pool.query(
      `SELECT email, first_name, quiz_profile, source, created_at, unsubscribed_at
       FROM email_subscribers 
       WHERE email = ANY($1::text[])
       ORDER BY created_at DESC`,
      [emailList]
    );

    res.json({ 
      count: result.rows.length,
      subscribers: result.rows 
    });
  } catch (err) {
    console.error('[admin/check]', err);
    res.status(500).json({ error: 'Query failed' });
  }
});

// GET /api/admin/stats — usage statistics
router.get('/stats', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM admin_usage_stats');
    const stats = result.rows[0] || {};
    return res.json({ stats });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/prompts/history — all prompt versions
router.get('/prompts/history', requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, name, version, prompt_text, active, created_at
       FROM ai_prompts
       WHERE name = 'scenario_coach'
       ORDER BY version DESC`
    );
    return res.json({ prompts: result.rows });
  } catch (err) {
    console.error('Prompt history error:', err);
    return res.status(500).json({ error: 'Failed to fetch prompt history' });
  }
});

// PUT /api/admin/prompts/scenario-coach — create new version + activate it
router.put('/prompts/scenario-coach', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const { prompt_text } = req.body;
  const userId = (req as any).user.userId;

  if (!prompt_text || typeof prompt_text !== 'string' || prompt_text.trim().length < 20) {
    return res.status(400).json({ error: 'prompt_text must be at least 20 characters' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Get current max version
    const versionResult = await client.query(
      `SELECT COALESCE(MAX(version), 0) + 1 AS next_version FROM ai_prompts WHERE name = 'scenario_coach'`
    );
    const nextVersion = versionResult.rows[0].next_version;

    // Deactivate all existing versions
    await client.query(`UPDATE ai_prompts SET active = FALSE WHERE name = 'scenario_coach'`);

    // Insert new active version
    const insertResult = await client.query(
      `INSERT INTO ai_prompts (name, version, prompt_text, active, created_by)
       VALUES ('scenario_coach', $1, $2, TRUE, $3)
       RETURNING id, version, active, created_at`,
      [nextVersion, prompt_text.trim(), userId]
    );

    await client.query('COMMIT');
    return res.json({ saved: true, prompt: insertResult.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Prompt update error:', err);
    return res.status(500).json({ error: 'Failed to save prompt' });
  } finally {
    client.release();
  }
});

// GET /api/prompts/scenario-coach — public endpoint to get active prompt (for scenario engine)
// Mounted separately at /api/prompts, not /api/admin
export async function getActivePrompt(_req: Request, res: Response) {
  try {
    const result = await pool.query(
      `SELECT version, prompt_text, created_at
       FROM ai_prompts
       WHERE name = 'scenario_coach' AND active = TRUE
       ORDER BY version DESC
       LIMIT 1`
    );
    if (!result.rows[0]) {
      return res.json({
        version: 0,
        prompt_text: 'You are a Signal Theory dating coach. Respond realistically to user actions in dating scenarios. After 5 turns, provide analysis grounded in behavioral observation.',
        created_at: null
      });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Get active prompt error:', err);
    return res.status(500).json({ error: 'Failed to fetch prompt' });
  }
}

export default router;

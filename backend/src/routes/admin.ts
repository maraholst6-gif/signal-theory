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

// ─────────────────────────────────────────────
// Dashboard endpoints (no auth — obscurity-based)
// ─────────────────────────────────────────────

// GET /api/admin/dashboard/stats
router.get('/dashboard/stats', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM email_subscribers)::int AS "totalSubscribers",
        (SELECT COUNT(*) FROM email_subscribers WHERE unsubscribed_at IS NULL)::int AS "activeSubscribers",
        (SELECT COUNT(*) FROM email_subscribers WHERE unsubscribed_at IS NOT NULL)::int AS "unsubscribedCount",
        (SELECT COUNT(*) FROM email_log WHERE status = 'sent')::int AS "emailsSent",
        (SELECT COUNT(*) FROM email_queue WHERE status = 'pending')::int AS "emailsPending"
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[dashboard/stats]', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/admin/dashboard/subscribers
router.get('/dashboard/subscribers', async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(200, parseInt(req.query.limit as string) || 50);
  const search = (req.query.search as string || '').trim();
  const sortAllowed = ['created_at', 'email', 'first_name', 'quiz_profile', 'source', 'unsubscribed_at'];
  const sort = sortAllowed.includes(req.query.sort as string) ? req.query.sort as string : 'created_at';
  const order = req.query.order === 'asc' ? 'ASC' : 'DESC';
  const offset = (page - 1) * limit;

  try {
    const whereClause = search ? `WHERE email ILIKE $3` : '';
    const params: any[] = search
      ? [limit, offset, `%${search}%`]
      : [limit, offset];

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM email_subscribers ${search ? `WHERE email ILIKE $1` : ''}`,
      search ? [`%${search}%`] : []
    );

    const rows = await pool.query(
      `SELECT id, email, first_name, quiz_profile, source, created_at, unsubscribed_at
       FROM email_subscribers
       ${whereClause}
       ORDER BY ${sort} ${order} NULLS LAST
       LIMIT $1 OFFSET $2`,
      params
    );

    const total = countResult.rows[0].total;
    res.json({
      subscribers: rows.rows,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[dashboard/subscribers]', err);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

// GET /api/admin/dashboard/profiles
router.get('/dashboard/profiles', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT COALESCE(quiz_profile, 'unknown') AS profile_id, COUNT(*)::int AS count
      FROM email_subscribers
      GROUP BY quiz_profile
      ORDER BY count DESC
    `);
    res.json({ profiles: result.rows });
  } catch (err) {
    console.error('[dashboard/profiles]', err);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// GET /api/admin/dashboard/queue
router.get('/dashboard/queue', async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const limit = Math.min(200, parseInt(req.query.limit as string) || 50);
  const statusAllowed = ['pending', 'sent', 'failed', 'cancelled'];

  try {
    const whereClause = status && statusAllowed.includes(status) ? `WHERE q.status = $2` : '';
    const params: any[] = status && statusAllowed.includes(status) ? [limit, status] : [limit];

    const result = await pool.query(
      `SELECT q.id, s.email AS subscriber_email, q.template_name, q.status,
              q.scheduled_for, q.attempts, q.last_attempted_at, q.error_message
       FROM email_queue q
       JOIN email_subscribers s ON s.id = q.subscriber_id
       ${whereClause}
       ORDER BY q.scheduled_for DESC
       LIMIT $1`,
      params
    );
    res.json({ emails: result.rows });
  } catch (err) {
    console.error('[dashboard/queue]', err);
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
});

// GET /api/admin/dashboard/email-log
router.get('/dashboard/email-log', async (req: Request, res: Response) => {
  const limit = Math.min(200, parseInt(req.query.limit as string) || 50);
  try {
    const result = await pool.query(
      `SELECT l.id, l.email AS subscriber_email, l.template_name, l.status, l.sent_at, l.error_message
       FROM email_log l
       ORDER BY l.sent_at DESC
       LIMIT $1`,
      [limit]
    );
    res.json({ emails: result.rows });
  } catch (err) {
    console.error('[dashboard/email-log]', err);
    res.status(500).json({ error: 'Failed to fetch email log' });
  }
});

// GET /api/admin/dashboard/templates
router.get('/dashboard/templates', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, profile_id, subject, body, created_at, updated_at
       FROM email_templates
       ORDER BY profile_id`
    );
    res.json({ templates: result.rows });
  } catch (err) {
    console.error('[dashboard/templates]', err);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// GET /api/admin/dashboard/subscribers/:id/history
router.get('/dashboard/subscribers/:id/history', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const result = await pool.query(
      `SELECT l.template_name, l.status, l.sent_at, l.error_message
       FROM email_log l
       WHERE l.subscriber_id = $1
       ORDER BY l.sent_at DESC`,
      [id]
    );
    res.json({ history: result.rows });
  } catch (err) {
    console.error('[dashboard/history]', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// POST /api/admin/dashboard/subscribers/:id/unsubscribe
router.post('/dashboard/subscribers/:id/unsubscribe', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    await pool.query(
      `UPDATE email_subscribers SET unsubscribed_at = NOW() WHERE id = $1 AND unsubscribed_at IS NULL`,
      [id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('[dashboard/unsubscribe]', err);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// POST /api/admin/dashboard/subscribers/:id/resubscribe
router.post('/dashboard/subscribers/:id/resubscribe', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    await pool.query(
      `UPDATE email_subscribers SET unsubscribed_at = NULL WHERE id = $1`,
      [id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('[dashboard/resubscribe]', err);
    res.status(500).json({ error: 'Failed to resubscribe' });
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

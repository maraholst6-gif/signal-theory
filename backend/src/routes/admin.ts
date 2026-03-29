import { Router, Request, Response, NextFunction } from 'express';
import { pool } from '../db/pool';
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

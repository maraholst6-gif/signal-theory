import { Router, Response } from 'express';
import pool from '../db/pool';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

// ─────────────────────────────────────────────
// Week reset helper — resets every Monday 00:00
// ─────────────────────────────────────────────

function isNewWeek(weekResetAt: Date): boolean {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sunday, 1=Monday
  const lastMonday = new Date(now);
  lastMonday.setDate(
    now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
  );
  lastMonday.setHours(0, 0, 0, 0);
  return weekResetAt < lastMonday;
}

// ─────────────────────────────────────────────
// Week start helper — returns Monday of current week (UTC) as YYYY-MM-DD
// ─────────────────────────────────────────────

function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

// ─────────────────────────────────────────────
// GET /api/usage
// ─────────────────────────────────────────────

router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const result = await pool.query(
      `SELECT scenarios_used_week, analyses_used_week, week_reset_at, subscription_status, tier
       FROM users WHERE id = $1`,
      [userId]
    );

    const user = result.rows[0];
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    // Auto-reset legacy counters if new week
    if (isNewWeek(new Date(user.week_reset_at))) {
      const resetResult = await pool.query(
        `UPDATE users
         SET scenarios_used_week = 0, analyses_used_week = 0, week_reset_at = NOW()
         WHERE id = $1
         RETURNING scenarios_used_week, analyses_used_week, week_reset_at`,
        [userId]
      );
      user.scenarios_used_week = resetResult.rows[0].scenarios_used_week;
      user.analyses_used_week = resetResult.rows[0].analyses_used_week;
      user.week_reset_at = resetResult.rows[0].week_reset_at;
    }

    // Fetch weekly usage from user_usage table
    const weekStart = getWeekStart();
    const usageResult = await pool.query(
      `SELECT quizzes_completed, scenarios_completed, analyzer_uses
       FROM user_usage WHERE user_id = $1 AND week_start = $2`,
      [userId, weekStart]
    );
    const weeklyUsage = usageResult.rows[0] || {
      quizzes_completed: 0,
      scenarios_completed: 0,
      analyzer_uses: 0,
    };

    res.json({
      scenarios_used_week: user.scenarios_used_week,
      analyses_used_week: user.analyses_used_week,
      week_reset_at: user.week_reset_at,
      subscription_status: user.subscription_status,
      tier: user.tier ?? 'free',
      quizzes_completed: weeklyUsage.quizzes_completed,
      scenarios_completed: weeklyUsage.scenarios_completed,
      analyzer_uses: weeklyUsage.analyzer_uses,
    });
  } catch (err) {
    console.error('[usage/get]', err);
    res.status(500).json({ error: 'Failed to fetch usage.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/usage/track
// ─────────────────────────────────────────────

router.post('/track', async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { type } = req.body as { type?: string };

  const VALID_TYPES = ['quiz', 'scenario', 'analyzer'] as const;
  if (!type || !VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
    res.status(400).json({ error: 'Invalid type. Must be quiz, scenario, or analyzer.' });
    return;
  }

  const column = type === 'quiz' ? 'quizzes_completed'
               : type === 'scenario' ? 'scenarios_completed'
               : 'analyzer_uses';

  const weekStart = getWeekStart();

  try {
    await pool.query(
      `INSERT INTO user_usage (user_id, week_start, ${column})
       VALUES ($1, $2, 1)
       ON CONFLICT (user_id, week_start)
       DO UPDATE SET ${column} = user_usage.${column} + 1, updated_at = NOW()`,
      [userId, weekStart]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('[usage/track]', err);
    res.status(500).json({ error: 'Failed to track usage.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/usage/reset (admin only via secret header)
// ─────────────────────────────────────────────

router.post('/reset', async (req: AuthRequest, res: Response) => {
  const adminSecret = req.headers['x-admin-secret'];

  if (
    !process.env.ADMIN_SECRET ||
    adminSecret !== process.env.ADMIN_SECRET
  ) {
    res.status(403).json({ error: 'Forbidden.' });
    return;
  }

  const userId = req.user!.userId;

  try {
    await pool.query(
      `UPDATE users
       SET scenarios_used_week = 0, analyses_used_week = 0, week_reset_at = NOW()
       WHERE id = $1`,
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('[usage/reset]', err);
    res.status(500).json({ error: 'Failed to reset usage.' });
  }
});

export default router;

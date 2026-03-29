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
// GET /api/usage
// ─────────────────────────────────────────────

router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const result = await pool.query(
      `SELECT scenarios_used_week, analyses_used_week, week_reset_at, subscription_status
       FROM users WHERE id = $1`,
      [userId]
    );

    const user = result.rows[0];
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    // Auto-reset if new week
    if (isNewWeek(new Date(user.week_reset_at))) {
      const resetResult = await pool.query(
        `UPDATE users
         SET scenarios_used_week = 0, analyses_used_week = 0, week_reset_at = NOW()
         WHERE id = $1
         RETURNING scenarios_used_week, analyses_used_week, week_reset_at`,
        [userId]
      );

      const updated = resetResult.rows[0];
      return res.json({
        scenarios_used_week: updated.scenarios_used_week,
        analyses_used_week: updated.analyses_used_week,
        week_reset_at: updated.week_reset_at,
        subscription_status: user.subscription_status,
      });
    }

    res.json({
      scenarios_used_week: user.scenarios_used_week,
      analyses_used_week: user.analyses_used_week,
      week_reset_at: user.week_reset_at,
      subscription_status: user.subscription_status,
    });
  } catch (err) {
    console.error('[usage/get]', err);
    res.status(500).json({ error: 'Failed to fetch usage.' });
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

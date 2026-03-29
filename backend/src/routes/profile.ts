import { Router, Response } from 'express';
import pool from '../db/pool';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// All profile routes require auth
router.use(requireAuth);

// ─────────────────────────────────────────────
// GET /api/profile
// ─────────────────────────────────────────────

router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const userResult = await pool.query(
      `SELECT id, email, display_name, profile_type, subscription_status,
              scenarios_used_week, analyses_used_week, week_reset_at, quiz_profile_id, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    const user = userResult.rows[0];
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    let quizProfile = null;
    if (user.quiz_profile_id) {
      const qpResult = await pool.query(
        `SELECT id, email, profile_type, signal_score, readiness_score, strategy_score,
                weak_questions, action_plan_practices, quiz_completed_at, app_linked_at
         FROM quiz_profiles WHERE id = $1`,
        [user.quiz_profile_id]
      );
      quizProfile = qpResult.rows[0] ?? null;
    }

    res.json({ user, quizProfile });
  } catch (err) {
    console.error('[profile/get]', err);
    res.status(500).json({ error: 'Failed to load profile.' });
  }
});

// ─────────────────────────────────────────────
// PATCH /api/profile
// ─────────────────────────────────────────────

router.patch('/', async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { display_name, profile_type } = req.body as {
    display_name?: string;
    profile_type?: string;
  };

  const validProfileTypes = [
    'ready-navigator',
    'over-analyst',
    'rusty-romantic',
    'signal-blind',
    'unknown',
  ];

  if (
    profile_type !== undefined &&
    !validProfileTypes.includes(profile_type)
  ) {
    res.status(400).json({ error: 'Invalid profile_type.' });
    return;
  }

  try {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (display_name !== undefined) {
      fields.push(`display_name = $${idx++}`);
      values.push(display_name.trim() || null);
    }

    if (profile_type !== undefined) {
      fields.push(`profile_type = $${idx++}`);
      values.push(profile_type);
    }

    if (fields.length === 0) {
      res.status(400).json({ error: 'No fields to update.' });
      return;
    }

    values.push(userId);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')}
       WHERE id = $${idx}
       RETURNING id, email, display_name, profile_type, subscription_status,
                 scenarios_used_week, analyses_used_week, week_reset_at, quiz_profile_id, created_at`,
      values
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('[profile/patch]', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

export default router;

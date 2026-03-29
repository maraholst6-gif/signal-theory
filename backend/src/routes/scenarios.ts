import { Router, Response } from 'express';
import pool from '../db/pool';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

// ─────────────────────────────────────────────
// GET /api/scenarios
// Optional query params: category, difficulty, profile_type, limit
// ─────────────────────────────────────────────

router.get('/', async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const {
    category,
    difficulty,
    limit = '20',
    exclude_completed,
  } = req.query as {
    category?: string;
    difficulty?: string;
    limit?: string;
    exclude_completed?: string;
  };

  try {
    // Fetch user profile type for filtering
    const userResult = await pool.query(
      'SELECT profile_type FROM users WHERE id = $1',
      [userId]
    );
    const profileType: string = userResult.rows[0]?.profile_type ?? 'unknown';

    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (category) {
      conditions.push(`category = $${idx++}`);
      values.push(category);
    }

    if (difficulty) {
      conditions.push(`difficulty = $${idx++}`);
      values.push(difficulty);
    }

    // Filter by target_profiles — include scenarios targeting this profile or all profiles
    if (profileType !== 'unknown') {
      conditions.push(
        `(target_profiles = '{}' OR $${idx} = ANY(target_profiles))`
      );
      values.push(profileType);
      idx++;
    }

    // Exclude already-completed scenarios
    if (exclude_completed === 'true') {
      conditions.push(
        `id NOT IN (SELECT scenario_id FROM scenario_results WHERE user_id = $${idx++} AND scenario_id IS NOT NULL)`
      );
      values.push(userId);
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    values.push(parsedLimit);

    const result = await pool.query(
      `SELECT id, title, body, options, correct_signal_state, category,
              difficulty, target_dimensions, target_profiles, created_at
       FROM scenarios
       ${where}
       ORDER BY created_at DESC
       LIMIT $${idx}`,
      values
    );

    res.json({ scenarios: result.rows });
  } catch (err) {
    console.error('[scenarios/get]', err);
    res.status(500).json({ error: 'Failed to fetch scenarios.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/scenarios/:id
// ─────────────────────────────────────────────

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, title, body, options, correct_signal_state, category,
              difficulty, target_dimensions, target_profiles, created_at
       FROM scenarios WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Scenario not found.' });
      return;
    }

    res.json({ scenario: result.rows[0] });
  } catch (err) {
    console.error('[scenarios/getOne]', err);
    res.status(500).json({ error: 'Failed to fetch scenario.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/scenarios/:id/result
// ─────────────────────────────────────────────

router.post('/:id/result', async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { id: scenarioId } = req.params;
  const { selected_option, was_correct } = req.body as {
    selected_option?: number;
    was_correct?: boolean;
  };

  if (selected_option === undefined || was_correct === undefined) {
    res.status(400).json({ error: 'selected_option and was_correct are required.' });
    return;
  }

  try {
    // Increment usage counter atomically
    await pool.query(
      `UPDATE users
       SET scenarios_used_week = scenarios_used_week + 1
       WHERE id = $1`,
      [userId]
    );

    // Record the result
    const result = await pool.query(
      `INSERT INTO scenario_results (user_id, scenario_id, selected_option, was_correct)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, scenario_id, selected_option, was_correct, created_at`,
      [userId, scenarioId, selected_option, was_correct]
    );

    res.status(201).json({ result: result.rows[0] });
  } catch (err) {
    console.error('[scenarios/result]', err);
    res.status(500).json({ error: 'Failed to save result.' });
  }
});

export default router;

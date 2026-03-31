import { Router, Response } from 'express';
import pool from '../db/pool';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { analysisLimiter } from '../middleware/rateLimit';
import { analyzeWithOpenAI } from '../services/openai-analyzer';

const router = Router();

router.use(requireAuth);

// ─────────────────────────────────────────────
// POST /api/analyze
// ─────────────────────────────────────────────

router.post('/', analysisLimiter, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { input_text } = req.body as { input_text?: string };

  if (!input_text?.trim()) {
    res.status(400).json({ error: 'input_text is required.' });
    return;
  }

  if (input_text.trim().length < 10) {
    res.status(400).json({ error: 'Please describe the situation in more detail.' });
    return;
  }

  try {
    // Fetch user profile for context
    const userResult = await pool.query(
      `SELECT u.profile_type, u.quiz_profile_id,
              qp.signal_score, qp.readiness_score, qp.strategy_score, qp.weak_questions
       FROM users u
       LEFT JOIN quiz_profiles qp ON qp.id = u.quiz_profile_id
       WHERE u.id = $1`,
      [userId]
    );

    const userData = userResult.rows[0];
    if (!userData) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const weakQuestions: Array<{ question_text: string }> =
      userData.weak_questions ?? [];
    const blindSpots = weakQuestions.map((q) => q.question_text);

    // Call OpenAI
    const analysisResult = await analyzeWithOpenAI({
      input_text: input_text.trim(),
      profile_type: userData.profile_type ?? 'unknown',
      signal_score: userData.signal_score ?? 5,
      readiness_score: userData.readiness_score ?? 5,
      strategy_score: userData.strategy_score ?? 5,
      blind_spots: blindSpots,
    });

    // Increment usage counter atomically
    await pool.query(
      `UPDATE users
       SET analyses_used_week = analyses_used_week + 1
       WHERE id = $1`,
      [userId]
    );

    // Persist the analysis
    const insertResult = await pool.query(
      `INSERT INTO analyses (user_id, input_text, signal_state, ai_response)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, input_text, signal_state, ai_response, created_at`,
      [userId, input_text.trim(), analysisResult.signal_state, analysisResult]
    );

    res.json({ analysis: insertResult.rows[0] });
  } catch (err) {
    console.error('[analysis/post]', err);
    const errMsg = err instanceof Error ? err.message : String(err);
    res.status(502).json({ error: 'Analysis failed. Please try again.', debug: errMsg });
  }
});

// ─────────────────────────────────────────────
// GET /api/analyze/history
// ─────────────────────────────────────────────

router.get('/history', async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { limit = '20', offset = '0' } = req.query as {
    limit?: string;
    offset?: string;
  };

  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const parsedOffset = Math.max(parseInt(offset, 10) || 0, 0);

  try {
    const result = await pool.query(
      `SELECT id, input_text, signal_state, ai_response, created_at
       FROM analyses
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, parsedLimit, parsedOffset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM analyses WHERE user_id = $1',
      [userId]
    );

    res.json({
      analyses: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
    });
  } catch (err) {
    console.error('[analysis/history]', err);
    res.status(500).json({ error: 'Failed to fetch analysis history.' });
  }
});

export default router;

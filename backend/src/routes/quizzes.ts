import { Router, Request, Response } from 'express';
import { pool } from '../db/pool';
import { requireAuth } from '../middleware/auth';

const router = Router();

// POST /api/quizzes/complete — save quiz result
router.post('/complete', requireAuth, async (req: Request, res: Response) => {
  const { level, score, total, answers } = req.body;
  const userId = (req as any).user.userId;

  if (!level || score === undefined || !total) {
    return res.status(400).json({ error: 'level, score, and total are required' });
  }
  if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
    return res.status(400).json({ error: 'Invalid level' });
  }
  if (typeof score !== 'number' || typeof total !== 'number') {
    return res.status(400).json({ error: 'score and total must be numbers' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO quiz_results (user_id, level, score, total, answers)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, level, score, total, completed_at`,
      [userId, level, score, total, JSON.stringify(answers || [])]
    );
    return res.json({ result: result.rows[0] });
  } catch (err) {
    console.error('Quiz complete error:', err);
    return res.status(500).json({ error: 'Failed to save quiz result' });
  }
});

// GET /api/quizzes/history — get user's quiz history
router.get('/history', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const result = await pool.query(
      `SELECT id, level, score, total, completed_at
       FROM quiz_results
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT 50`,
      [userId]
    );

    // Build best-score-per-level summary
    const bestByLevel: Record<string, any> = {};
    for (const row of result.rows) {
      const existing = bestByLevel[row.level];
      if (!existing || row.score > existing.score) {
        bestByLevel[row.level] = row;
      }
    }

    return res.json({
      history: result.rows,
      best: bestByLevel
    });
  } catch (err) {
    console.error('Quiz history error:', err);
    return res.status(500).json({ error: 'Failed to fetch quiz history' });
  }
});

// GET /api/quizzes/best — shorthand for best scores per level
router.get('/best', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (level)
         level, score, total, completed_at
       FROM quiz_results
       WHERE user_id = $1
       ORDER BY level, score DESC`,
      [userId]
    );

    const best: Record<string, any> = {};
    for (const row of result.rows) {
      best[row.level] = row;
    }

    return res.json({ best });
  } catch (err) {
    console.error('Quiz best error:', err);
    return res.status(500).json({ error: 'Failed to fetch best scores' });
  }
});

export default router;

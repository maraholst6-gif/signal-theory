import { Router, Response } from 'express';
import pool from '../db/pool';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { analysisLimiter } from '../middleware/rateLimit';
import { analyzeWithClaude } from '../services/claude';
import { sendEmail, isEmailConfigured } from '../services/emailService';

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

    // Call Claude
    const analysisResult = await analyzeWithClaude({
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

// ─────────────────────────────────────────────
// POST /api/analyze/:id/email
// ─────────────────────────────────────────────

router.post('/:id/email', async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const analysisId = req.params.id;

  try {
    // Check premium
    const userResult = await pool.query(
      'SELECT email, display_name, tier FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    if (user.tier !== 'premium') {
      res.status(403).json({ error: 'Premium required.', code: 'PREMIUM_REQUIRED' });
      return;
    }

    // Fetch analysis (must belong to this user)
    const analysisResult = await pool.query(
      'SELECT id, input_text, signal_state, ai_response, created_at FROM analyses WHERE id = $1 AND user_id = $2',
      [analysisId, userId]
    );
    if (analysisResult.rows.length === 0) {
      res.status(404).json({ error: 'Analysis not found.' });
      return;
    }

    if (!isEmailConfigured()) {
      res.status(503).json({ error: 'Email service is not configured.' });
      return;
    }

    const analysis = analysisResult.rows[0];
    const ai = analysis.ai_response || {};
    const state = (ai.signal_state || analysis.signal_state || 'UNKNOWN').toUpperCase();
    const createdAt = new Date(analysis.created_at).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const stateColors: Record<string, string> = {
      INTEREST: '#22c55e', UNCERTAINTY: '#eab308', COMFORT: '#3b82f6', DISENGAGEMENT: '#ef4444'
    };
    const stateColor = stateColors[state] || '#FF6B35';

    const section = (label: string, content: string, borderColor?: string) => {
      if (!content) return '';
      const border = borderColor ? `border-left:3px solid ${borderColor};padding-left:14px;` : '';
      return `<tr><td style="padding:12px 0;">
        <p style="font-weight:700;color:#FF6B35;margin:0 0 6px 0;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">${label}</p>
        <p style="margin:0;color:#e5e7eb;line-height:1.6;${border}">${content}</p>
      </td></tr>`;
    };

    const htmlBody = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#1a1a1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a">
<tr><td align="center" style="padding:24px 16px">
<table width="100%" style="max-width:580px;background:#242424;border-radius:12px;overflow:hidden">
  <tr><td style="background:#FF6B35;padding:20px 24px">
    <p style="margin:0;color:#fff;font-size:18px;font-weight:700">Signal Theory</p>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px">Your Signal Analysis — ${createdAt}</p>
  </td></tr>
  <tr><td style="padding:24px">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:0 0 20px">
        <p style="font-size:28px;font-weight:700;color:${stateColor};margin:0">${state}</p>
      </td></tr>
      <tr><td style="padding:0 0 16px;border-bottom:1px solid #333">
        <p style="font-weight:700;color:#999;margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:1px">YOUR SITUATION</p>
        <p style="margin:0;color:#ccc;line-height:1.5;font-style:italic">${analysis.input_text}</p>
      </td></tr>
      ${section('The Signal', ai.the_signal || ai.what_i_see || '')}
      ${section('The Story You\'re Telling Yourself', ai.the_story || '', '#FF6B35')}
      ${section('What\'s Actually Happening', ai.whats_happening || ai.what_it_means || '')}
      ${section('Your Move', ai.your_move || '')}
      ${section('Your Blind Spot', ai.blind_spot || ai.watch_for || '', '#ef4444')}
    </table>
  </td></tr>
  <tr><td style="padding:16px 24px;background:#1a1a1a;border-top:1px solid #333">
    <p style="margin:0;color:#666;font-size:12px;text-align:center">
      Signal Theory — Signals over stories. Calibration over technique.<br>
      <a href="https://learnsignaltheory.com/app/" style="color:#FF6B35;text-decoration:none">Open App</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`;

    const textBody = `SIGNAL THEORY — Your Analysis (${createdAt})

Signal State: ${state}

Your Situation: ${analysis.input_text}

The Signal: ${ai.the_signal || ai.what_i_see || ''}

${ai.the_story ? `The Story You're Telling Yourself: ${ai.the_story}\n` : ''}
What's Actually Happening: ${ai.whats_happening || ai.what_it_means || ''}

Your Move: ${ai.your_move || ''}

${ai.blind_spot ? `Your Blind Spot: ${ai.blind_spot}\n` : ''}
---
Signal Theory — learnsignaltheory.com`;

    await sendEmail({
      toEmail: user.email,
      toName: user.display_name || undefined,
      subject: `Your Signal Read: ${state}`,
      htmlBody,
      textBody,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('[analysis/email]', err);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
});

export default router;

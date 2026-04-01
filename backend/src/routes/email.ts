/**
 * routes/email.ts
 *
 * POST /api/email/subscribe  — add subscriber, send Email 1, schedule 2 & 3
 * GET  /unsubscribe/:token   — handle unsubscribe
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import pool from '../db/pool';
import { sendEmail, isEmailConfigured } from '../services/emailService';
import { getTemplate, SubscriberData } from '../templates/emails';
import { generalLimiter } from '../middleware/rateLimit';

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─────────────────────────────────────────────
// POST /api/email/subscribe
// ─────────────────────────────────────────────

router.post('/subscribe', generalLimiter, async (req: Request, res: Response) => {
  try {
    const { email, firstName, quizProfile, source } = req.body as {
      email?:       string;
      firstName?:   string;
      quizProfile?: string;
      source?:      string;
    };

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const cleaned = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleaned)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Upsert subscriber (idempotent — re-subscribing is fine)
    const token = crypto.randomBytes(32).toString('hex');

    const upsert = await pool.query<{ id: number; unsubscribe_token: string; unsubscribed_at: Date | null }>(
      `INSERT INTO email_subscribers (email, first_name, quiz_profile, source, unsubscribe_token)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE
         SET first_name    = COALESCE(EXCLUDED.first_name, email_subscribers.first_name),
             quiz_profile  = COALESCE(EXCLUDED.quiz_profile, email_subscribers.quiz_profile),
             unsubscribed_at = NULL
       RETURNING id, unsubscribe_token, unsubscribed_at`,
      [cleaned, firstName ?? null, quizProfile ?? null, source ?? 'quiz', token]
    );

    const subscriber = upsert.rows[0];

    const subData: SubscriberData = {
      email:            cleaned,
      firstName:        firstName,
      quizProfile:      quizProfile,
      unsubscribeToken: subscriber.unsubscribe_token,
    };

    // Send Email 1 immediately (best-effort; don't fail the whole request if Graph isn't configured yet)
    if (isEmailConfigured()) {
      const tmpl = await getTemplate('immediate', subData);
      if (tmpl) {
        try {
          await sendEmail({ toEmail: cleaned, toName: firstName, ...tmpl });
          await logQueued(subscriber.id, 'immediate', new Date(), 'sent');
        } catch (err) {
          console.error('[email] Failed to send immediate email:', err);
          await logQueued(subscriber.id, 'immediate', new Date(), 'failed', String(err));
        }
      }
    } else {
      console.warn('[email] Graph API not configured — immediate email skipped. Will queue for later.');
      await enqueue(subscriber.id, 'immediate', new Date());
    }

    // Schedule Email 2 (+2 days) and Email 3 (+4 days)
    const now = Date.now();
    await enqueue(subscriber.id, 'followup_2d', new Date(now + 2 * 24 * 60 * 60 * 1000));
    await enqueue(subscriber.id, 'followup_4d', new Date(now + 4 * 24 * 60 * 60 * 1000));

    return res.json({ success: true });

  } catch (err) {
    console.error('[email] Subscribe error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────
// GET /unsubscribe/:token
// ─────────────────────────────────────────────

router.get('/unsubscribe/:token', async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token || token.length < 32) {
    return res.status(400).send('Invalid unsubscribe link.');
  }

  try {
    const result = await pool.query(
      `UPDATE email_subscribers
       SET unsubscribed_at = NOW()
       WHERE unsubscribe_token = $1 AND unsubscribed_at IS NULL
       RETURNING email`,
      [token]
    );

    // Cancel any pending queued emails
    if (result.rowCount && result.rowCount > 0) {
      await pool.query(
        `UPDATE email_queue eq
         SET status = 'cancelled'
         FROM email_subscribers es
         WHERE eq.subscriber_id = es.id
           AND es.unsubscribe_token = $1
           AND eq.status = 'pending'`,
        [token]
      );
    }

    // Simple HTML confirmation — replace with a real page if desired
    res.send(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Unsubscribed</title>
<style>body{font-family:Georgia,serif;background:#f9f6f1;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.box{background:#fff;border-radius:8px;padding:48px;max-width:480px;text-align:center}
h1{color:#2c2c2c;margin:0 0 16px}p{color:#666;line-height:1.6}</style>
</head>
<body>
<div class="box">
  <h1>You've been unsubscribed.</h1>
  <p>You won't receive any more emails from Signal Theory.</p>
</div>
</body>
</html>`);

  } catch (err) {
    console.error('[email] Unsubscribe error:', err);
    res.status(500).send('Something went wrong. Please try again.');
  }
});

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

async function enqueue(subscriberId: number, templateName: string, scheduledFor: Date): Promise<void> {
  await pool.query(
    `INSERT INTO email_queue (subscriber_id, template_name, scheduled_for)
     VALUES ($1, $2, $3)
     ON CONFLICT DO NOTHING`,
    [subscriberId, templateName, scheduledFor]
  );
}

async function logQueued(
  subscriberId: number,
  templateName: string,
  sentAt: Date,
  status: 'sent' | 'failed',
  errorMessage?: string
): Promise<void> {
  await pool.query(
    `INSERT INTO email_log (subscriber_id, email, template_name, status, error_message, sent_at)
     SELECT $1, email, $2, $3, $4, $5 FROM email_subscribers WHERE id = $1`,
    [subscriberId, templateName, status, errorMessage ?? null, sentAt]
  );
}

export default router;

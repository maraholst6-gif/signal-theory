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

    // Insert new subscriber, or do nothing if email already exists
    const token = crypto.randomBytes(32).toString('hex');

    const upsert = await pool.query<{ id: number; unsubscribe_token: string; unsubscribed_at: Date | null; is_new: boolean }>(
      `INSERT INTO email_subscribers (email, first_name, quiz_profile, source, unsubscribe_token)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE
         SET first_name    = COALESCE(EXCLUDED.first_name, email_subscribers.first_name),
             quiz_profile  = COALESCE(EXCLUDED.quiz_profile, email_subscribers.quiz_profile),
             unsubscribed_at = NULL
       RETURNING id, unsubscribe_token, unsubscribed_at, (xmax = 0) AS is_new`,
      [cleaned, firstName ?? null, quizProfile ?? null, source ?? 'quiz', token]
    );

    const subscriber = upsert.rows[0];
    const isNewSubscriber = subscriber.is_new;

    const subData: SubscriberData = {
      email:            cleaned,
      firstName:        firstName,
      quizProfile:      quizProfile,
      unsubscribeToken: subscriber.unsubscribe_token,
    };

    // Only queue emails if this is a new subscriber (prevents duplicate sequences for repeat quiz takers)
    if (isNewSubscriber) {
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

      // Schedule follow-up emails
      const now = Date.now();
      const day = 24 * 60 * 60 * 1000;
      await enqueue(subscriber.id, 'followup_2d',  new Date(now +  2 * day));
      await enqueue(subscriber.id, 'followup_4d',  new Date(now +  4 * day));
      await enqueue(subscriber.id, 'followup_7d',  new Date(now +  7 * day));
      await enqueue(subscriber.id, 'followup_10d', new Date(now + 10 * day));
      await enqueue(subscriber.id, 'followup_14d', new Date(now + 14 * day));
      await enqueue(subscriber.id, 'followup_21d', new Date(now + 21 * day));
    }

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

    res.send(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Unsubscribed</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:Georgia,serif;background:#f9f6f1;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.box{background:#fff;border-radius:12px;padding:48px;max-width:480px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.08)}
h1{color:#2c2c2c;margin:0 0 16px;font-size:24px}p{color:#666;line-height:1.6;margin:0 0 12px}
a.resub{display:inline-block;margin-top:20px;padding:12px 28px;background:#FF6B35;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px}
a.resub:hover{background:#e55a28}</style>
</head>
<body>
<div class="box">
  <h1>We're sorry to see you go.</h1>
  <p>You've been unsubscribed and won't receive any more emails from Signal Theory.</p>
  <p>You're welcome back whenever you're ready.</p>
  <p style="margin-top:24px;font-size:14px;color:#999">If this was a mistake:</p>
  <a class="resub" href="/api/email/resubscribe/${token}">Re-subscribe</a>
</div>
</body>
</html>`);

  } catch (err) {
    console.error('[email] Unsubscribe error:', err);
    res.status(500).send('Something went wrong. Please try again.');
  }
});

// ─────────────────────────────────────────────
// GET /resubscribe/:token
// ─────────────────────────────────────────────

router.get('/resubscribe/:token', async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token || token.length < 32) {
    return res.status(400).send('Invalid link.');
  }

  try {
    const result = await pool.query(
      `UPDATE email_subscribers
       SET unsubscribed_at = NULL
       WHERE unsubscribe_token = $1 AND unsubscribed_at IS NOT NULL
       RETURNING email`,
      [token]
    );

    const resubscribed = result.rowCount && result.rowCount > 0;

    res.send(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Re-subscribed</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:Georgia,serif;background:#f9f6f1;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
.box{background:#fff;border-radius:12px;padding:48px;max-width:480px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.08)}
h1{color:#2c2c2c;margin:0 0 16px;font-size:24px}p{color:#666;line-height:1.6}</style>
</head>
<body>
<div class="box">
  ${resubscribed
    ? '<h1>Welcome back! 🎉</h1><p>You\'ve been re-subscribed to Signal Theory emails.</p>'
    : '<h1>You\'re already subscribed.</h1><p>No changes needed — you\'ll continue receiving emails from Signal Theory.</p>'}
</div>
</body>
</html>`);

  } catch (err) {
    console.error('[email] Resubscribe error:', err);
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

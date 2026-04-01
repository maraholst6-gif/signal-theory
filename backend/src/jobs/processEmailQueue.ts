/**
 * jobs/processEmailQueue.ts
 *
 * Processes pending emails from email_queue and sends them via Microsoft Graph.
 * Run as a Render cron job every 15 minutes:
 *   node dist/jobs/processEmailQueue.js
 *
 * Also exported as `processQueue()` for direct invocation.
 */

import dotenv from 'dotenv';
dotenv.config();

import pool from '../db/pool';
import { sendEmail, isEmailConfigured } from '../services/emailService';
import { getTemplate, SubscriberData } from '../templates/emails';

const MAX_ATTEMPTS = 3;

interface QueueRow {
  id:                number;
  subscriber_id:     number;
  template_name:     string;
  email:             string;
  first_name:        string | null;
  quiz_profile:      string | null;
  unsubscribe_token: string;
  attempts:          number;
}

export async function processQueue(): Promise<void> {
  if (!isEmailConfigured()) {
    console.warn('[queue] Microsoft Graph not configured — skipping. Set MICROSOFT_TENANT_ID, CLIENT_ID, CLIENT_SECRET, EMAIL_FROM.');
    return;
  }

  // Fetch pending emails due now, excluding subscribers who unsubscribed
  const { rows } = await pool.query<QueueRow>(
    `SELECT eq.id, eq.subscriber_id, eq.template_name, eq.attempts,
            es.email, es.first_name, es.quiz_profile, es.unsubscribe_token
     FROM email_queue eq
     JOIN email_subscribers es ON es.id = eq.subscriber_id
     WHERE eq.status    = 'pending'
       AND eq.scheduled_for <= NOW()
       AND eq.attempts  < $1
       AND es.unsubscribed_at IS NULL
     ORDER BY eq.scheduled_for ASC
     LIMIT 50`,
    [MAX_ATTEMPTS]
  );

  if (rows.length === 0) {
    console.log('[queue] No pending emails.');
    return;
  }

  console.log(`[queue] Processing ${rows.length} email(s)...`);

  for (const row of rows) {
    const subData: SubscriberData = {
      email:            row.email,
      firstName:        row.first_name ?? undefined,
      quizProfile:      row.quiz_profile ?? undefined,
      unsubscribeToken: row.unsubscribe_token,
    };

    const tmpl = await getTemplate(row.template_name, subData);

    if (!tmpl) {
      console.error(`[queue] Unknown template: ${row.template_name} — marking failed`);
      await markFailed(row.id, row.subscriber_id, row.email, row.template_name, 'Unknown template name');
      continue;
    }

    // Mark attempt in progress
    await pool.query(
      `UPDATE email_queue SET attempts = attempts + 1, last_attempted_at = NOW() WHERE id = $1`,
      [row.id]
    );

    try {
      await sendEmail({
        toEmail:  row.email,
        toName:   row.first_name ?? undefined,
        subject:  tmpl.subject,
        htmlBody: tmpl.htmlBody,
        textBody: tmpl.textBody,
      });

      await pool.query(
        `UPDATE email_queue SET status = 'sent' WHERE id = $1`,
        [row.id]
      );

      await pool.query(
        `INSERT INTO email_log (queue_id, subscriber_id, email, template_name, status, sent_at)
         VALUES ($1, $2, $3, $4, 'sent', NOW())`,
        [row.id, row.subscriber_id, row.email, row.template_name]
      );

      console.log(`[queue] Sent "${row.template_name}" to ${row.email}`);

    } catch (err) {
      const msg = String(err);
      console.error(`[queue] Failed to send "${row.template_name}" to ${row.email}:`, msg);

      const newAttempts = row.attempts + 1;

      if (newAttempts >= MAX_ATTEMPTS) {
        await markFailed(row.id, row.subscriber_id, row.email, row.template_name, msg);
      } else {
        await pool.query(
          `UPDATE email_queue SET error_message = $1 WHERE id = $2`,
          [msg, row.id]
        );
        console.log(`[queue] Will retry (attempt ${newAttempts}/${MAX_ATTEMPTS})`);
      }
    }
  }

  console.log('[queue] Done.');
}

async function markFailed(
  queueId: number,
  subscriberId: number,
  email: string,
  templateName: string,
  errorMessage: string
): Promise<void> {
  await pool.query(
    `UPDATE email_queue SET status = 'failed', error_message = $1 WHERE id = $2`,
    [errorMessage, queueId]
  );
  await pool.query(
    `INSERT INTO email_log (queue_id, subscriber_id, email, template_name, status, error_message, sent_at)
     VALUES ($1, $2, $3, $4, 'failed', $5, NOW())`,
    [queueId, subscriberId, email, templateName, errorMessage]
  );
}

// ─────────────────────────────────────────────
// Direct execution (Render cron: node dist/jobs/processEmailQueue.js)
// ─────────────────────────────────────────────

if (require.main === module) {
  processQueue()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[queue] Fatal error:', err);
      process.exit(1);
    });
}

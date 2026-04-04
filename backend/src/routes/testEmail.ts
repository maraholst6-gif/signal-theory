/**
 * routes/testEmail.ts
 *
 * TEST ENDPOINT: Send any email template immediately for testing
 * GET /api/email/test/:template
 */

import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { sendEmail, isEmailConfigured } from '../services/emailService';
import { getTemplate, SubscriberData } from '../templates/emails';

const router = Router();

router.get('/test/:template', async (req: Request, res: Response) => {
  try {
    const { template } = req.params;
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Query param ?email=... required' });
    }

    if (!isEmailConfigured()) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Valid templates
    const validTemplates = [
      'immediate',
      'followup_2d',
      'followup_4d',
      'followup_7d',
      'followup_10d',
      'followup_14d',
      'followup_21d'
    ];

    if (!validTemplates.includes(template)) {
      return res.status(400).json({ error: `Invalid template. Valid: ${validTemplates.join(', ')}` });
    }

    // Fetch subscriber data from database
    const result = await pool.query(
      'SELECT email, first_name, quiz_profile, unsubscribe_token FROM email_subscribers WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found in subscribers. Sign up first.' });
    }

    const row = result.rows[0];
    const subData: SubscriberData = {
      email: row.email,
      firstName: row.first_name,
      quizProfile: row.quiz_profile,
      unsubscribeToken: row.unsubscribe_token
    };

    // Get template
    const tmpl = await getTemplate(template, subData);
    if (!tmpl) {
      return res.status(500).json({ error: 'Failed to generate template' });
    }

    // Send email
    await sendEmail({
      toEmail: row.email,
      toName: row.first_name || '',
      subject: tmpl.subject,
      htmlBody: tmpl.htmlBody,
      textBody: tmpl.textBody
    });

    return res.json({
      success: true,
      message: `Sent ${template} to ${row.email}`,
      profile: row.quiz_profile || 'none'
    });

  } catch (err) {
    console.error('[testEmail] Error:', err);
    return res.status(500).json({ error: 'Internal server error', details: String(err) });
  }
});

export default router;

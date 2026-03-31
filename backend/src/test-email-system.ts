/**
 * test-email-system.ts
 *
 * Validates the email system configuration without sending real emails.
 * Run after Azure setup:
 *   npx ts-node src/test-email-system.ts
 *
 * Or after building:
 *   node dist/test-email-system.js
 */

import dotenv from 'dotenv';
dotenv.config();

import pool from './db/pool';
import { isEmailConfigured } from './services/emailService';
import { getTemplate } from './templates/emails';

const PASS = '✓';
const FAIL = '✗';

let passed = 0;
let failed = 0;

function check(label: string, condition: boolean, detail?: string): void {
  if (condition) {
    console.log(`  ${PASS} ${label}`);
    passed++;
  } else {
    console.error(`  ${FAIL} ${label}${detail ? ': ' + detail : ''}`);
    failed++;
  }
}

async function run(): Promise<void> {
  console.log('\n=== Signal Theory Email System — Validation ===\n');

  // 1. Env vars
  console.log('1. Environment variables');
  check('DATABASE_URL',             Boolean(process.env.DATABASE_URL));
  check('EMAIL_FROM',               Boolean(process.env.EMAIL_FROM));
  check('MICROSOFT_TENANT_ID',      Boolean(process.env.MICROSOFT_TENANT_ID));
  check('MICROSOFT_CLIENT_ID',      Boolean(process.env.MICROSOFT_CLIENT_ID));
  check('MICROSOFT_CLIENT_SECRET',  Boolean(process.env.MICROSOFT_CLIENT_SECRET));
  check('APP_BASE_URL (optional)',  true,  process.env.APP_BASE_URL ?? '(not set — will use default)');
  console.log('');

  // 2. Templates compile correctly
  console.log('2. Email templates');
  const sub = {
    email:            'test@example.com',
    firstName:        'Test',
    quizProfile:      'The Avoidant',
    unsubscribeToken: 'abc123',
  };
  for (const name of ['immediate', 'followup_2d', 'followup_4d']) {
    const tmpl = getTemplate(name, sub);
    check(`Template "${name}" renders`, Boolean(tmpl && tmpl.subject && tmpl.htmlBody && tmpl.textBody));
  }
  check('Unknown template returns null', getTemplate('not_a_template', sub) === null);
  console.log('');

  // 3. Graph API configured
  console.log('3. Microsoft Graph');
  check('isEmailConfigured()', isEmailConfigured(),
    isEmailConfigured() ? '' : 'Missing one or more MICROSOFT_* env vars or EMAIL_FROM');
  console.log('');

  // 4. Database connectivity
  console.log('4. Database');
  try {
    await pool.query('SELECT 1');
    check('Connection OK', true);

    // Check tables exist
    for (const table of ['email_subscribers', 'email_queue', 'email_log']) {
      const result = await pool.query(
        `SELECT EXISTS (
           SELECT FROM information_schema.tables
           WHERE table_schema = 'public' AND table_name = $1
         )`,
        [table]
      );
      check(`Table "${table}" exists`, result.rows[0].exists === true,
        result.rows[0].exists ? '' : 'Run migration 004_email_system.sql');
    }
  } catch (err) {
    check('Connection OK', false, String(err));
  }
  console.log('');

  // 5. Graph API live test (optional, requires real credentials)
  if (isEmailConfigured() && process.env.TEST_SEND_TO) {
    console.log('5. Live send test (TEST_SEND_TO is set)');
    const { sendEmail } = await import('./services/emailService');
    const tmpl = getTemplate('immediate', sub)!;
    try {
      await sendEmail({
        toEmail:  process.env.TEST_SEND_TO,
        toName:   'Test',
        subject:  '[TEST] ' + tmpl.subject,
        htmlBody: tmpl.htmlBody,
        textBody: tmpl.textBody,
      });
      check(`Sent to ${process.env.TEST_SEND_TO}`, true);
    } catch (err) {
      check(`Send to ${process.env.TEST_SEND_TO}`, false, String(err));
    }
    console.log('');
  }

  // Summary
  console.log(`=== Results: ${passed} passed, ${failed} failed ===\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

run()
  .catch((err) => {
    console.error('Unexpected error:', err);
    process.exit(1);
  })
  .finally(() => pool.end());

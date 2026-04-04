#!/usr/bin/env node
/**
 * Test script: Verify Signal Theory email queue end-to-end
 * 
 * This script:
 * 1. Creates a test subscriber (or uses existing test account)
 * 2. Inserts follow-up emails scheduled to send NOW
 * 3. Runs the queue processor
 * 4. Verifies emails were sent and marked correctly
 * 
 * Usage:
 *   node test-email-queue.js --email your-test-email@gmail.com --profile "anxious-attacher"
 */

const pool = require('./backend/dist/db/pool').default;
const { processQueue } = require('./backend/dist/jobs/processEmailQueue');

async function runTest() {
  const args = process.argv.slice(2);
  const emailIndex = args.indexOf('--email');
  const profileIndex = args.indexOf('--profile');
  
  const testEmail = emailIndex >= 0 ? args[emailIndex + 1] : 'jeff-test@example.com';
  const testProfile = profileIndex >= 0 ? args[profileIndex + 1] : 'anxious-attacher';
  
  console.log('━━━ Signal Theory Email Queue Test ━━━\n');
  console.log(`Test email: ${testEmail}`);
  console.log(`Profile type: ${testProfile}\n`);
  
  try {
    // Step 1: Create or find test subscriber
    console.log('Step 1: Creating test subscriber...');
    const crypto = require('crypto');
    const unsubToken = crypto.randomBytes(16).toString('hex');
    const insertSub = await pool.query(
      `INSERT INTO email_subscribers (email, first_name, quiz_profile, source, unsubscribe_token)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET quiz_profile = $3
       RETURNING id, email, quiz_profile, unsubscribe_token`,
      [testEmail, 'Test', testProfile, 'test-script', unsubToken]
    );
    const subscriber = insertSub.rows[0];
    console.log(`✓ Subscriber ready: ID ${subscriber.id}\n`);
    
    // Step 2: Clear any existing queue entries for this subscriber
    console.log('Step 2: Clearing old queue entries...');
    await pool.query('DELETE FROM email_queue WHERE subscriber_id = $1', [subscriber.id]);
    console.log('✓ Queue cleared\n');
    
    // Step 3: Insert test emails scheduled for NOW (not future)
    console.log('Step 3: Inserting test emails scheduled NOW...');
    const templates = ['followup_2d', 'followup_4d'];
    for (const template of templates) {
      await pool.query(
        `INSERT INTO email_queue (subscriber_id, template_name, scheduled_for, status)
         VALUES ($1, $2, NOW(), 'pending')`,
        [subscriber.id, template]
      );
    }
    console.log(`✓ Inserted ${templates.length} test emails\n`);
    
    // Step 4: Check queue before processing
    console.log('Step 4: Verifying queue entries...');
    const beforeQueue = await pool.query(
      `SELECT id, template_name, status, scheduled_for 
       FROM email_queue 
       WHERE subscriber_id = $1 
       ORDER BY scheduled_for`,
      [subscriber.id]
    );
    console.log('Queue entries:');
    beforeQueue.rows.forEach(row => {
      console.log(`  - ${row.template_name}: ${row.status} (scheduled: ${row.scheduled_for})`);
    });
    console.log();
    
    // Step 5: Run the queue processor
    console.log('Step 5: Running queue processor...');
    console.log('────────────────────────────────────');
    await processQueue(false); // false = live send, not dry-run
    console.log('────────────────────────────────────\n');
    
    // Step 6: Check queue after processing
    console.log('Step 6: Checking results...');
    const afterQueue = await pool.query(
      `SELECT id, template_name, status, attempts 
       FROM email_queue 
       WHERE subscriber_id = $1 
       ORDER BY scheduled_for`,
      [subscriber.id]
    );
    
    console.log('\nFinal queue status:');
    afterQueue.rows.forEach(row => {
      const status = row.status === 'sent' ? '✓' : '✗';
      console.log(`  ${status} ${row.template_name}: ${row.status} (attempts: ${row.attempts})`);
    });
    
    // Step 7: Check email logs
    const logs = await pool.query(
      `SELECT template_name, error, created_at 
       FROM email_logs 
       WHERE subscriber_id = $1 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [subscriber.id]
    );
    
    if (logs.rows.length > 0) {
      console.log('\nEmail logs:');
      logs.rows.forEach(log => {
        if (log.error) {
          console.log(`  ✗ ${log.template_name}: FAILED - ${log.error}`);
        } else {
          console.log(`  ✓ ${log.template_name}: sent at ${log.created_at}`);
        }
      });
    }
    
    // Summary
    const sentCount = afterQueue.rows.filter(r => r.status === 'sent').length;
    const failedCount = afterQueue.rows.filter(r => r.status === 'failed').length;
    
    console.log('\n━━━ Test Summary ━━━');
    console.log(`Emails sent: ${sentCount}/${templates.length}`);
    console.log(`Emails failed: ${failedCount}/${templates.length}`);
    
    if (sentCount === templates.length) {
      console.log('\n✓ All emails sent successfully!');
      console.log(`Check ${testEmail} for the messages.`);
    } else if (failedCount > 0) {
      console.log('\n✗ Some emails failed. Check logs above for errors.');
    } else {
      console.log('\n⚠ Emails still pending. Queue processor may need debugging.');
    }
    
  } catch (error) {
    console.error('\n✗ Test failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTest();

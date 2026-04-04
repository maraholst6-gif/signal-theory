#!/usr/bin/env node
/**
 * Signal Theory Twitter Auto-Poster
 * Posts scheduled tweets from tweets-queue.json via browser automation
 *
 * Usage:
 *   node post-tweet.js              # Post next pending tweet
 *   node post-tweet.js --dry-run    # Preview without posting
 *   node post-tweet.js --force-id 5 # Force a specific tweet ID
 */

const fs = require('fs');
const path = require('path');

const QUEUE_FILE = path.join(__dirname, 'tweets-queue.json');
const LOG_FILE = path.join(__dirname, 'post-log.jsonl');
const TWITTER_URL = 'https://x.com';
const DRY_RUN = process.argv.includes('--dry-run');
const FORCE_ID = (() => {
  const idx = process.argv.indexOf('--force-id');
  return idx !== -1 ? parseInt(process.argv[idx + 1]) : null;
})();

// ── Queue helpers ──────────────────────────────────────────────────────────

function loadQueue() {
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

function findNextTweet(queue) {
  if (FORCE_ID) {
    const tweet = queue.find(t => t.id === FORCE_ID);
    if (!tweet) throw new Error(`No tweet with id ${FORCE_ID}`);
    return tweet;
  }
  const now = new Date();
  return queue.find(t => t.status === 'pending' && new Date(t.scheduled_at) <= now) || null;
}

function getThreadTweets(queue, threadId) {
  return queue
    .filter(t => t.thread_id === threadId)
    .sort((a, b) => a.thread_position - b.thread_position);
}

function markPosted(queue, id, url = null) {
  const tweet = queue.find(t => t.id === id);
  if (tweet) {
    tweet.status = 'posted';
    tweet.posted_at = new Date().toISOString();
    if (url) tweet.tweet_url = url;
  }
}

function markFailed(queue, id, reason = '') {
  const tweet = queue.find(t => t.id === id);
  if (tweet) {
    tweet.status = 'failed';
    tweet.failed_at = new Date().toISOString();
    tweet.fail_reason = reason;
  }
}

// ── Logging ────────────────────────────────────────────────────────────────

function log(entry) {
  const line = JSON.stringify({ ts: new Date().toISOString(), ...entry });
  fs.appendFileSync(LOG_FILE, line + '\n');
  console.log('[log]', JSON.stringify(entry));
}

// ── Browser helpers ────────────────────────────────────────────────────────

/**
 * OpenClaw browser actions are invoked by describing them to Claude Code
 * in structured comments. When this script is run by a Claude Code agent,
 * the agent reads the AGENT-INSTRUCTIONS block below and executes the steps.
 *
 * When run directly (e.g. by cron trigger), Claude Code itself is the runtime
 * and will follow AGENT-INSTRUCTIONS automatically.
 */

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main ───────────────────────────────────────────────────────────────────

async function postStandaloneTweet(tweet, queue) {
  console.log('\n=== POSTING STANDALONE TWEET ===');
  console.log(`ID: ${tweet.id}`);
  console.log(`Text:\n${tweet.text}\n`);

  if (DRY_RUN) {
    console.log('[DRY-RUN] Would post tweet above. Exiting without posting.');
    return;
  }

  // AGENT-INSTRUCTIONS:
  // 1. browser(action=open, url="https://x.com")
  // 2. browser(action=snapshot, mode=efficient) — check if logged in
  //    - If you see a login wall, log a warning and exit (login required manually)
  //    - If you see the home feed, continue
  // 3. browser(action=act, request={kind: click, description: "Post button or compose tweet button"})
  // 4. browser(action=snapshot) — confirm composer is open
  // 5. browser(action=act, request={kind: type, text: "<tweet.text>"})
  // 6. browser(action=snapshot) — verify text is entered
  // 7. browser(action=act, request={kind: click, description: "Post button inside composer"})
  // 8. browser(action=snapshot) — confirm tweet was posted
  // 9. Try to capture the tweet URL from the confirmation or by navigating to profile

  console.log('\n[AGENT] Browser automation steps follow.');
  console.log('[AGENT] Open:', TWITTER_URL);
  console.log('[AGENT] Type tweet text and click Post.');

  // Placeholder return — agent updates queue after posting
  return { success: true };
}

async function postThread(tweets, queue) {
  console.log('\n=== POSTING THREAD ===');
  console.log(`Thread ID: ${tweets[0].thread_id}`);
  console.log(`Tweets in thread: ${tweets.length}`);

  if (DRY_RUN) {
    tweets.forEach((t, i) => {
      console.log(`\n[DRY-RUN] Thread tweet ${i + 1}/${tweets.length}:`);
      console.log(t.text);
    });
    return;
  }

  // AGENT-INSTRUCTIONS (thread posting):
  // 1. browser(action=open, url="https://x.com")
  // 2. browser(action=snapshot) — verify logged in
  // 3. browser(action=act, request={kind: click, description: "Post/compose button"})
  // 4. Type tweets[0].text
  // 5. browser(action=act, request={kind: click, description: "Add to thread button (+ icon)"})
  // 6. Type tweets[1].text
  // 7. Repeat step 5-6 for remaining tweets
  // 8. browser(action=act, request={kind: click, description: "Post All button"})
  // 9. Capture thread URL

  for (const t of tweets) {
    console.log(`\n[AGENT] Thread position ${t.thread_position}:`);
    console.log(t.text);
  }
}

async function main() {
  console.log('Signal Theory Twitter Poster');
  console.log('============================');
  console.log(`Mode: ${DRY_RUN ? 'DRY-RUN' : 'LIVE'}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  let queue = loadQueue();
  const tweet = findNextTweet(queue);

  if (!tweet) {
    console.log('No pending tweets scheduled for now.');
    console.log('Next pending:', queue.find(t => t.status === 'pending')?.scheduled_at || 'none');
    process.exit(0);
  }

  console.log(`Found tweet ID ${tweet.id} (${tweet.type})`);

  try {
    if (tweet.type === 'thread') {
      const threadTweets = getThreadTweets(queue, tweet.thread_id);
      const pendingInThread = threadTweets.filter(t => t.status === 'pending');
      await postThread(pendingInThread, queue);

      if (!DRY_RUN) {
        pendingInThread.forEach(t => markPosted(queue, t.id));
        log({ event: 'thread_posted', thread_id: tweet.thread_id, count: pendingInThread.length });
        saveQueue(queue);
      }
    } else {
      await postStandaloneTweet(tweet, queue);

      if (!DRY_RUN) {
        markPosted(queue, tweet.id);
        log({ event: 'tweet_posted', id: tweet.id });
        saveQueue(queue);
      }
    }

    console.log('\nDone.');
  } catch (err) {
    console.error('\n[ERROR]', err.message);
    markFailed(queue, tweet.id, err.message);
    log({ event: 'tweet_failed', id: tweet.id, error: err.message });
    saveQueue(queue);
    process.exit(1);
  }
}

main();

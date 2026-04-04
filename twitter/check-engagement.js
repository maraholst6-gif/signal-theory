#!/usr/bin/env node
/**
 * Signal Theory Twitter Engagement Tracker
 * Checks likes/retweets on posted tweets and reports top performers to Discord
 *
 * Usage:
 *   node check-engagement.js          # Check all posted tweets
 *   node check-engagement.js --report # Also send Discord report
 */

const fs = require('fs');
const path = require('path');

const QUEUE_FILE = path.join(__dirname, 'tweets-queue.json');
const REPORT_FILE = path.join(__dirname, 'engagement-report.json');
const SEND_REPORT = process.argv.includes('--report');

// ── Queue helpers ──────────────────────────────────────────────────────────

function loadQueue() {
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

// ── Engagement scraping ────────────────────────────────────────────────────

/**
 * For each posted tweet with a tweet_url, open it in the browser and
 * scrape the like/retweet/reply counts from the page.
 *
 * AGENT-INSTRUCTIONS (per tweet):
 * 1. browser(action=open, url=tweet.tweet_url)
 * 2. browser(action=snapshot) — read engagement numbers from tweet detail page
 *    - Look for aria-label like "123 Likes", "45 Reposts", "12 Replies"
 * 3. Return { likes, retweets, replies }
 */
async function scrapeEngagement(tweetUrl) {
  // Placeholder — agent populates this
  console.log(`[AGENT] Scrape engagement from: ${tweetUrl}`);
  return { likes: null, retweets: null, replies: null };
}

// ── Report ─────────────────────────────────────────────────────────────────

function buildReport(queue) {
  const posted = queue.filter(t => t.status === 'posted' && t.engagement);
  const sorted = [...posted].sort((a, b) => {
    const scoreA = (a.engagement?.likes || 0) + (a.engagement?.retweets || 0) * 3;
    const scoreB = (b.engagement?.likes || 0) + (b.engagement?.retweets || 0) * 3;
    return scoreB - scoreA;
  });

  const top5 = sorted.slice(0, 5);
  return {
    generated_at: new Date().toISOString(),
    total_posted: posted.length,
    top_performers: top5.map(t => ({
      id: t.id,
      text_preview: t.text.slice(0, 80) + '...',
      url: t.tweet_url,
      likes: t.engagement?.likes,
      retweets: t.engagement?.retweets,
      replies: t.engagement?.replies
    }))
  };
}

function formatDiscordMessage(report) {
  const lines = [
    `**Signal Theory Twitter Engagement Report** — ${new Date().toLocaleDateString()}`,
    `Total posted tweets: ${report.total_posted}`,
    '',
    '**Top Performers:**'
  ];

  report.top_performers.forEach((t, i) => {
    lines.push(`${i + 1}. ${t.likes || 0} likes / ${t.retweets || 0} RT — "${t.text_preview}"`);
    if (t.url) lines.push(`   ${t.url}`);
  });

  return lines.join('\n');
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('Signal Theory Engagement Tracker');
  console.log('=================================');

  const queue = loadQueue();
  const postedWithUrl = queue.filter(t => t.status === 'posted' && t.tweet_url);
  const postedWithoutUrl = queue.filter(t => t.status === 'posted' && !t.tweet_url);

  console.log(`Tweets with URL to check: ${postedWithUrl.length}`);
  console.log(`Tweets posted (no URL): ${postedWithoutUrl.length}`);

  if (postedWithUrl.length === 0) {
    console.log('\nNo tweets with URLs to check yet.');
    if (postedWithoutUrl.length > 0) {
      console.log('Tip: tweet_url is set when the poster captures the URL after posting.');
    }
    process.exit(0);
  }

  let updated = 0;
  for (const tweet of postedWithUrl) {
    const eng = await scrapeEngagement(tweet.tweet_url);
    if (eng.likes !== null || eng.retweets !== null) {
      tweet.engagement = eng;
      updated++;
    }
  }

  if (updated > 0) {
    saveQueue(queue);
    console.log(`\nUpdated engagement for ${updated} tweets.`);
  }

  const report = buildReport(queue);
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  console.log(`\nReport saved to ${REPORT_FILE}`);

  if (SEND_REPORT) {
    const message = formatDiscordMessage(report);
    console.log('\n--- Discord Report ---');
    console.log(message);
    console.log('--- End Report ---');
    // AGENT-INSTRUCTIONS: Send the message above to Discord channel 1481509933177507873
  }
}

main().catch(err => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});

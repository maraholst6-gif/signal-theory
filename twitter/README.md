# Signal Theory Twitter Auto-Poster

Posts Signal Theory content 2-3x/day to @SignalTheoryApp via browser automation.

---

## Files

| File | Purpose |
|------|---------|
| `tweets-queue.json` | 30 pre-written tweets (20 standalone + 2 threads of 5) |
| `post-tweet.js` | Posts next scheduled tweet via browser |
| `check-engagement.js` | Scrapes likes/retweets and reports top performers |
| `post-log.jsonl` | Auto-created log of all post attempts |
| `engagement-report.json` | Auto-created daily engagement summary |

---

## Quick Start

### 1. First login (manual, one-time)

Open the browser and log in to @SignalTheoryApp manually. The browser session is saved by OpenClaw and reused automatically.

### 2. Dry-run test

```bash
node signal-theory/twitter/post-tweet.js --dry-run
```

Previews the next scheduled tweet without posting anything.

### 3. Post next tweet

```bash
node signal-theory/twitter/post-tweet.js
```

Posts the next tweet in the queue whose `scheduled_at` time has passed.

### 4. Force a specific tweet

```bash
node signal-theory/twitter/post-tweet.js --force-id 5
```

Useful for testing or re-posting a specific tweet regardless of schedule.

### 5. Check engagement

```bash
node signal-theory/twitter/check-engagement.js --report
```

Scrapes engagement data for all posted tweets and sends a Discord report.

---

## Queue Format

Each tweet in `tweets-queue.json` has:

```json
{
  "id": 1,
  "text": "Tweet content...",
  "type": "standalone",         // or "thread"
  "thread_id": null,            // set for threads (e.g. "thread-1")
  "thread_position": null,      // 1-based position within thread
  "scheduled_at": "2026-04-05T09:00:00-04:00",
  "posted_at": null,            // filled in after posting
  "status": "pending",          // pending | posted | failed
  "engagement": null,           // { likes, retweets, replies } after check
  "tweet_url": null             // filled in after posting if captured
}
```

**Statuses:**
- `pending` — not yet posted, waiting for scheduled time
- `posted` — successfully posted
- `failed` — post attempt failed (see `fail_reason`)

---

## Posting Schedule (Cron)

Three posts per day at Eastern Time:

| Slot | Time | Cron |
|------|------|------|
| Morning | 9:00 AM ET | `0 9 * * *` |
| Afternoon | 3:00 PM ET | `0 15 * * *` |
| Evening | 8:00 PM ET | `0 20 * * *` |

### Set up cron jobs

Run these three commands in OpenClaw:

**9 AM:**
```
openclaw cron add --name "signal-theory-twitter-9am" --cron "0 9 * * *" --message "Run Signal Theory Twitter post: node signal-theory/twitter/post-tweet.js" --channel discord --to "channel:1481509933177507873" --tz "America/New_York" --model "gpt" --light-context --no-deliver
```

**3 PM:**
```
openclaw cron add --name "signal-theory-twitter-3pm" --cron "0 15 * * *" --message "Run Signal Theory Twitter post: node signal-theory/twitter/post-tweet.js" --channel discord --to "channel:1481509933177507873" --tz "America/New_York" --model "gpt" --light-context --no-deliver
```

**8 PM:**
```
openclaw cron add --name "signal-theory-twitter-8pm" --cron "0 20 * * *" --message "Run Signal Theory Twitter post: node signal-theory/twitter/post-tweet.js" --channel discord --to "channel:1481509933177507873" --tz "America/New_York" --model "gpt" --light-context --no-deliver
```

**Engagement check (daily 9 AM):**
```
openclaw cron add --name "signal-theory-engagement" --cron "0 9 * * *" --message "Check Signal Theory engagement: node signal-theory/twitter/check-engagement.js --report" --channel discord --to "channel:1481509933177507873" --tz "America/New_York" --model "gpt" --light-context --no-deliver
```

---

## Tweet Content Summary

**20 standalone tweets** — hooks, insights, observations about signal-reading in dating

**Thread 1** (tweets 21-25): "7 signals men miss that she's lost interest"
- Stops asking questions
- Short but fast replies (the one men miss)
- Stops initiating plans
- Physical distance, no future-pacing, forgetting details, friend-availability

**Thread 2** (tweets 26-30): "The gap between what she's doing and what you're telling yourself"
- The narrative vs reality gap
- How guys fill behavioral gaps with hope
- Behavior > narrating
- Fix: observe, don't narrate

**Schedule:** tweets 1-20 run April 5-11 (3x/day), threads run evenings/mornings April 11-12.

---

## Adding More Tweets

1. Open `tweets-queue.json`
2. Add new tweet objects with:
   - Unique `id` (increment from last)
   - `scheduled_at` in future ISO 8601 format with `-04:00` (Eastern)
   - `status: "pending"`
3. Save — poster picks them up automatically on schedule

---

## Troubleshooting

**"No pending tweets scheduled for now"** — Next pending tweet isn't due yet. Check `scheduled_at` on the first pending tweet.

**Login required** — Run `post-tweet.js` manually in a session where the browser is open, log in to Twitter, then the session is saved.

**Tweet marked "failed"** — Check `post-log.jsonl` for error details. Re-post manually with `--force-id`.

**Thread partially posted** — Thread tweets share a `thread_id`. The poster finds all pending tweets in the thread and posts them in sequence.

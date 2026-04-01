# Signal Theory Email CRM - Integration Guide

**Last updated:** March 31, 2026  
**For:** App development team  
**Purpose:** Integrate the React Native app with the custom email/CRM system

---

## Overview

The Signal Theory email system is a custom-built CRM that captures quiz takers, sends automated email sequences, and manages subscriber lists. It's fully integrated with the backend API and database.

**Backend URL:** `https://signal-theory-backend.onrender.com`  
**Frontend URL:** `https://learnsignaltheory.com`

---

## Database Schema

The email system uses 3 PostgreSQL tables:

### 1. `email_subscribers`

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `email` | VARCHAR(255) | Subscriber email (unique) |
| `first_name` | VARCHAR(100) | Optional first name |
| `quiz_profile` | VARCHAR(50) | Quiz result profile type |
| `subscribed_at` | TIMESTAMP | When they subscribed |
| `unsubscribed_at` | TIMESTAMP | NULL if still subscribed |
| `unsubscribe_token` | VARCHAR(64) | Unique token for unsubscribe link |

**Indexes:**
- `email` (unique)
- `unsubscribe_token` (unique)

### 2. `email_queue`

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `subscriber_id` | INTEGER | Foreign key to `email_subscribers.id` |
| `email_type` | VARCHAR(50) | `'welcome'`, `'day2'`, `'day4'` |
| `scheduled_for` | TIMESTAMP | When to send |
| `sent_at` | TIMESTAMP | NULL if not sent yet |
| `failed_at` | TIMESTAMP | NULL if not failed |
| `retry_count` | INTEGER | Number of send attempts (max 3) |

**Indexes:**
- `subscriber_id`
- `scheduled_for` (for cron job efficiency)

### 3. `email_log`

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `subscriber_id` | INTEGER | Foreign key |
| `email_type` | VARCHAR(50) | Email type sent |
| `sent_at` | TIMESTAMP | When sent |
| `success` | BOOLEAN | TRUE if sent successfully |
| `error_message` | TEXT | NULL if success, error details if failed |

**Purpose:** Audit trail of all email sends

---

## API Endpoints

### 1. Subscribe a New User

**Endpoint:** `POST /api/email/subscribe`

**When to call:** After quiz completion, when user enters email

**Request body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",           // Optional
  "quizProfile": "Direct Communicator"  // Quiz result
}
```

**Response (success):**
```json
{
  "success": true
}
```

**Response (error):**
```json
{
  "error": "Email is required"
}
```

**What happens behind the scenes:**
1. Validates email format
2. Checks if email already exists
3. Generates unique unsubscribe token
4. Inserts into `email_subscribers` table
5. Queues 3 emails in `email_queue`:
   - Email 1 (`welcome`) - immediate
   - Email 2 (`day2`) - scheduled for +2 days
   - Email 3 (`day4`) - scheduled for +4 days

**Error handling:**
- Returns 400 if email is missing or invalid
- Returns 500 if database error
- Duplicate emails are silently accepted (idempotent)

---

### 2. Unsubscribe a User

**Endpoint:** `GET /api/email/unsubscribe/:token`

**When to call:** When user clicks unsubscribe link in email

**Example:**
```
GET https://signal-theory-backend.onrender.com/api/email/unsubscribe/1e053a1687e62aa941106f42aea52c5d9b...
```

**Response:** HTML page confirming unsubscribe

**What happens:**
1. Looks up subscriber by unsubscribe token
2. Sets `unsubscribed_at` timestamp
3. Deletes any pending emails from `email_queue`
4. Displays confirmation page

---

## Email Sequence

### Email 1: Welcome / Action Plan (Immediate)

**Subject:** Your Signal Theory results  
**Content:** Personalized action plan based on quiz profile  
**Timing:** Sent immediately after subscription

### Email 2: Problem Awareness (Day 2)

**Subject:** TBD (Jeff writing copy)  
**Content:** Deeper dive into relationship challenges  
**Timing:** 2 days after subscription

### Email 3: App Pitch (Day 4)

**Subject:** TBD (Jeff writing copy)  
**Content:** Introduction to Signal Theory app + features  
**Timing:** 4 days after subscription

**Sender:** `contact@learnsignaltheory.com`  
**Sending mechanism:** Microsoft Graph API (Azure AD app)

---

## Cron Job (Email Processor)

**Job:** `processEmailQueue.js`  
**Schedule:** Every 15 minutes (`*/15 * * * *`)  
**Command:** `node dist/jobs/processEmailQueue.js`

**What it does:**
1. Queries `email_queue` for emails where `scheduled_for <= NOW()` and `sent_at IS NULL`
2. Batches up to 50 emails per run
3. For each email:
   - Fetches subscriber data
   - Renders email template (HTML + plain text)
   - Sends via Microsoft Graph API
   - Marks `sent_at` in queue
   - Logs result in `email_log`
4. Retries failed emails up to 3 times
5. Stops retrying after 3 failures (marks as failed)

**Monitoring:** Check `email_log` table for send status

---

## Integration Steps for App

### Step 1: Quiz Completion Flow

When user completes the quiz in the app:

```typescript
// After quiz results are calculated
const quizProfile = calculateProfile(answers); // e.g., "Direct Communicator"

// Prompt user for email
const email = await promptForEmail();
const firstName = await promptForFirstName(); // Optional

// Subscribe to email list
try {
  const response = await fetch('https://signal-theory-backend.onrender.com/api/email/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      firstName: firstName || undefined,
      quizProfile: quizProfile
    })
  });

  const result = await response.json();
  
  if (result.success) {
    // Show success message: "Check your email for your action plan!"
    console.log('Successfully subscribed to email sequence');
  } else {
    // Handle error
    console.error('Subscription failed:', result.error);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### Step 2: Handle Errors Gracefully

```typescript
if (!response.ok) {
  if (response.status === 400) {
    // Invalid email format
    showError('Please enter a valid email address');
  } else if (response.status === 500) {
    // Server error
    showError('Something went wrong. Please try again.');
  }
}
```

### Step 3: User Experience

**Recommended flow:**
1. User completes quiz
2. Show results screen with profile type
3. Prompt: "Want your personalized action plan? Enter your email:"
4. User enters email (+ optional first name)
5. Call `/api/email/subscribe`
6. Show confirmation: "Check your inbox! We just sent your action plan to {email}"
7. Continue to app features

**Privacy note:** Make sure to include a privacy policy link and mention they're subscribing to emails.

---

## Testing the Integration

### Test Endpoint

```bash
curl -X POST https://signal-theory-backend.onrender.com/api/email/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test","quizProfile":"Direct Communicator"}'
```

**Expected response:**
```json
{"success":true}
```

### Verify Email Sent

Check the inbox for `test@example.com` - should receive welcome email within 1-2 minutes.

### Test Unsubscribe

Click the unsubscribe link in the email footer. Should see confirmation page.

---

## Environment Variables (Backend)

These are already configured in Render, but for reference:

```bash
MICROSOFT_TENANT_ID=4fde6f5e-61fa-4f1d-b52a-e21c31584485
MICROSOFT_CLIENT_ID=e4a26a0e-26c0-476d-806f-b22819d88866
MICROSOFT_CLIENT_SECRET=V_d8Q~JBmW*** (secret)
EMAIL_FROM=contact@learnsignaltheory.com
APP_BASE_URL=https://learnsignaltheory.com
```

---

## Monitoring & Analytics

### Check Subscriber Count

```sql
SELECT COUNT(*) FROM email_subscribers WHERE unsubscribed_at IS NULL;
```

### Check Email Send Success Rate

```sql
SELECT 
  COUNT(*) as total_sends,
  SUM(CASE WHEN success = TRUE THEN 1 ELSE 0 END) as successful,
  SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) as failed
FROM email_log;
```

### Check Pending Emails

```sql
SELECT COUNT(*) 
FROM email_queue 
WHERE sent_at IS NULL 
  AND failed_at IS NULL;
```

---

## Compliance

The email system includes:

✅ **CAN-SPAM compliance:**
- Clear sender identity (`contact@learnsignaltheory.com`)
- Valid physical address in footer
- One-click unsubscribe link
- Immediate unsubscribe processing

✅ **GDPR considerations:**
- Users explicitly opt-in by entering email
- Unsubscribe available in every email
- No selling/sharing of email addresses

**Recommendation:** Add checkbox in app: "I agree to receive emails from Signal Theory" (explicit consent)

---

## Future Enhancements

**Possible additions:**
1. Segmentation by quiz profile (different email sequences per profile type)
2. A/B testing email subject lines
3. Email open/click tracking
4. Re-engagement campaigns for churned users
5. In-app email preferences (pause emails, change frequency)
6. Premium user tagging (skip day 4 pitch if already subscribed)

---

## Support

**Questions?** Contact Jeff or check:
- Backend code: `signal-theory/backend/src/routes/email.ts`
- Email templates: `signal-theory/backend/src/templates/emails.ts`
- Database migrations: `signal-theory/backend/src/db/migrations/004_email_system.sql`

**Deployment:** Backend auto-deploys from GitHub (`maraholst6-gif/signal-theory` repo, `master` branch)

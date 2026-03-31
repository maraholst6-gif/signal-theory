# Email System — Deployment Guide

---

## Overview

The email system replaces ConvertKit with three components:

| Component | File | Purpose |
|-----------|------|---------|
| Database | `migrations/004_email_system.sql` | 3 new tables: subscribers, queue, log |
| Service | `src/services/emailService.ts` | Microsoft Graph API client |
| Templates | `src/templates/emails.ts` | 3 placeholder email templates |
| API routes | `src/routes/email.ts` | Subscribe + unsubscribe endpoints |
| Queue job | `src/jobs/processEmailQueue.ts` | Sends pending emails on a timer |

The existing `/api/convertkit` route remains untouched — you can remove it after migration is confirmed.

---

## Pre-deployment checklist

- [ ] Complete Azure App Registration (see `docs/AZURE-SETUP.md`)
- [ ] Have the 4 env vars ready: `MICROSOFT_TENANT_ID`, `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `EMAIL_FROM`
- [ ] Replace placeholder copy in `src/templates/emails.ts` with real content (optional before first deploy — system will still function)

---

## Deploy steps

### 1. Push to GitHub

```bash
git add backend/src/db/migrations/004_email_system.sql
git add backend/src/services/emailService.ts
git add backend/src/templates/emails.ts
git add backend/src/routes/email.ts
git add backend/src/jobs/processEmailQueue.ts
git add backend/src/index.ts
git add backend/docs/
git commit -m "Add custom email system (replaces ConvertKit)"
git push origin main
```

Render will auto-deploy on push.

### 2. Run the migration

The migration runs automatically on deploy via the `preDeployCommand` in `render.yaml`:

```yaml
preDeployCommand: node ../run-migration.js
```

This runs `004_email_system.sql` (and any other pending migrations) before the new code goes live.

To run manually if needed:

```bash
# On Render shell, or locally with DATABASE_URL set:
cd backend
npm run migrate
```

### 3. Add env vars to Render

In Render dashboard → signal-theory-backend → Environment:

```
MICROSOFT_TENANT_ID      = <from Azure>
MICROSOFT_CLIENT_ID      = <from Azure>
MICROSOFT_CLIENT_SECRET  = <from Azure>
EMAIL_FROM               = jeff@signaltheory.com
APP_BASE_URL             = https://signaltheory.app
```

Trigger a manual deploy after adding env vars.

---

## Set up the queue cron job (Render)

The queue processor needs to run every 15 minutes. Set this up in Render as a **Cron Job** service:

1. In Render dashboard, click **New** → **Cron Job**
2. Settings:
   - **Name:** `signal-theory-email-queue`
   - **Runtime:** Docker (use same Dockerfile as backend, or Node)
   - **Schedule:** `*/15 * * * *` (every 15 minutes)
   - **Command:** `node dist/jobs/processEmailQueue.js`
3. Add the same env vars as the web service (DATABASE_URL, MICROSOFT_*, EMAIL_FROM)

Alternatively, if you want to avoid a separate service, add a `setInterval` in `index.ts` — but a dedicated cron job is cleaner.

---

## API reference

### Subscribe a user

```
POST /api/email/subscribe
Content-Type: application/json

{
  "email":       "user@example.com",
  "firstName":   "Alex",          // optional
  "quizProfile": "The Avoidant",  // optional
  "source":      "quiz"           // optional, defaults to "quiz"
}
```

Response:
```json
{ "success": true }
```

The quiz front-end should call this after a user completes the quiz (alongside or replacing the existing `/api/convertkit/subscribe` call).

### Unsubscribe

Users click the link in their email footer:
```
GET /unsubscribe/:token
```

Returns a plain HTML confirmation page.

---

## Testing

Run the validation script locally:

```bash
cd backend
# With .env set (or env vars exported):
npx ts-node src/test-email-system.ts

# To also send a real test email:
TEST_SEND_TO=your@email.com npx ts-node src/test-email-system.ts
```

Expected output (all Azure vars set + migration run):
```
=== Signal Theory Email System — Validation ===

1. Environment variables
  ✓ DATABASE_URL
  ✓ EMAIL_FROM
  ✓ MICROSOFT_TENANT_ID
  ...

2. Email templates
  ✓ Template "immediate" renders
  ✓ Template "followup_2d" renders
  ✓ Template "followup_4d" renders
  ...

3. Microsoft Graph
  ✓ isEmailConfigured()

4. Database
  ✓ Connection OK
  ✓ Table "email_subscribers" exists
  ✓ Table "email_queue" exists
  ✓ Table "email_log" exists

=== Results: 11 passed, 0 failed ===
```

---

## Updating email copy

Edit `src/templates/emails.ts`. Each template function returns `subject`, `htmlBody`, and `textBody`. Find the `[PLACEHOLDER]` comments and replace with real content.

After editing, rebuild and deploy:

```bash
git add backend/src/templates/emails.ts
git commit -m "Update email copy"
git push origin main
```

---

## Removing ConvertKit

Once the new system is confirmed working in production:

1. Delete `backend/src/routes/convertkit.ts`
2. Remove the import and `app.use('/api/convertkit', ...)` line from `index.ts`
3. Remove `CONVERTKIT_API_KEY` and `CONVERTKIT_FORM_ID` from Render env vars
4. Update the quiz front-end to call `/api/email/subscribe` instead of `/api/convertkit/subscribe`

# Signal Theory — Architecture

## Overview

Signal Theory is a dating coach web app that teaches users to read attraction signals and respond effectively. Users take a quiz to build a dating profile, then practice with AI-powered scenarios and analyze real conversations.

**Tech stack:** Node.js + Express backend, Postgres database, Anthropic Claude API, Stripe payments, vanilla HTML/JS frontend.

---

## Hosting & Deployment

**Single deployment on Render** — the Express backend serves both the API and the frontend static files.

| Component | Where |
|---|---|
| Backend API | Render web service (`signal-theory-backend`) |
| Frontend | Served by Express from `/srv/app/` inside the container |
| Database | Render managed Postgres (`signal-theory-db`) |
| Custom domain | `learnsignaltheory.com` → Render `signal-theory-backend` |

**Before (two services):** Frontend on `signal-theory-demo` static site, backend on `signal-theory-backend`. Cross-origin API calls required hardcoded `https://signal-theory-backend.onrender.com` URLs.

**After (one service):** Backend serves frontend. API calls use relative paths (`/api/...`). No CORS issues.

**Deploy trigger:** `git push` → Render auto-builds the Docker image → migrates DB → serves traffic.

**Build process:**
1. Docker builder stage compiles TypeScript (`tsc`)
2. Production image runs: `node dist/db/migrate.js && node load-templates.js && node dist/index.js`

---

## Directory Structure

```
signal-theory/
├── Dockerfile              # Repo-root Docker build (copies both backend + app)
├── render.yaml             # Render deployment config (single web service + DB)
├── run-migration.js        # Standalone migration runner (used locally)
│
├── app/                    # Frontend — static HTML/CSS/JS
│   ├── index.html          # Main dashboard (protected)
│   ├── scenarios.html      # Scenario browser
│   ├── scenario-play.html  # Interactive scenario
│   ├── analyzer.html       # Conversation analyzer
│   ├── quiz.html           # Onboarding quiz
│   └── upgrade.html        # Paywall / upgrade page
│
├── backend/
│   ├── Dockerfile          # Legacy (unused — root Dockerfile is used by Render)
│   ├── src/
│   │   ├── index.ts        # Express app setup, static serving, route registration
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic (claude.ts, stripeService.ts, etc.)
│   │   ├── middleware/     # auth.ts, rateLimit.ts
│   │   ├── db/             # migrate.ts, migrations/*.sql
│   │   ├── jobs/           # processEmailQueue.ts
│   │   └── templates/      # emails.ts (email HTML templates)
│   ├── dist/               # Compiled JS output (gitignored)
│   ├── email-action-plans/ # Text content for action-plan emails
│   ├── load-templates.js   # Seeds scenario templates from DB
│   └── package.json
```

---

## Key Components

### Frontend
- Static HTML + CSS + vanilla JS (no framework)
- Quiz page uses React (standalone bundle)
- `localStorage` for JWT session: key `signal_theory_token`
- API calls use relative paths: `fetch('/api/...')` — same origin as backend

### Backend
- **Express.js** REST API on port 3000
- **Static serving:** `express.static(path.join(__dirname, '../app'))` — serves frontend at `/`
- **Postgres** via `pg` pool, managed by Render
- **Anthropic Claude** for scenario generation and conversation analysis
- **Stripe** for subscriptions (checkout + webhook)
- **Email** via Microsoft Graph API (OAuth), queued processing every 15 min
- **ConvertKit** for email marketing integration

### Database Tables
- `users`, `refresh_tokens`
- `quiz_profiles`
- `analyses`
- `scenario_templates`, `scenario_completions`
- `email_queue`, `email_unsubscribes`
- `admin_prompts`

---

## API Endpoints

| Route | Purpose |
|---|---|
| `POST /api/auth/register` | Create account |
| `POST /api/auth/login` | Login, returns JWT |
| `POST /api/auth/refresh` | Refresh JWT |
| `GET /api/profile` | Get user profile |
| `GET /api/users/:userId/premium` | Check premium status |
| `POST /api/quizzes/submit` | Submit quiz answers |
| `POST /api/analyze` | Analyze a conversation |
| `GET /api/scenarios` | List scenario templates |
| `POST /api/scenario-play/start` | Start a scenario |
| `POST /api/scenario-play/respond` | Send response in scenario |
| `POST /api/stripe/create-checkout` | Create Stripe checkout session |
| `POST /api/stripe/webhook` | Stripe webhook handler |
| `GET /api/usage` | Usage stats |
| `GET /api/admin/prompts` | Admin: list prompts |
| `GET /api/convertkit/*` | ConvertKit integration |
| `POST /api/email/*` | Email operations |
| `GET /unsubscribe/:token` | Email unsubscribe |
| `GET /health` | Health check |
| `GET /api/diag/claude` | Claude API key diagnostic |

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `ANTHROPIC_API_KEY` | Yes | Claude API access |
| `PORT` | No (default 3000) | Server port |
| `NODE_ENV` | No | `production` disables some dev behavior |
| `APP_BASE_URL` | No | Used in Stripe redirect URLs + email links |
| `BACKEND_URL` | No | Used in email templates (fallback to onrender URL) |
| `STRIPE_SECRET_KEY` | No | Stripe payments |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signature verification |
| `MICROSOFT_TENANT_ID` | No | Email via Microsoft Graph |
| `MICROSOFT_CLIENT_ID` | No | Email via Microsoft Graph |
| `MICROSOFT_CLIENT_SECRET` | No | Email via Microsoft Graph |
| `EMAIL_FROM` | No | Sender address for transactional email |

---

## Deployment Checklist

1. Push changes to GitHub (`git push origin main`)
2. Render detects push and starts build
3. Docker builds from repo root `Dockerfile`
4. Container starts: runs migrations → loads templates → starts Express
5. Render health-checks `/health` before routing traffic

---

## Custom Domain Setup (GoDaddy → Render)

1. In Render dashboard → `signal-theory-backend` → Settings → Custom Domains
2. Add `learnsignaltheory.com` and `www.learnsignaltheory.com`
3. Render provides CNAME target (e.g., `signal-theory-backend.onrender.com`)
4. In GoDaddy DNS:
   - Delete any existing CNAME/A records for `@` and `www` pointing to GitHub Pages
   - Add: `CNAME @ → <render-provided-value>`
   - Add: `CNAME www → <render-provided-value>`

---

## Common Issues & Solutions

| Issue | Cause | Fix |
|---|---|---|
| Frontend changes not reflecting | Old GitHub Pages caching | Moved to Render — deploys instantly |
| Migrations not running | `run-migration.js` path wrong | Migrations now run in Docker CMD |
| CORS errors | Frontend on different domain than API | Single service — same origin, no CORS needed |
| "Not found" on API routes | Static middleware catching API routes | API routes registered before `express.static` |

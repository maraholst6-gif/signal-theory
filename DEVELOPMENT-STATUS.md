# Signal Theory - Development Status & Handoff

**Last updated:** April 1, 2026  
**Status:** MVP deployed and operational  
**URLs:**
- Frontend: https://learnsignaltheory.com
- Backend: https://signal-theory-backend.onrender.com
- GitHub: https://github.com/maraholst6-gif/signal-theory

---

## Current State

### **✅ What's Live and Working**

**1. Authentication System**
- Signup/login with email + password
- JWT access tokens (15min) + refresh tokens (7 days)
- Password visibility toggle (eye icon)
- Forgot password flow (email reset links)
- "Account already exists" error handling
- Session persistence across devices

**2. Quiz System**
- 3 difficulty levels (Beginner, Intermediate, Advanced)
- 8 relationship profile types
- Progress tracking synced to backend database
- Quiz history API (`/api/quizzes/history`)
- Results saved per user account

**3. Email/CRM System (Custom Built)**
- Auto-subscribe on signup
- Microsoft Graph API sender (`contact@learnsignaltheory.com`)
- 3-email sequence (welcome, day+2, day+4)
- Unsubscribe handling
- Email queue processor (runs every 15min via Render cron)
- Database tables: `email_subscribers`, `email_queue`, `email_log`

**4. Training Dashboard**
- Displays quiz completion progress (0%, 33%, 66%, 100%)
- Shows accuracy stats from quiz history
- Syncs across devices (backend database, not localStorage)

**5. Infrastructure**
- PostgreSQL database (Render)
- TypeScript backend (Express)
- Vanilla JS frontend (GitHub Pages)
- Auto-deploy: GitHub push → Render/Pages deployment

---

## Tech Stack

**Backend:**
- Express.js (TypeScript)
- PostgreSQL with `pg` driver
- JWT authentication (`jsonwebtoken`)
- bcrypt password hashing
- Microsoft Graph API (email sending)
- Rate limiting (`express-rate-limit`)

**Frontend:**
- Vanilla JavaScript (no framework)
- Single HTML file (`app/index.html`)
- Inline styles + minimal external dependencies
- LocalStorage for session caching only (auth state)

**Deployment:**
- Backend: Render (free tier, sleeps when idle)
- Frontend: GitHub Pages (auto-deploy from `master` branch)
- Database: Render PostgreSQL
- Email: Microsoft 365 (`contact@learnsignaltheory.com` alias)

---

## Database Schema

**Key tables:**

1. **`users`** - User accounts (id=UUID, email, password_hash, display_name)
2. **`quiz_results`** - Quiz completion history (user_id, level, score, profile, timestamp)
3. **`usage_tracking`** - Analyzer usage logs (user_id, scenario_id, timestamp)
4. **`email_subscribers`** - CRM subscribers (email, quiz_profile, unsubscribe_token)
5. **`email_queue`** - Scheduled emails (subscriber_id, email_type, scheduled_for, sent_at)
6. **`email_log`** - Send audit trail (subscriber_id, success, error_message)
7. **`password_reset_tokens`** - Password reset flow (user_id=UUID, token, expires_at, used_at)

**Migrations:** Located in `backend/src/db/migrations/*.sql` (001-005 completed)

---

## API Endpoints

### **Auth (`/api/auth`)**
- `POST /signup` - Create account + auto-subscribe to email CRM
- `POST /login` - Login with email/password
- `POST /refresh` - Refresh access token
- `POST /logout` - Invalidate refresh token
- `POST /forgot-password` - Send reset email
- `POST /reset-password` - Update password with token

### **Quiz (`/api/quizzes`)**
- `POST /submit` - Save quiz results
- `GET /history` - Fetch user's quiz completion history

### **Email (`/api/email`)**
- `POST /subscribe` - Add subscriber (called automatically on signup)
- `GET /unsubscribe/:token` - Unsubscribe handler

### **Usage (`/api/usage`)**
- `POST /track` - Log analyzer usage

### **Analysis (`/api/analyze`)**
- `POST /` - Scenario analyzer (uses OpenAI gpt-4o-mini)

---

## Environment Variables (Render)

**Required:**
- `DATABASE_URL` - PostgreSQL connection string (auto-injected by Render)
- `JWT_SECRET` - Token signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `MICROSOFT_TENANT_ID` - Azure AD tenant
- `MICROSOFT_CLIENT_ID` - Azure app registration
- `MICROSOFT_CLIENT_SECRET` - Azure app secret
- `EMAIL_FROM` - `contact@learnsignaltheory.com`
- `APP_BASE_URL` - `https://learnsignaltheory.com`
- `OPENAI_API_KEY` - For analyzer feature

---

## Known Issues & Limitations

**1. Analyzer requires OpenAI credits**
- Uses `gpt-4o-mini` model
- Costs ~$0.0006 per analysis
- Currently blocked: OpenAI account needs $5-10 credits

**2. Scenarios tab is placeholder**
- No AI-generated scenarios yet
- Placeholder content only

**3. Premium features not implemented**
- No Stripe integration
- No premium user flags
- No premium-only content

**4. Onboarding/training module incomplete**
- No explainer for 8 relationship profiles
- No training flow for quiz interpretation

**5. Landing page is minimal**
- Needs real copy + design
- Currently basic placeholder

---

## What NOT to Worry About

**Abandoned approaches:**
- ConvertKit integration (replaced with custom email CRM)
- Claude API analyzer (switched to OpenAI due to account tier limits)
- localStorage-only progress tracking (migrated to backend database)
- Multiple token files for Google API (consolidated to single `google-tokens.json`)

**These are SOLVED and don't need re-visiting:**
- Password reset flow (fully working)
- Progress sync across accounts (backend database now)
- Email CRM auto-subscribe (working)
- Duplicate account error handling (working)

---

## Next Development Priorities

**Core Features (blocking launch):**
1. ✅ Auth system - COMPLETE
2. ✅ Email CRM - COMPLETE
3. ⏳ Analyzer - Needs OpenAI credits ($5-10)
4. ❌ Scenarios tab - Needs AI scenario generation
5. ❌ Premium upgrade path - Needs Stripe integration

**UX Polish:**
6. ❌ Onboarding/explainer - Training module for profiles
7. ❌ Landing page - Real copy + design

**Future Enhancements:**
- Email segmentation by quiz profile
- A/B testing subject lines
- Open/click tracking
- Re-engagement campaigns
- In-app email preferences

---

## Development Workflow

**Making changes:**

1. **Frontend** - Edit `signal-theory/app/index.html`
   - Commit to GitHub
   - GitHub Pages auto-deploys (~1-2 min)

2. **Backend** - Edit files in `signal-theory/backend/src/`
   - Commit to GitHub
   - Render auto-deploys (~2-3 min)
   - Migrations run automatically on deploy

3. **Database migrations** - Add new `.sql` file to `backend/src/db/migrations/`
   - Numbered sequentially (001, 002, etc.)
   - Runs once on first deploy after creation

4. **Testing**
   - Frontend: https://learnsignaltheory.com/app
   - Backend logs: Render dashboard → Logs tab
   - Database: Connect via `DATABASE_URL` (Render env var)

**Git workflow:**
```bash
cd C:\Users\jeffr\.openclaw\workspace\signal-theory
git add .
git commit -m "Description of changes"
git push
```

**Deployments are automatic** - no manual build steps needed.

---

## Key Files Reference

**Frontend:**
- `app/index.html` - Entire frontend app (single file)

**Backend:**
- `src/index.ts` - Express server setup
- `src/routes/*.ts` - API endpoints
- `src/services/emailService.ts` - Microsoft Graph email sender
- `src/templates/emails.ts` - Email content (3 templates)
- `src/jobs/processEmailQueue.ts` - Email queue processor (cron job)
- `src/db/migrations/*.sql` - Database schema changes

**Documentation:**
- `EMAIL-CRM-INTEGRATION-GUIDE.md` - Email system architecture
- `docs/AZURE-SETUP.md` - Microsoft Graph API setup
- `docs/EMAIL-DEPLOYMENT.md` - Email system deployment

---

## Quick Diagnostic Commands

**Check backend status:**
```bash
curl https://signal-theory-backend.onrender.com/health
```

**Check database subscriber count:**
```sql
SELECT COUNT(*) FROM email_subscribers WHERE unsubscribed_at IS NULL;
```

**Check pending emails:**
```sql
SELECT COUNT(*) FROM email_queue WHERE sent_at IS NULL AND failed_at IS NULL;
```

**View recent email sends:**
```sql
SELECT * FROM email_log ORDER BY sent_at DESC LIMIT 10;
```

---

## Contact & Support

**Primary developer:** Jeff Holst  
**Discord:** #signal-theory channel  
**GitHub repo:** https://github.com/maraholst6-gif/signal-theory  
**Production URLs:**
- App: https://learnsignaltheory.com
- API: https://signal-theory-backend.onrender.com

---

## Summary for New Developers

**What you're working with:**
- Full-stack web app (TypeScript backend, vanilla JS frontend)
- Authentication + quiz system + custom email CRM
- Deployed and operational (MVP complete)
- Next priority: Analyzer (needs OpenAI credits) + Scenarios tab + Premium features

**What works:**
- Signup/login/password reset
- Quiz completion + progress tracking
- Email auto-subscribe + 3-email sequence
- Database storage + API endpoints

**What's missing:**
- Analyzer feature (needs OpenAI funding)
- Scenarios content (needs AI generation)
- Premium upgrade (needs Stripe)
- Onboarding/training UX
- Landing page polish

**Start here:**
1. Read this file
2. Review `EMAIL-CRM-INTEGRATION-GUIDE.md`
3. Test the app at learnsignaltheory.com
4. Check Render logs for backend behavior
5. Ask questions in #signal-theory Discord channel

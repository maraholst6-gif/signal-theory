# Signal Theory - Complete Deployment Steps

**Status:** Backend built, database created, code pushed to GitHub

**Time to complete:** 5-10 minutes

---

## What's Already Done ✅

1. ✅ Express backend built (`backend/` directory)
2. ✅ React Native app built (`app/` directory)  
3. ✅ PostgreSQL database created on Render (`signal-theory-db`)
4. ✅ Code pushed to GitHub (`github.com/maraholst6-gif/signal-theory`)

---

## Step 1: Deploy Backend to Render

### A. Create Web Service

1. Go to: https://dashboard.render.com/web/new
2. Click **"Public Git Repository"** tab
3. Enter repository URL: `https://github.com/maraholst6-gif/signal-theory`
4. Click **"Connect"**

### B. Configure Service

**Name:** `signal-theory-backend`

**Root Directory:** `backend`

**Language:** Docker (auto-detected)

**Dockerfile Path:** `Dockerfile` (auto-detected)

**Instance Type:** Free ($0/mo) for testing, or Starter ($7/mo) for better performance

### C. Add Environment Variables

Click **"Add Environment Variable"** for each:

| Key | Value | Where to get it |
|-----|-------|----------------|
| `DATABASE_URL` | (from Render PostgreSQL) | Dashboard → Databases → signal-theory-db → External Database URL → click "Show secret" → copy |
| `JWT_SECRET` | (generate random string) | Use: `openssl rand -base64 32` or https://www.random.org/strings/ |
| `OPENAI_API_KEY` | `sk-...` | Your OpenAI API key |
| `PORT` | `3000` | (literal value) |

### D. Deploy

1. Click **"Deploy web service"**
2. Wait 2-3 minutes for build to complete
3. Copy the service URL (e.g., `https://signal-theory-backend.onrender.com`)

---

## Step 2: Run Database Migration

### Option A: Via Render PostgreSQL Console

1. Go to: Dashboard → Databases → signal-theory-db
2. Click **"Connect"** → Open console
3. Paste and run the contents of: `backend/src/db/migrations/001_initial.sql`

### Option B: Via Local Migration Script

```bash
cd C:\Users\jeffr\.openclaw\workspace\signal-theory\backend
npm install
# Set DATABASE_URL in .env file (from Render)
npm run migrate
```

---

## Step 3: Test Backend

Visit: `https://your-backend-url.onrender.com/health`

Should return: `{"status":"ok"}`

---

## Step 4: Connect App to Backend

### A. Update App Environment

Create `app/.env`:

```
EXPO_PUBLIC_API_URL=https://your-backend-url.onrender.com
EXPO_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_key
```

### B. Test Locally

```bash
cd C:\Users\jeffr\.openclaw\workspace\signal-theory\app
npm install  # (already done)
npx expo start
```

Scan QR code with Expo Go app on your phone.

---

## Step 5: Verify Full Flow

1. **Sign up** - Create test account
2. **Take mini-quiz** - If no quiz profile linked
3. **Practice scenario** - Try one scenario
4. **Real analysis** - Paste a situation
5. **Check limits** - Free tier (5 scenarios/week, 1 analysis/week)

---

## Troubleshooting

### Backend won't deploy
- Check build logs in Render dashboard
- Verify Dockerfile is in `backend/` directory
- Ensure Root Directory is set to `backend`

### Database connection errors
- Verify DATABASE_URL is External URL (not Internal)
- Check PostgreSQL is in Oregon region (same as web service)
- Make sure migration ran successfully

### App can't reach backend
- Check EXPO_PUBLIC_API_URL has no trailing slash
- Verify backend URL is HTTPS
- Test `/health` endpoint first

---

## Next Steps (After Working)

1. **Deploy Quiz** - Deploy `quiz-app/` to Netlify/Vercel
2. **Email Integration** - Connect ConvertKit
3. **RevenueCat** - Set up subscriptions
4. **Custom Domain** - Point domain to Render services
5. **Monitoring** - Set up error tracking

---

## Quick Reference

**Render Dashboard:** https://dashboard.render.com

**Database:** signal-theory-db (PostgreSQL 18, Basic-256mb, Oregon)

**Backend Repo:** https://github.com/maraholst6-gif/signal-theory

**Backend Directory:** `backend/`

**App Directory:** `app/`

**Quiz Directory:** `quiz-app/`

---

**Current time:** 2026-03-29 01:30 AM EDT

**Estimated completion:** 5-10 minutes (manual configuration)

# Deploy Signal Theory Backend - Final Steps

**Everything is ready. Just add these 3 environment variables and deploy.**

---

## Go to Render Deploy Form

URL: https://dashboard.render.com/web/new

---

## Add These 3 Environment Variables

### 1. DATABASE_URL
**Get from:** Dashboard → Databases → signal-theory-db → "External Database URL" → Click "Show secret" → Copy

(It looks like: `postgres://signal_theory_db_user:LONG_PASSWORD_HERE@dpg-something.oregon-postgres.render.com/signal_theory_db`)

### 2. JWT_SECRET
```
J3l1VHdxwWvUSKr8tIDYZq9Okuyp260F
```

### 3. ANTHROPIC_API_KEY
```
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
```

---

## Deploy Settings

- **Root Directory:** `backend`
- **Instance Type:** Free (or Starter $7/mo for better perf)
- **Everything else:** Leave as default

---

## Click "Deploy web service"

Build will take ~2-3 minutes.

---

## After Deployment

1. Copy the service URL (e.g., `https://signal-theory-backend.onrender.com`)
2. Test it: Visit `https://your-url.onrender.com/health`
3. Should see: `{"status":"ok"}`

---

**That's it! The app is deployed and ready to use.**

# Stripe Setup Guide — Signal Theory

## 1. Create Product & Prices in Stripe Dashboard

1. Go to [https://dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products) (test mode)
2. Click **Add Product**
3. Name: **Signal Theory Premium**
4. Add two prices:

| Plan    | Amount | Billing | Env Var               |
|---------|--------|---------|------------------------|
| Monthly | $19.99 | Monthly recurring | `STRIPE_PRICE_MONTHLY` |
| Yearly  | $199   | Yearly recurring  | `STRIPE_PRICE_YEARLY`  |

5. Copy the **Price ID** for each (format: `price_1ABC...`) and add to Render env vars.

---

## 2. Configure Webhook

1. Go to **Developers → Webhooks** in the Stripe Dashboard
2. Click **Add endpoint**
3. **Endpoint URL:** `https://signal-theory-backend.onrender.com/api/stripe/webhook`
4. **Events to listen for:**
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. After creating, click **Reveal** on the Signing Secret and copy it
6. Add to Render as `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## 3. Environment Variables (Render)

These should already be set:
```
STRIPE_PUBLISHABLE_KEY=pk_test_51PLnKQ...
STRIPE_SECRET_KEY=sk_test_51PLnKQ...
```

Add these after product creation:
```
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 4. Test the Integration

### Test Cards (Stripe Test Mode)
| Scenario           | Card Number         |
|--------------------|---------------------|
| Success            | 4242 4242 4242 4242 |
| Requires auth      | 4000 0027 6000 3184 |
| Declined           | 4000 0000 0000 9995 |

Use any future expiry date and any 3-digit CVV.

### Test Flow
1. Log in to Signal Theory web app
2. Click upgrade prompt or navigate to `/app/upgrade.html`
3. Select Monthly or Yearly plan, click **Start Premium**
4. Complete Stripe Checkout with test card `4242 4242 4242 4242`
5. Verify redirect to `/app?upgrade=success`
6. Check database: `SELECT id, email, tier, stripe_subscription_id FROM users WHERE email = '...'`
7. Confirm tier = `premium`

### Test Webhook with Stripe CLI
```bash
stripe login
stripe listen --forward-to https://signal-theory-backend.onrender.com/api/stripe/webhook
stripe trigger checkout.session.completed
```

### Test Cancellation
1. Click **Manage Subscription** in the upgrade page
2. Cancel subscription in Stripe Customer Portal
3. Stripe fires `customer.subscription.deleted`
4. Confirm user tier reverts to `free` in database

---

## 5. API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/stripe/create-checkout` | JWT | Create Stripe Checkout session |
| POST | `/api/stripe/webhook` | Stripe sig | Handle Stripe events |
| POST | `/api/stripe/create-portal-session` | JWT | Create Customer Portal session |
| GET | `/api/users/:userId/premium` | JWT | Check user's premium status |

### Create Checkout
```bash
curl -X POST https://signal-theory-backend.onrender.com/api/stripe/create-checkout \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"priceId": "price_monthly"}'
# Returns: {"url": "https://checkout.stripe.com/..."}
```

### Premium Status
```bash
curl https://signal-theory-backend.onrender.com/api/users/<userId>/premium \
  -H "Authorization: Bearer <token>"
# Returns: {"isPremium": true, "tier": "premium", "subscriptionId": "sub_..."}
```

---

## 6. Database Migration

The migration `007_stripe_fields.sql` adds three columns to the `users` table:
- `tier VARCHAR(20) DEFAULT 'free'` — `'free'` or `'premium'`
- `stripe_customer_id VARCHAR(255)` — Stripe customer ID (`cus_...`)
- `stripe_subscription_id VARCHAR(255)` — Stripe subscription ID (`sub_...`)

The migration runs automatically on deploy via `npm start` → `node -e "require('./dist/db/migrate')"`.

---

## 7. Going Live

1. Switch from test mode to live mode in Stripe Dashboard
2. Replace `pk_test_...` and `sk_test_...` keys with live keys
3. Create a new webhook pointing to the same URL with live mode keys
4. Update `STRIPE_WEBHOOK_SECRET` with the live webhook secret
5. Update price IDs with live price IDs

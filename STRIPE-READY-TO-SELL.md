# Stripe Setup - Ready to Sell

**Status:** Almost complete! Just 2 quick steps to activate.

---

## ✅ Already Done

1. ✅ Stripe integration code deployed
2. ✅ Webhook created at https://signal-theory-backend.onrender.com/api/stripe/webhook
3. ✅ Premium tier system working (database-based test accounts active)
4. ✅ Paywall screens built
5. ✅ Stripe account created

---

## 🔧 Final Steps (5 minutes)

### Step 1: Add Stripe Keys to Render

1. Go to: https://dashboard.render.com/web/srv-d74bogeuk2gs73a296q0/env
2. Click "Add Environment Variable" (3 times, one for each key)

**Add these 3 variables:**

**STRIPE_PUBLISHABLE_KEY**
```
pk_test_51PLnKQGOZKjt1YyVxveLGdX3A0lMmewLzZzfFXNdH6URDS1Spb6ANVPNXRoq1NIKaMUV1ZqqEZLUXnF12BwUAHSx00AWn6ZqdT
```

**STRIPE_SECRET_KEY**
```
sk_test_51PLnKQGOZKjt1YyVr7RN9t+pgUMQqrr9TgbvENsoE7dM51cMc2ne4ydgZGpD8rDKHq5k0wguoIXpKZTCZ1LTY0y00mkAqM4ZC
```

**STRIPE_WEBHOOK_SECRET**
```
(Get this from Stripe dashboard → Developers → Webhooks → click your webhook → click "Signing secret" → reveal and copy)
```

3. Click "Save Changes" (triggers auto-deploy)

---

### Step 2: Create Stripe Products

1. Go to: https://dashboard.stripe.com/test/products/create
2. Create product:
   - **Name:** Signal Theory Pro
   - **Description:** Premium access to Signal Theory dating coach
   - **Pricing:** $19.99/month (recurring)
   - Click "Save product"
3. Copy the **Price ID** (starts with `price_...`)
4. Add to Render env vars: `STRIPE_PRICE_ID` = `price_xxxxx`

---

## 🎯 What Happens After Setup

**When a user upgrades:**
1. They click "Upgrade to Premium" in the app
2. Stripe Checkout page opens
3. They pay $19.99/month
4. Webhook fires → backend updates database
5. Premium features unlock automatically
6. They get charged monthly

---

## 📊 Testing Payment Flow

**Test credit card numbers (Stripe test mode):**
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Require 3D Secure:** `4000 0027 6000 3184`

**Any future expiry date (e.g., 12/28), any 3-digit CVC**

---

## 🚀 Go Live Checklist (When Ready for Real Money)

1. Switch Stripe to live mode
2. Get live API keys (same process, but live mode toggle)
3. Update Render env vars with live keys
4. Create live products (same as test)
5. Update Render env: `STRIPE_PRICE_ID` to live price ID
6. Remove test mode notice from checkout

---

## 💰 Revenue Tracking

**Stripe Dashboard:**
- https://dashboard.stripe.com/payments (see all charges)
- https://dashboard.stripe.com/subscriptions (manage subscriptions)
- https://dashboard.stripe.com/balance (see your balance)

**Automatic payout to bank:** 7 days after first charge (then daily)

---

## ⚠️ Important Notes

- **Test mode** = No real money, use test cards
- **Live mode** = Real money, real cards
- Keep test and live keys separate
- Never commit API keys to GitHub (already in .gitignore)

---

**Ready to sell! Just add the 3 env vars and create the product.**

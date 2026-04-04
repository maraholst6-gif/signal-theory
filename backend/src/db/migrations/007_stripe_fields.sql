-- ─────────────────────────────────────────────
-- Signal Theory — Stripe Subscription Fields
-- Adds: tier, stripe_customer_id, stripe_subscription_id
-- Run: psql $DATABASE_URL -f 007_stripe_fields.sql
-- ─────────────────────────────────────────────

ALTER TABLE users ADD COLUMN IF NOT EXISTS tier VARCHAR(20) DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_subscription_id ON users(stripe_subscription_id);

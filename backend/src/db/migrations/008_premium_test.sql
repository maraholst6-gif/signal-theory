-- ─────────────────────────────────────────────
-- Signal Theory — Premium Test Account
-- Sets jeffrey.holst@gmail.com as premium tier
-- Run: psql $DATABASE_URL -f 008_premium_test.sql
-- ─────────────────────────────────────────────

UPDATE users
SET tier = 'premium'
WHERE email = 'jeffrey.holst@gmail.com';

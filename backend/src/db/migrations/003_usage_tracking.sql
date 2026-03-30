-- ─────────────────────────────────────────────
-- Signal Theory — Usage Tracking Migration
-- Adds: user_usage table for per-week freemium limits
-- Run: psql $DATABASE_URL -f 003_usage_tracking.sql
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  quizzes_completed INT DEFAULT 0,
  scenarios_completed INT DEFAULT 0,
  analyzer_uses INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_user_usage_user_week ON user_usage(user_id, week_start);

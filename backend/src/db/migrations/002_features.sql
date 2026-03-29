-- ─────────────────────────────────────────────
-- Signal Theory — Features Migration
-- Adds: admin flag, AI prompts, quiz results, interactive session history
-- Run: psql $DATABASE_URL -f 002_features.sql
-- ─────────────────────────────────────────────

-- Admin flag on users
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- ─────────────────────────────────────────────
-- AI Prompts (versioned coaching prompts)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ai_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  version INT NOT NULL,
  prompt_text TEXT NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, version)
);

CREATE INDEX IF NOT EXISTS idx_ai_prompts_name_active ON ai_prompts(name, active);

-- Seed the initial scenario coach prompt
INSERT INTO ai_prompts (name, version, prompt_text, active)
VALUES (
  'scenario_coach',
  1,
  'You are a Signal Theory dating coach. Your role is to respond realistically to user actions in dating scenarios, then provide honest behavioral analysis.

Core principles:
- Base all analysis ONLY on observable behaviors, never assumptions
- Signal states: POSITIVE (clear interest), NEUTRAL (ambiguous), NEGATIVE (disinterest/disengagement), AMBIGUOUS (mixed/insufficient data)
- Do not encourage chasing, over-explaining, or seeking validation
- Calibrated responses > emotional reactions
- Direction of behavior matters more than isolated moments

After 5 turns, provide analysis covering: what signals appeared, what they mean, what the user did well or could improve, and the relevant Signal Theory principle.',
  TRUE
)
ON CONFLICT (name, version) DO NOTHING;

-- ─────────────────────────────────────────────
-- Quiz Results
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  score INT NOT NULL,
  total INT NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]',
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_level ON quiz_results(user_id, level);

-- ─────────────────────────────────────────────
-- Interactive Session History
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS interactive_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL,
  scenario_title TEXT,
  turns JSONB NOT NULL DEFAULT '[]',
  final_analysis TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interactive_sessions_user_id ON interactive_sessions(user_id);

-- ─────────────────────────────────────────────
-- View: admin usage stats
-- ─────────────────────────────────────────────

CREATE OR REPLACE VIEW admin_usage_stats AS
SELECT
  (SELECT COUNT(*) FROM users WHERE is_admin = FALSE) AS total_users,
  (SELECT COUNT(*) FROM users WHERE is_admin = FALSE AND week_reset_at > NOW() - INTERVAL '7 days') AS active_this_week,
  (SELECT COUNT(*) FROM interactive_sessions WHERE completed = TRUE) AS scenarios_completed,
  (SELECT ROUND(AVG(score::float / total * 100)) FROM quiz_results) AS avg_quiz_score_pct,
  (SELECT COUNT(*) FROM analyses) AS total_analyses;

-- ─────────────────────────────────────────────
-- Signal Theory — PostgreSQL Schema
-- Standard PostgreSQL (no Supabase dependencies)
-- Run: psql $DATABASE_URL -f 001_initial.sql
-- ─────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- Quiz Profiles (from web quiz)
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS quiz_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  profile_type TEXT NOT NULL,
  signal_score INT DEFAULT 5 CHECK (signal_score BETWEEN 1 AND 10),
  readiness_score INT DEFAULT 5 CHECK (readiness_score BETWEEN 1 AND 10),
  strategy_score INT DEFAULT 5 CHECK (strategy_score BETWEEN 1 AND 10),
  weak_questions JSONB DEFAULT '[]',
  action_plan_practices JSONB DEFAULT '[]',
  quiz_completed_at TIMESTAMPTZ DEFAULT NOW(),
  app_linked_at TIMESTAMPTZ
);

-- ─────────────────────────────────────────────
-- Users
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  profile_type TEXT DEFAULT 'unknown',
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'monthly', 'annual')),
  scenarios_used_week INT DEFAULT 0,
  analyses_used_week INT DEFAULT 0,
  week_reset_at TIMESTAMPTZ DEFAULT NOW(),
  quiz_profile_id UUID REFERENCES quiz_profiles(id),
  revenuecat_app_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Refresh Tokens
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- ─────────────────────────────────────────────
-- Scenarios
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_signal_state TEXT NOT NULL CHECK (correct_signal_state IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'AMBIGUOUS')),
  category TEXT NOT NULL CHECK (category IN ('texting', 'in-person', 'app-based')),
  difficulty TEXT NOT NULL DEFAULT 'basic' CHECK (difficulty IN ('basic', 'intermediate', 'advanced')),
  target_dimensions TEXT[] DEFAULT '{}',
  target_profiles TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- Scenario Results
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS scenario_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scenario_id UUID REFERENCES scenarios(id),
  selected_option INT NOT NULL,
  was_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scenario_results_user_id ON scenario_results(user_id);

-- ─────────────────────────────────────────────
-- Analyses
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  signal_state TEXT CHECK (signal_state IN ('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'AMBIGUOUS')),
  ai_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);

-- ─────────────────────────────────────────────
-- Stats view
-- ─────────────────────────────────────────────

CREATE OR REPLACE VIEW user_stats AS
SELECT
  u.id,
  u.email,
  u.profile_type,
  u.subscription_status,
  u.scenarios_used_week,
  u.analyses_used_week,
  COUNT(DISTINCT sr.id) AS total_scenarios,
  COUNT(DISTINCT sr.id) FILTER (WHERE sr.was_correct) AS total_correct,
  CASE
    WHEN COUNT(DISTINCT sr.id) = 0 THEN 0
    ELSE ROUND(COUNT(DISTINCT sr.id) FILTER (WHERE sr.was_correct)::NUMERIC / COUNT(DISTINCT sr.id) * 100)
  END AS accuracy_pct
FROM users u
LEFT JOIN scenario_results sr ON sr.user_id = u.id
GROUP BY u.id;

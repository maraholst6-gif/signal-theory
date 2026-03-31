-- Email system: subscribers, queue, and log
-- Migration 004 — replaces ConvertKit with self-hosted email

-- ─────────────────────────────────────────────
-- email_subscribers
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS email_subscribers (
  id              SERIAL PRIMARY KEY,
  email           TEXT        NOT NULL,
  first_name      TEXT,
  source          TEXT        NOT NULL DEFAULT 'quiz',  -- 'quiz', 'landing', etc.
  quiz_profile    TEXT,                                  -- e.g. "The Avoidant"
  unsubscribe_token TEXT      NOT NULL,
  unsubscribed_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT email_subscribers_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_token
  ON email_subscribers (unsubscribe_token);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_created
  ON email_subscribers (created_at);

-- ─────────────────────────────────────────────
-- email_queue
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS email_queue (
  id              SERIAL PRIMARY KEY,
  subscriber_id   INTEGER     NOT NULL REFERENCES email_subscribers(id) ON DELETE CASCADE,
  template_name   TEXT        NOT NULL,   -- 'immediate', 'followup_2d', 'followup_4d'
  scheduled_for   TIMESTAMPTZ NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
  attempts        INTEGER     NOT NULL DEFAULT 0,
  last_attempted_at TIMESTAMPTZ,
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT email_queue_status_check CHECK (
    status IN ('pending', 'sent', 'failed', 'cancelled')
  )
);

CREATE INDEX IF NOT EXISTS idx_email_queue_pending
  ON email_queue (scheduled_for)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_email_queue_subscriber
  ON email_queue (subscriber_id);

-- ─────────────────────────────────────────────
-- email_log
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS email_log (
  id              SERIAL PRIMARY KEY,
  queue_id        INTEGER     REFERENCES email_queue(id) ON DELETE SET NULL,
  subscriber_id   INTEGER     REFERENCES email_subscribers(id) ON DELETE SET NULL,
  email           TEXT        NOT NULL,
  template_name   TEXT        NOT NULL,
  status          TEXT        NOT NULL,   -- 'sent', 'failed'
  error_message   TEXT,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_log_subscriber
  ON email_log (subscriber_id);

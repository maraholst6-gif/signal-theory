-- Migration: Add email templates table
-- Purpose: Store action plan email content in database instead of files

CREATE TABLE IF NOT EXISTS email_templates (
  id SERIAL PRIMARY KEY,
  profile_id VARCHAR(100) NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_templates_profile ON email_templates(profile_id);

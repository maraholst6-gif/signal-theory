-- 009_scenario_system.sql
-- Interactive AI-powered scenario training system

-- ─────────────────────────────────────────────
-- scenario_templates: 40 base scenario definitions
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS scenario_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL, -- 'text', 'in_person', 'post_relationship', 'processing_loss'
  setup TEXT NOT NULL,
  difficulty VARCHAR(20) DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- scenario_completions: tracks user plays
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS scenario_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  scenario_id UUID REFERENCES scenario_templates(id) NULL,
  custom_setup TEXT NULL,
  outcome VARCHAR(50), -- 'successful_engagement', 'mutual_disengagement', 'user_disengaged', 'interest_built', 'interest_lost'
  turns_taken INT,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scenario_completions_user_id ON scenario_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_scenario_completions_completed_at ON scenario_completions(completed_at);

-- ─────────────────────────────────────────────
-- Seed 40 base scenarios (idempotent)
-- ─────────────────────────────────────────────

INSERT INTO scenario_templates (title, category, setup, difficulty, is_premium) VALUES

-- TEXT / APP-BASED (10) --

('Late Night Text',
 'text',
 'She texts "Hey what are you up to?" at 11 PM, three days after your first date. There has been no contact in between and she has not referenced the date or any future plans.',
 'beginner', false),

('Delayed Response Pattern',
 'text',
 'She used to reply within an hour. Over the past week, her response times have stretched to 6-8 hours and her messages have gotten noticeably shorter. No explanation offered.',
 'beginner', false),

('App Match Goes Quiet',
 'text',
 'You matched on a dating app and had an energetic two-day conversation. Then she stops responding mid-exchange — no explanation, no re-engagement, just silence.',
 'beginner', false),

('Post-Date Follow Up',
 'text',
 'The morning after a first date you text "Had a great time, let''s do it again." She replies "Yeah it was fun!" — warm, but she does not suggest plans or ask about your week.',
 'beginner', false),

('Rescheduling',
 'text',
 'She cancels your plans at the last minute: "Something came up, can we reschedule?" She seems apologetic but offers no alternative date or time.',
 'intermediate', false),

('Enthusiasm Mismatch',
 'text',
 'You send thoughtful, detailed messages. She replies with one or two words every time. The pattern has held for a week across multiple exchanges.',
 'intermediate', false),

('Read Receipts',
 'text',
 'She has read your last three messages — all sent over the past 48 hours. No response has come. You have exchanged messages regularly before.',
 'beginner', false),

('The Check-In',
 'text',
 'After two weeks of silence following a second date, she texts out of nowhere: "Hey, hope you''re doing well!" No context, no mention of the gap, no suggestion to meet.',
 'intermediate', false),

('Plan Avoidance',
 'text',
 'Every time you propose specific plans she says "Maybe" or "Let''s see how the week looks" — but she never follows up and never proposes an alternative.',
 'intermediate', false),

('The Compliment',
 'text',
 'She tells you "You''re such a great guy" and "Any woman would be lucky to have you" — and then says she''s busy this weekend when you suggest getting together.',
 'beginner', false),

-- IN-PERSON (10) --

('Coffee Shop Extended Conversation',
 'in_person',
 'You''re at a coffee shop. The woman at the next table smiled when you caught eyes. She''s been there 20 minutes with no sign of rushing. She just glanced over again.',
 'beginner', false),

('Gym Regular',
 'in_person',
 'A woman at your gym says hi every time you''re there. This week she mentioned she uses the same trainer you do and asked if you ever take his Tuesday class.',
 'beginner', false),

('Grocery Store Brief Exchange',
 'in_person',
 'You reach for the same item at the store and she laughs: "Great minds." You''re both in line now. She glances at you, still smiling slightly.',
 'beginner', false),

('Bar Encounter',
 'in_person',
 'You''re at a bar on a Tuesday night. An attractive woman sits one seat away. She glances over briefly, then looks down at her phone.',
 'beginner', false),

('Dog Park Repeat Encounter',
 'in_person',
 'The same woman keeps showing up at the dog park on your usual schedule. Today she positioned herself near you and let her dog wander your way.',
 'intermediate', false),

('Post-Divorce Party Encounter',
 'in_person',
 'A mutual friend introduces you at a small gathering. She mentions her divorce early — "Been single about a year now" — and has been talking with you for 20 minutes straight.',
 'intermediate', false),

('Professional Networking Event',
 'in_person',
 'You meet her at a professional event. She asked for your card and followed up by email the next day: "Great to meet you. We should grab coffee sometime."',
 'intermediate', false),

('Bookstore Interaction',
 'in_person',
 'In the history section, she asks your opinion on a book you''ve actually read. She seems genuinely curious, not just making conversation.',
 'beginner', false),

('First Date Good Flow Unclear Close',
 'in_person',
 'First date went well. Good conversation, she laughed a lot, time flew. At the end she said "This was really nice" — but she didn''t suggest a second date or hint at it.',
 'intermediate', false),

('Second Date Physical Escalation',
 'in_person',
 'Second date, dinner went well. She has been physically close all night — touching your arm, leaning in. You''re back at her place now and she invites you in for "one more drink."',
 'advanced', false),

-- POST-RELATIONSHIP / AMBIGUOUS (10) --

('Ex Reaches Out',
 'post_relationship',
 'Your ex texts out of nowhere after eight months of silence: "I''ve been thinking about you. How are you?" No context, no explanation for the disappearance.',
 'intermediate', false),

('Breadcrumbing',
 'post_relationship',
 'She texts every few days — just enough to keep your attention — but she never agrees to meet up. Vague replies, no follow-through. This has been going on for three weeks.',
 'intermediate', false),

('Friend Zone Signal',
 'post_relationship',
 'She introduces you to her friends as "my friend Jeff." Later in the same conversation she mentions there is someone she''s been "kind of talking to" that she likes.',
 'intermediate', false),

('Mixed Social Media',
 'post_relationship',
 'She likes your Instagram photos consistently — sometimes within minutes — but she never responds when you message her directly.',
 'beginner', false),

('The Soft Decline',
 'post_relationship',
 'You ask her out directly. She smiles, says "I''m really busy this month" — and leaves it there. No alternative offered, but no hard no either.',
 'beginner', false),

('Weeknight vs Weekend',
 'post_relationship',
 'She will meet you for lunch on a Tuesday or coffee on a Thursday morning. But every time you suggest a Friday or Saturday she has other plans.',
 'intermediate', false),

('Group Hangout Only',
 'post_relationship',
 'Every time you suggest one-on-one plans, she counters with "We should all hang out" and names a group of mutual friends.',
 'intermediate', false),

('The Comparison',
 'post_relationship',
 'You are on your second date. She keeps bringing up her ex — what he did, how he handled things — as if measuring you against him.',
 'intermediate', false),

('Sudden Distance After Physical',
 'post_relationship',
 'Things were going well, including physically. After an intimate night together last week, she has been noticeably cooler — shorter messages, slower to respond.',
 'advanced', false),

('Long-Term Uncertainty',
 'post_relationship',
 'You have been seeing each other for three months. She says she likes you but "isn''t really ready for a relationship right now."',
 'advanced', false),

-- PROCESSING LOSS (10 — premium) --

('Ex Contacts After Months of Silence',
 'processing_loss',
 'Your ex reaches out after four months of no contact: "I miss you. I think I made a mistake." You still have feelings. You''re also not sure you trust the message.',
 'advanced', true),

('New Date Reminds You of Your Ex',
 'processing_loss',
 'You are on a first date with someone interesting. She laughs and you realize she sounds exactly like your ex. You find yourself comparing everything she does.',
 'intermediate', true),

('Only Attracted to Unavailable Women',
 'processing_loss',
 'You have been dating for a year since your divorce. Every woman you feel genuinely drawn to turns out to be taken, just out of a relationship, or emotionally unavailable.',
 'advanced', true),

('Using Apps to Avoid Loneliness',
 'processing_loss',
 'You open the dating app every night around 10 PM. Not because you want to meet someone — you realize you are doing it to avoid sitting with the silence in the house.',
 'intermediate', true),

('You Remind Me of My Ex',
 'processing_loss',
 'You are on a second date. She says "You know, you remind me a lot of my ex — and that''s actually a good thing." She seems to mean it as a compliment.',
 'intermediate', true),

('First Date After Divorce',
 'processing_loss',
 'Your first date since your divorce was finalized six weeks ago. She is smart, attractive, easy to talk to. You feel a low-grade guilt you cannot quite explain.',
 'intermediate', true),

('The Rebound Pattern',
 'processing_loss',
 'You have been divorced 18 months and dated four women seriously. Each relationship ends right around the point they start asking for real commitment.',
 'advanced', true),

('Still Wearing the Ring',
 'processing_loss',
 'You took the physical ring off months ago. But on this date — third in two weeks with someone you actually like — you realize something in you is still not fully present.',
 'advanced', true),

('The One That Got Away',
 'processing_loss',
 'You meet someone promising. Good conversation, real chemistry. By the third date you notice you have been grading every moment against a woman you dated five years ago.',
 'advanced', true),

('Afraid to Get Hurt Again',
 'processing_loss',
 'A woman you have been seeing for a month says she is falling for you. You feel it too — and it scares you in a way you did not expect.',
 'advanced', true)

ON CONFLICT (title) DO NOTHING;

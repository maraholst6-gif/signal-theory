# Signal Theory App — MVP Spec v2

**Last Updated:** 2026-03-28  
**Status:** Draft (rewritten to integrate quiz funnel)  
**Replaces:** mvp-spec.md (pre-quiz version)

---

## 1. Core Value Proposition

**Positioning:** Practice tool — a flight simulator for dating.

**One-liner:** "You know your blind spots. Now train them out."

**What it solves that email/book don't:**
- The book teaches the framework (theory)
- The quiz diagnoses your profile (awareness)
- The email gives you 3 practices (self-directed homework)
- **The app gives you reps with feedback** (deliberate practice)

Self-directed practices from the action plan are real but hard to maintain alone. You can't practice reading signals in a vacuum. The app puts you in simulated scenarios, gives you choices, and tells you what you missed — like a flight simulator before you fly the plane.

**The gap it fills:** Knowing your pattern ≠ changing your pattern. The app bridges that gap with structured repetition.

---

## 2. Quiz Integration Strategy

### 2.1 How Data Flows

```
Quiz (web) → Supabase → Email sequence → App onboarding
```

**At quiz completion:**
1. User's profile type, dimension scores, and per-question answers are stored in Supabase
2. A `quiz_profiles` record is created with:
   - `email` (from email capture step)
   - `profile_type` (e.g., "rusty_romantic")
   - `signal_score`, `readiness_score`, `strategy_score`
   - `weak_questions` (array of question IDs they got wrong)
   - `created_at`
3. Email sequence is triggered via Supabase Edge Function → email provider

**At app signup:**
1. User signs up with same email used in quiz
2. App checks `quiz_profiles` table for matching email
3. If match found: skip onboarding quiz, load their profile directly
4. If no match: offer abbreviated 5-question version (not full 15 — respects their time)

### 2.2 What the App Knows About You

- Your profile type (drives scenario recommendations)
- Your 3 dimension scores (signal reading, readiness, strategy)
- Which specific questions you got wrong (targets weak areas)
- Your action plan practices (can reference them in-app)

### 2.3 Profile-Specific Experience

Each profile type gets:
- **Curated scenario queue** — scenarios targeting their weak dimensions first
- **Contextual coaching** — feedback references their specific blind spots
- **Progress framing** — "As a Rusty Romantic, your signal reading started at X. After 20 scenarios, you're at Y."

### 2.4 Data Model Addition

```sql
-- New table (supplements existing Users table)
quiz_profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  profile_type text NOT NULL,
  signal_score int,
  readiness_score int,
  strategy_score int,
  weak_questions jsonb,  -- e.g., ["Q2","Q5","Q11"]
  action_plan_practices jsonb,  -- the 3 practices from their email
  quiz_completed_at timestamptz,
  app_linked_at timestamptz  -- when they connected app account
)
```

---

## 3. Free vs. Paid Tiers

### 3.1 Free Tier

**Who gets it:** Anyone. Quiz takers get a better experience (pre-loaded profile), but anyone can download and use.

**What's included:**
- **Your profile dashboard** — see your type, scores, blind spots (quiz takers only; non-quiz users see "Take the quiz to unlock your profile")
- **10 practice scenarios** — curated to your profile type (or general if no profile)
- **3 real-situation analyses** — paste a real text/situation, get Signal Theory breakdown
- **Action plan reference** — your 3 practices from the email, with check-in prompts

**What it feels like:** Genuinely useful. You can practice, you can analyze a few real situations, you can track your action plan. It's not a demo — it's a starter gym membership.

**How it leads to paid:** After 10 scenarios, you've seen improvement but hit the wall. After 3 analyses, you realize you want this for every confusing interaction. The practices are easier to maintain with the app's structure. Natural desire, not artificial scarcity.

### 3.2 Paid Tier — "Signal Pro"

**Monthly:** $19/mo  
**Annual:** $149/yr (save $79)

*Pricing rationale: $29 was pre-quiz pricing when the app was the first touchpoint. Now users arrive warmed up through book + quiz + email. Lower price = higher conversion from an already-qualified audience. Can always raise later.*

**What's included (everything in free, plus):**

| Feature | Free | Pro |
|---|---|---|
| Practice scenarios | 10 | Unlimited (40+ at launch, new monthly) |
| Real-situation analyses | 3 total | Unlimited |
| Profile dashboard | ✅ | ✅ |
| Action plan tracking | View only | Interactive (check off, journal) |
| Analysis history | Last 3 | Full history |
| Pattern report | ❌ | Monthly summary of your tendencies |
| Scenario difficulty | Basic | Basic → Advanced → Edge cases |
| Custom scenarios | ❌ | Describe a situation, get a practice scenario generated |

**Core unlock:** Unlimited real-situation analyses + the pattern report. The analysis is the killer feature — it's the thing you reach for when you're staring at a confusing text at 11pm. The pattern report is what keeps you subscribed — it shows you your growth (or stagnation) over time.

---

## 4. MVP Feature List (Prioritized)

### Must Ship (V1) — Validates the Funnel

1. **Quiz-aware onboarding** — detect returning quiz user by email, load profile, skip re-assessment
2. **Profile dashboard** — your type, scores, blind spots, action plan practices
3. **Scenario engine** — present scenario → user chooses response → reveal correct answer + Signal Theory explanation
4. **Real-situation analyzer** — paste text/describe situation → AI analysis (same as original spec's chat interface)
5. **Free tier limits** — 10 scenarios, 3 analyses, enforced by Supabase row counts
6. **Paywall** — clean, no dark patterns, after limits hit
7. **Subscription** — RevenueCat (Stripe + Apple + Google billing), monthly + annual
8. **User accounts** — email/password (Google sign-in optional)
9. **Analysis history** — list of past analyses, tap to review

**V1 validates:** "Do quiz-warmed users convert to paid at a rate that justifies the funnel?"

### Should Ship (V1.1) — First Month After Launch

10. **Pattern report** — monthly digest: "You analyzed 12 situations. 8 were texting-related. You over-invested in 5 of them."
11. **Action plan tracking** — interactive checklist with optional journaling
12. **Push notifications** — "You haven't practiced in 3 days. Your Rusty Romantic tendencies are showing. 😏"
13. **Scenario categories** — filter by: texting, in-person, app-based, early dating, established

### Can Wait (V2)

14. **Custom scenario creator** — describe your situation, AI generates a practice scenario from it
15. **Progress dashboard** — visual charts of improvement over time
16. **Advanced difficulty tiers** — basic → intermediate → advanced → edge cases
17. **Share analysis** — send anonymized analysis to a friend
18. **Web version** — mobile-only for MVP
19. **Community features** — none for MVP
20. **Voice input** — none for MVP

---

## 5. Key Screens & User Flows

### 5.1 Onboarding (Quiz User — Primary Path)

```
1. Download app (from email CTA or app store search)
2. "Welcome back" screen:
   "We found your quiz results. Sign in with the email you used."
   [Email field, pre-filled if deep link] [Continue]
3. Email verification (magic link, no password needed first time)
4. Profile loaded:
   "Welcome, [name]. You're a Rusty Romantic."
   [Your scores] [Your blind spots] [Your 3 practices]
   [Start Practicing →]
5. First scenario loads (targeted to their weakest dimension)
```

**Key design choice:** No second quiz. No "tell us about yourself." They already did the work. Respect it.

### 5.2 Onboarding (Cold User — No Quiz)

```
1. Download app
2. "New here? Let's figure out where you are."
   [Quick Assessment (2 min)] or [Skip → General Scenarios]
3. If assessment: 5-question abbreviated quiz → assign profile type
4. If skip: assign "Self-Aware Learner" (most neutral profile), general scenarios
5. Same flow as above from step 4
```

### 5.3 Core Loop: Scenario Practice

```
1. Home screen shows next recommended scenario
   "Scenario 7 of 10 (free)" or "Today's scenario" (paid)
2. Read scenario (1-2 paragraphs describing a dating situation)
3. Choose response (4 options, like the quiz format)
4. Reveal:
   - Correct answer highlighted
   - Why it's correct (Signal Theory reasoning)
   - Why yours was wrong/right
   - Your blind spot connection: "Rusty Romantics often pick C here because..."
5. [Next Scenario] or [Analyze a Real Situation]
```

### 5.4 Core Loop: Real-Situation Analysis

```
1. Tap "Analyze" (bottom nav or from scenario screen)
2. Text input: "Paste a text conversation or describe what happened"
3. [Analyze →]
4. AI response:
   - Signal State: [Positive / Neutral / Negative / Ambiguous]
   - Observable Behaviors: [bullet list]
   - What This Means: [1-2 sentences]
   - Recommended Response: [specific, calibrated]
   - Your Pattern Note: "As a Rusty Romantic, watch for X here"
5. [Save to History] [Try Another]
6. If free tier: "2 analyses remaining" counter
```

### 5.5 Paywall Flow

```
1. User hits limit (11th scenario or 4th analysis)
2. Soft gate (not a wall):
   "You've used your free scenarios. Here's what you've learned so far:"
   [Mini progress summary — X scenarios, Y correct, Z pattern identified]
   "Keep going?"
   [Unlock Signal Pro — $19/mo] [Maybe Later]
3. If "Maybe Later": return to profile dashboard (can still view history, profile, action plan)
4. If unlock: RevenueCat payment flow → immediate access
```

### 5.6 Navigation

```
Bottom tabs:
[Practice]  [Analyze]  [Profile]  [History]

Practice  — scenario queue + category browse
Analyze   — real-situation input
Profile   — dashboard, scores, action plan, settings
History   — past analyses + scenario results
```

---

## 6. Funnel Integration

### The Full Path

```
Book ($9.99 Kindle / $14.99 paperback)
  ↓ "Take the free quiz at signaltheory.com/quiz"
Quiz (free, 3 minutes)
  ↓ "Get your personalized action plan"
Email Capture → Action Plan Email
  ↓ 2-3 month nurture sequence
  ↓ "Ready to practice? The app is your flight simulator."
App Download (free tier)
  ↓ 10 scenarios + 3 analyses
  ↓ Natural desire for more
Signal Pro ($19/mo or $149/yr)
```

### Where Revenue Comes From

**Primary:** App subscriptions (Signal Pro)  
**Secondary:** Book sales (low margin, high volume — functions as marketing)  
**Tertiary:** Nothing else for now. No courses, no coaching, no upsells.

### Conversion Assumptions (Conservative)

| Stage | Volume | Conversion | Result |
|---|---|---|---|
| Book readers | 1,000/mo | 30% take quiz | 300 quiz takers |
| Quiz takers (organic) | 200/mo | — | 200 quiz takers |
| Total quiz takers | 500/mo | 50% give email | 250 emails |
| Email → app download | 250/mo | 30% download app | 75 downloads |
| Free → paid | 75/mo | 15% convert | ~11 new subscribers/mo |
| Monthly revenue (month 6) | ~66 active subscribers | $19/mo | ~$1,254/mo |
| Monthly revenue (month 12) | ~130 active subscribers | $19/mo | ~$2,470/mo |

*These are intentionally conservative. Organic quiz traffic (Reddit, social) could 5-10x the top of funnel.*

### What Makes This Work

1. **Quiz creates self-awareness** — they know their blind spot before they ever see the app
2. **Action plan creates desire** — practices are real but hard alone, app is the easy button
3. **Email sequence builds trust** — 2-3 months of value before any ask
4. **Free tier proves value** — 10 scenarios show the app works, 3 analyses show the AI is legit
5. **Paid tier feels like continuation** — not a gate, just more of what's already working

---

## 7. Tech Stack (Unchanged)

| Layer | Tech | Why |
|---|---|---|
| Frontend | React Native + Expo | Cross-platform, fast iteration |
| Backend | Supabase | Auth, DB, edge functions, realtime |
| AI | OpenAI GPT-4 | Scenario generation, analysis engine |
| Payments | RevenueCat | Handles Stripe + Apple + Google billing |
| Email | TBD (Resend, Loops, or ConvertKit) | Nurture sequence + transactional |
| Analytics | Built-in + Mixpanel (V1.1) | Usage tracking, conversion metrics |

### Data Models (Updated)

```sql
-- Users
users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  profile_type text,        -- from quiz or in-app assessment
  subscription_status text,  -- free / monthly / annual
  scenarios_used int DEFAULT 0,
  analyses_used int DEFAULT 0,
  created_at timestamptz,
  quiz_profile_id uuid REFERENCES quiz_profiles(id)
)

-- Quiz Profiles (see section 2.4)

-- Scenarios (pre-built library)
scenarios (
  id uuid PRIMARY KEY,
  title text,
  body text,
  options jsonb,            -- [{text, is_correct, explanation}]
  correct_signal_state text,
  category text,            -- texting, in-person, app-based, early-dating
  difficulty text,          -- basic, intermediate, advanced
  target_dimensions text[], -- which blind spots this tests
  target_profiles text[],   -- which profiles benefit most
  created_at timestamptz
)

-- Scenario Results
scenario_results (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  scenario_id uuid REFERENCES scenarios(id),
  selected_option int,
  was_correct boolean,
  created_at timestamptz
)

-- Analyses (real-situation)
analyses (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  input_text text,
  signal_state text,
  ai_response jsonb,       -- structured: behaviors, meaning, recommendation, pattern_note
  created_at timestamptz
)
```

---

## 8. OpenAI Prompt (Updated for Profile-Aware Analysis)

### System Prompt

```
You are a Signal Theory coach helping a user analyze a dating interaction.

USER CONTEXT:
- Profile type: {{profile_type}}
- Signal reading ability: {{signal_score}}/10
- Key blind spots: {{blind_spots}}

SIGNAL STATES:
1. POSITIVE (Interest): Observable behavior showing desire for continued interaction
2. NEUTRAL (Information Gathering): Interaction exists but clear interest not demonstrated
3. NEGATIVE (Disinterest): Behavior indicating low interest or avoidance
4. AMBIGUOUS (Mixed/Insufficient): Contradictory or incomplete signals

RULES:
- Base analysis ONLY on observable behavior (not assumptions)
- Cite specific actions, not narratives
- Recommend proportional response (no chasing, no over-investment)
- Include a pattern note specific to their profile type
- Be direct, not preachy. This user is 35-55, divorced, and has a BS detector.

RESPONSE FORMAT:
**Signal State:** [State]
**What I See:** [2-3 specific observable behaviors]
**What It Means:** [1-2 sentences, plain language]
**Your Move:** [Specific, calibrated recommendation]
**Watch For:** [1 sentence connecting to their specific blind spot]
```

---

## 9. Development Plan

### Phase 1: Core App (Week 1)
- Supabase schema + quiz profile ingestion
- Auth flow (magic link, quiz email matching)
- Profile dashboard screen
- Scenario engine (present → choose → reveal)
- 20 scenarios written (covering all 8 profiles)

### Phase 2: Analysis + Payments (Week 2)
- Real-situation analyzer (chat interface + AI)
- Free tier enforcement (counters, soft paywall)
- RevenueCat integration
- Analysis history screen

### Phase 3: Polish + Launch (Week 3)
- 20 more scenarios (40 total)
- Push notifications (basic)
- App store submission (iOS + Android)
- Quiz → app deep linking

### Phase 4: Post-Launch (Month 2)
- Pattern report
- Action plan tracking
- More scenarios
- Iterate based on usage data

---

## 10. Success Metrics (MVP)

| Metric | Target | Why It Matters |
|---|---|---|
| Quiz → app download | 30%+ | Funnel works |
| Free → paid conversion | 10-15% | Value prop is clear |
| D7 retention (free) | 30%+ | Free tier is engaging |
| D30 retention (paid) | 70%+ | Paid tier is essential |
| Scenarios completed / user | 5+ in first week | Content is compelling |
| Analyses used / paid user | 3+ / month | Core feature has pull |

---

## 11. Open Questions

1. **App name:** "Signal Theory" (matches book) or separate brand?
2. **Email provider:** Resend (transactional) + ConvertKit (nurture) or unified?
3. **Scenario authoring:** AI-generated from prompts, or hand-written? (Recommend: hand-written for V1, AI-assisted for V2)
4. **Quiz hosting:** Where does the quiz live? (Standalone page? Embedded in book site? Both?)
5. **Deep linking:** How does the email → app download → profile loading work technically? (Universal links + email matching is simplest)

---

## 12. What Changed From v1

| Area | v1 (Pre-Quiz) | v2 (Post-Quiz) |
|---|---|---|
| Entry point | Cold app store download | Warm: book → quiz → email → app |
| Onboarding | Generic "try 3 free analyses" | Profile-aware: "Welcome back, Rusty Romantic" |
| Free tier | 3 analyses, no context | 10 scenarios + 3 analyses + profile dashboard |
| Pricing | $29/mo | $19/mo (warmer audience = lower price needed) |
| Core feature | Analysis only | Scenarios (practice) + Analysis (real situations) |
| Personalization | None | Profile-specific scenarios, coaching, pattern notes |
| Monetization model | Option D (scenarios free, analysis paid) | Blended: limited scenarios + limited analyses free, unlimited both paid |
| Scenario library | 30 generic | 40+ profile-targeted, difficulty-tiered |

---

*This spec assumes the quiz, email sequence, and book are already built or in progress. The app is the monetization layer — the thing people pay for after the free funnel proves the framework works for them.*

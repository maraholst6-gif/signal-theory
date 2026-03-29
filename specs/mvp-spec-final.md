# Signal Theory App - MVP Specification (Final)

**Last Updated:** 2026-03-28  
**Status:** Ready to build  
**Merged from:** Opus's strategic vision + Gemini's technical implementation

---

## Executive Summary

**What we're building:** A dating practice app that bridges the gap between knowing your blind spots (from the quiz) and actually changing your behavior.

**Core positioning:** Flight simulator for dating — practice scenarios with AI feedback, not just theory.

**Target user:** Divorced men 35-55 who took the quiz, got their profile, and want to improve.

**Revenue model:** Freemium app ($19/mo) at the end of a proven funnel (Book → Quiz → Email → App).

**Build timeline:** 2-3 hours with Claude Code (core features), 1 week total (polish + launch).

---

## 1. Core Value Proposition

### The One-Liner
**"You know your blind spots. Now train them out."**

### What It Solves
- **Book:** Teaches the framework (theory)
- **Quiz:** Diagnoses your profile (awareness)
- **Email:** Gives you 3 practices (self-directed homework)
- **App:** Gives you reps with feedback (deliberate practice)

### Why Someone Pays After Getting Free Content
The action plan from email says: *"Practice escalation timing by noticing 3 situations this week."*

That's real advice. But doing it requires:
- Remembering to do it
- Having situations to practice with
- Getting feedback on whether you did it right

**The app is the gym membership. The action plan is the workout sheet.**

### The Gap It Fills
Knowing your pattern ≠ changing your pattern. Self-directed practices are hard to maintain alone. You can't practice reading signals in a vacuum. The app puts you in simulated scenarios, gives you choices, and tells you what you missed.

---

## 2. The Funnel (How Everything Connects)

```
Book ($9-15)          Quiz (free)           Email (free)           App (freemium)
─────────────────────────────────────────────────────────────────────────────────
Introduces Signal     Diagnoses blind       3 practices +          Practice scenarios
Theory framework      spots across 3        "app as practice       with AI feedback,
                      dimensions →          tool" positioning →    real-world analysis,
                      8 profile types       2-3 month nurture      progress tracking
                                            sequence
```

### Revenue Model
**Primary:** App subscriptions (Signal Pro $19/mo or $149/yr)  
**Secondary:** Book sales (low margin, functions as marketing)  
**No:** Courses, coaching, or other upsells for now

### Conversion Path
1. User discovers book (Amazon, Reddit, referral)
2. Book links to quiz: *"Find out where you stand — take the free quiz"*
3. Quiz gives profile + blind spots → user gives email for action plan
4. Email 1: Action plan (3 practices). Mentions app as *"where you practice these"*
5. Emails 2-8 (over 2-3 months): Teaching moments, scenario teasers, app soft-sells
6. User downloads app → lands in personalized experience (profile already loaded)

### Critical Insight
By the time someone opens the app, they've already:
- Read the framework (or know concepts from quiz)
- Seen their profile and blind spots
- Tried self-directed practices (and probably struggled)
- Received enough email content to trust the approach

**This means the app doesn't teach Signal Theory from scratch. It activates what they already know.**

---

## 3. Quiz Integration Strategy

### How Data Flows

```
Quiz (web) → Supabase → Email sequence → App onboarding
```

**At quiz completion:**
1. Profile type, dimension scores, and wrong answers stored in Supabase
2. `quiz_profiles` record created with email + profile data
3. Email sequence triggered (action plan delivery)

**At app signup:**
1. User signs up with same email used in quiz
2. App checks `quiz_profiles` table for matching email
3. **If match:** Skip onboarding, load profile directly
4. **If no match:** Offer abbreviated 5-question version (respects their time, assigns approximate profile)

### What the App Knows About You
- Profile type (drives scenario recommendations)
- Three dimension scores (signal reading, readiness, strategy)
- Which specific questions you got wrong (targets weak areas)
- Your action plan practices (can reference them)

### Profile-Specific Experience
- **Curated scenario queue:** Scenarios targeting weak dimensions first
- **Contextual coaching:** Feedback references specific blind spots
- **Progress framing:** *"As a Rusty Romantic, your signal reading started at 6/10. After 20 scenarios, you're at 7/10."*

---

## 4. Free vs. Paid Tiers

### Free Tier (Best of Both Specs)

**Who gets it:** Anyone (quiz takers get better experience, but not gated)

**What's included:**
- **Profile dashboard** — See your type, scores, blind spots (quiz takers only; cold users see "Take the quiz to unlock")
- **5 practice scenarios per week** — Refreshes weekly, profile-targeted
- **1 real-world analysis per week** — Paste text/situation, get Signal Theory breakdown
- **Action plan reference** — Your 3 practices from email, with check-in prompts

**Why this balance (Gemini's 10 one-time vs Opus's 5 weekly):**
- **Weekly refresh creates habit formation** (better than one-time 10)
- **5 scenarios/week is enough to learn** but not enough to build consistent practice
- **1 analysis/week works for browsing** but not for active dating (when you need it, you need it NOW)

**How it leads to paid:**
Natural limitation, not artificial scarcity. Free gives you enough to see value but not enough to maintain the practice your action plan requires. When a confusing text arrives on Thursday and you used your analysis on Monday, you're stuck waiting or upgrading.

### Paid Tier: "Signal Pro"

**Pricing:**
- **Monthly:** $19/mo (Gemini's lower price — warmer leads justify it)
- **Annual:** $149/yr (save $79, better LTV)

**Why $19 not $29:** Users arrive warmed up through book + quiz + email. They're already qualified. Lower price = higher conversion from a proven funnel.

**What's included:**

| Feature | Free | Pro |
|---|---|---|
| Practice scenarios | 5/week | Unlimited (40+ at launch, new monthly) |
| Real-world analyses | 1/week | Unlimited |
| Profile dashboard | ✅ | ✅ |
| Action plan tracking | View only | Interactive (check-in, journal) |
| Analysis history | Last 3 | Full history + search |
| **Progress tracking dashboard** | ❌ | **✅ (Opus: Core unlock)** |
| Pattern report | ❌ | ✅ Monthly summary of tendencies |
| Scenario deep-dives | ❌ | ✅ Follow-up questions, branch exploration |

**Core unlock (Opus wins here):** Progress tracking dashboard. This is the feedback loop. Free tier can't see if you're improving. Paid tier shows:
- Accuracy score on scenarios (% where first instinct was correct)
- Which blind spots are shrinking vs. persisting
- Weekly/monthly progress summaries

**Why this is worth $19/mo:** Knowledge is one-time. Skill requires ongoing practice with feedback. That's the subscription value.

---

## 5. MVP Features (What to Build First)

### Must Ship (V1) — Validates the Funnel

**From Gemini (implementation clarity):**

1. **Quiz-aware onboarding**
   - Detect email match → load profile
   - No match → 5-question mini-quiz

2. **Profile dashboard**
   - Type, scores, blind spots
   - Action plan practices (quiz takers)

3. **Scenario practice engine**
   - Display scenario
   - 4 response options
   - Reveal correct + AI explanation
   - Reference user's blind spots

4. **Real-world analysis (chat interface)**
   - Paste text or describe situation
   - AI returns: signal state, behaviors, recommendation, profile insight

5. **Free tier enforcement**
   - 5 scenarios/week + 1 analysis/week
   - Tracked by Supabase counters
   - Weekly reset on Mondays

6. **Paywall (soft)**
   - Appears when limit hit
   - Shows mini progress summary
   - Clean pricing, no dark patterns

7. **Subscription (RevenueCat)**
   - Monthly $19 / Annual $149
   - Stripe + Apple + Google billing

8. **User accounts**
   - Email/password
   - Google sign-in (optional)

9. **Analysis history**
   - Past analyses + scenario results
   - Tap to review

**From Opus (strategic additions):**

10. **Progress tracking dashboard** ← **In V1, not V2**
    - Accuracy score over time
    - Dimension improvement tracking
    - This is the main reason to upgrade

### Nice-to-Have for V1.1 (First Month After Launch)

11. **Pattern report** — Monthly digest of user's tendencies
12. **Action plan interactive tracking** — Check-off + journal
13. **Push notifications** — Gentle practice reminders
14. **Scenario deep-dives** — Follow-up questions after feedback

### Deferred to V2

15. Custom scenario creator
16. Advanced difficulty tiers
17. Web version
18. Community features
19. Voice input
20. Share analysis feature

---

## 6. Key Screens & User Flows

### Onboarding (Quiz User — Primary Path)

```
1. Download app (from email CTA)
2. "Welcome back" screen:
   "We found your quiz results. Sign in with [email]"
3. Email verification (magic link)
4. Profile loaded:
   "Welcome, Jeff. You're a Rusty Romantic."
   [Your scores] [Your blind spots] [Your 3 practices]
   [Start Practicing →]
5. First scenario loads (targets weakest dimension)
```

**Key principle (Opus):** No second quiz. They already did the work. Respect it.

### Core Loop: Scenario Practice

```
1. Home shows next recommended scenario
   "Scenario 3 of 5 this week (free)" or "Today's scenario (pro)"
2. Read scenario (1-2 paragraphs)
3. Choose response (4 options)
4. Reveal:
   - Correct answer + Signal Theory reasoning
   - Your blind spot connection
   - If Pro: accuracy score updated
5. [Next Scenario] or [Analyze Real Situation]
```

### Core Loop: Real-World Analysis

```
1. Tap "Analyze" (bottom nav)
2. Text input: "Paste a conversation or describe what happened"
3. [Analyze →]
4. AI response:
   - Signal State
   - Observable Behaviors
   - What It Means
   - Recommended Response
   - Your Pattern Note (profile-specific)
5. If free: "0 analyses remaining this week" counter
```

### Paywall Flow (Soft Gate)

```
1. User hits limit (6th scenario or 2nd analysis)
2. Soft gate:
   "You've used your free scenarios this week."
   [Mini progress: X scenarios, Y correct]
   "Keep going?"
   [Unlock Signal Pro — $19/mo] [Come Back Monday]
3. If "Come Back Monday": return to dashboard (can view history, profile)
4. If unlock: RevenueCat → immediate access
```

### Navigation

```
Bottom tabs:
[Practice] [Analyze] [Progress] [Profile]

Practice — Scenario queue
Analyze — Real-situation input
Progress — Dashboard (accuracy, improvement charts) [Pro only]
Profile — Scores, action plan, settings
```

---

## 7. Tech Stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | React Native + Expo | Cross-platform, fast iteration |
| Backend | Supabase | Auth, DB, edge functions |
| AI | OpenAI GPT-4 | Scenario feedback + analysis |
| Payments | RevenueCat | Handles all platforms |
| Email | ConvertKit | Nurture sequence |
| Analytics | Supabase + Mixpanel (V1.1) | Usage + conversion tracking |

---

## 8. Data Models

```sql
-- Users
users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  profile_type text,
  subscription_status text,  -- free / monthly / annual
  scenarios_used_week int DEFAULT 0,
  analyses_used_week int DEFAULT 0,
  week_reset_at timestamptz,
  stripe_customer_id text,
  created_at timestamptz,
  quiz_profile_id uuid REFERENCES quiz_profiles(id)
)

-- Quiz Profiles (bridges quiz → app)
quiz_profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  profile_type text,
  signal_score int,
  readiness_score int,
  strategy_score int,
  weak_questions jsonb,
  action_plan_practices jsonb,
  quiz_completed_at timestamptz,
  app_linked_at timestamptz
)

-- Scenarios (pre-built library)
scenarios (
  id uuid PRIMARY KEY,
  title text,
  body text,
  options jsonb,  -- [{text, is_correct, explanation}]
  correct_signal_state text,
  category text,  -- texting, in-person, app-based
  difficulty text,  -- basic, intermediate, advanced
  target_dimensions text[],  -- which blind spots this tests
  target_profiles text[],  -- which profiles benefit most
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

-- Analyses (real-world situations)
analyses (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  input_text text,
  signal_state text,
  ai_response jsonb,
  created_at timestamptz
)
```

---

## 9. OpenAI Prompt (Profile-Aware)

### System Prompt

```
You are a Signal Theory coach helping a user analyze a dating interaction.

USER CONTEXT:
- Profile type: {{profile_type}}
- Signal reading: {{signal_score}}/10
- Blind spots: {{blind_spots}}

SIGNAL STATES:
1. POSITIVE: Observable behavior showing interest
2. NEUTRAL: Interaction exists, clear interest not shown
3. NEGATIVE: Behavior indicating disinterest
4. AMBIGUOUS: Mixed or insufficient data

RULES:
- Base analysis ONLY on observable behavior
- Cite specific actions, not assumptions
- Recommend proportional response (no chasing)
- Include pattern note for their profile
- Direct, not preachy. User is 35-55, divorced, BS detector.

FORMAT:
**Signal State:** [State]
**What I See:** [2-3 specific behaviors]
**What It Means:** [1-2 sentences]
**Your Move:** [Calibrated recommendation]
**Watch For:** [Profile-specific blind spot note]
```

---

## 10. Revenue Projections (Conservative)

### Assumptions
- 1,000 quiz takers/month (book + organic)
- 60% give email (600/month)
- 20% download app within 90 days (120 installs/month)
- 15% convert to paid within 30 days (18 new paid/month at higher rate than Gemini's 10%)

### Month 6
- ~100 active paid users
- 100 × $19 = $1,900/mo
- Costs: ~$300/mo (API + infrastructure)
- **Net: ~$1,600/mo**

### Month 12
- ~200 active paid users (assuming 85% retention)
- 200 × $19 = $3,800/mo
- Costs: ~$600/mo
- **Net: ~$3,200/mo**

**Key metric:** Every 100 paid users = $1,900/mo recurring revenue.

---

## 11. Success Metrics (MVP)

| Metric | Target | What It Validates |
|---|---|---|
| Quiz → app download | 20-30% | Funnel works |
| Free → paid conversion | 15%+ | Value prop clear |
| D7 retention (free) | 30%+ | Free tier engaging |
| D30 retention (paid) | 70%+ | Paid tier essential |
| Scenarios/user (first week) | 5+ | Content compelling |
| Analyses/paid user (monthly) | 3+ | Core feature has pull |

---

## 12. Development Plan

### Week 1: Core App
- Supabase schema + quiz data ingestion
- Auth (email match, magic link)
- Profile dashboard
- Scenario engine
- Write 30 scenarios (all 8 profiles)

### Week 2: Analysis + Payments
- Real-world analysis (AI + chat UI)
- Free tier enforcement (counters)
- RevenueCat integration
- Progress tracking dashboard (Opus: V1, not V2)

### Week 3: Polish + Launch
- 10 more scenarios (40 total)
- Push notifications (basic)
- App store submission
- Quiz → app deep linking

**Build time:** 2-3 hours (Claude Code for core), 1 week total (polish + testing).

---

## 13. Open Questions (Need Jeff's Decision)

1. **App name:** "Signal Theory" (matches book) or something distinct?
2. **Free tier balance:** 5 scenarios + 1 analysis per week — right?
3. **Annual pricing:** $149 (Gemini) or $199? (Lower = more accessible, higher = better LTV)
4. **Dark mode default:** Yes (mature aesthetic) or let user choose?
5. **Email nurture length:** 2 months or 3 months before strong app push?

---

## 14. What Makes This Work

### Why the Quiz-First Funnel is Better
- **Without quiz:** Cold download → "What is this?" → churn in 5 minutes
- **With quiz:** User arrives knowing profile, tried practices, trusts framework → ready to engage

### Why Someone Pays After Free Action Plan
- Action plan is real advice but requires discipline + has no feedback
- App is the gym membership that makes the workout sheet actually work
- Free tier proves it works, paid tier makes it sustainable

### How to Avoid "Quiz Was Better Than App"
- Quiz = moment of insight
- App = tool for change
- App never rehashes what they know, immediately moves to ACTION

### Preventing Free Tier Cannibalization
- 5 scenarios/week + 1 analysis/week is enough to confirm value
- NOT enough to build daily practice or analyze real situations as they arise
- This is a natural gate, not an artificial one

---

## 15. Key Differences From Original Specs

**Merged decisions:**
- **Pricing:** $19/mo (Gemini) — warmer funnel justifies lower price
- **Free tier:** 5 scenarios/week + 1 analysis/week (Opus) — better than one-time 10
- **Progress dashboard:** V1 feature (Opus) — it's the main reason to upgrade
- **Positioning:** Practice tool first (both agreed), analysis second
- **Quiz integration:** Full profile auto-load (both agreed)
- **No dark patterns:** Soft paywall, no urgency tricks (both agreed)

**What changed from pre-quiz v1:**
- Entry point: Cold app download → Warm funnel (book → quiz → email → app)
- Onboarding: Generic → Profile-aware
- Free tier: 3 analyses only → 5 scenarios + 1 analysis (weekly)
- Pricing: $29 → $19 (warmer audience)
- Core feature: Analysis only → Scenarios (practice) + Analysis (real situations)
- Personalization: None → Profile-specific scenarios, coaching, progress

---

**Status:** Ready to build. All strategic decisions made. Implementation details clear.

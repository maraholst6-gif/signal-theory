# Signal Theory App - MVP Specification (Revised)

**Last Updated:** 2026-03-28  
**Status:** Ready to build  
**Previous Version:** Pre-quiz spec (2026-03-24) — replaced to integrate full funnel

---

## Core Value Proposition

**The app is a flight simulator for dating.**

The book teaches the framework. The quiz diagnoses your blind spots. The email gives you a self-directed practice plan. The app is where you actually practice — with AI-powered scenarios that respond to your decisions and show you what you'd miss in the real world.

**What the app solves that the book/email don't:**
- The book is theory. Knowing Signal Theory intellectually ≠ applying it under pressure.
- The email action plan gives you 3 practices, but they require discipline and there's no feedback loop. You do them alone and hope you're improving.
- The app gives you reps with immediate feedback. You make a call on a scenario, the app shows you what you got right, what you missed, and why — using YOUR profile's specific blind spots.

**Positioning:** Practice tool first, analysis tool second. Lead with scenarios, not the "paste your texts" feature. Why: scenarios feel safe (low stakes, private, game-like). Analysis of real situations is high-value but requires more trust — users earn that trust through practice first.

---

## The Funnel (How Everything Connects)

```
Book ($9-15)          Quiz (free)           Email (free)           App (freemium)
─────────────────────────────────────────────────────────────────────────────────
Introduces Signal     Diagnoses blind       3 practices +          Practice scenarios
Theory framework      spots across 3        "app as practice       with AI feedback,
                      dimensions →          tool" positioning →    real-world analysis,
                      8 profile types       2-3 month nurture      progress tracking
                                            sequence
```

**Revenue model:** The app is where the money is. Everything else is acquisition.

- Book: $9-15 (covers its own costs, builds authority, drives to quiz)
- Quiz: Free (lead gen, email capture, profile data)
- Email sequence: Free (nurture, builds trust, plants app desire)
- App: $29/mo or $249/yr (recurring revenue, the actual business)

**Conversion path:**
1. User discovers book (Amazon, Reddit, podcasts, referral)
2. Book links to quiz: "Find out where you stand — take the free quiz"
3. Quiz gives profile + blind spots → user gives email for action plan
4. Email 1: Action plan (3 practices). Mentions app as "where you practice these"
5. Emails 2-8 (over 2-3 months): Teaching moments, scenario teasers, app soft-sells
6. User downloads app → lands in personalized experience (profile already loaded)

**Critical insight:** By the time someone opens the app, they've already:
- Read the framework (or at least know the concepts from the quiz)
- Seen their profile and blind spots
- Tried the self-directed practices (and probably struggled to maintain them)
- Received enough email content to trust the approach

This means the app doesn't need to teach Signal Theory from scratch. It needs to activate what they already know.

---

## Quiz Integration Strategy

### How Profile Data Flows Into the App

**Technical flow:**
1. User completes quiz on web (signaltheoryapp.com/quiz)
2. Results page shows profile + scores
3. Email capture form collects email + stores profile data (Supabase)
4. When user creates app account with same email → profile auto-links
5. If email doesn't match or user skips quiz → app offers quick onboarding quiz (5 questions, not 15)

**What the app knows about quiz users:**
- Profile type (e.g., "Rusty Romantic")
- Three dimension scores (Signal Reading, Emotional Readiness, Dating Strategy)
- Specific blind spots identified from wrong answers
- Which of the 3 action plan practices they received

### How the App Uses Profile Data

**Scenario filtering:** Scenarios are tagged by dimension (signal reading, readiness, strategy) and difficulty. The app prioritizes scenarios that target the user's weak dimensions.

- Rusty Romantic → signal reading scenarios first (texting, app-based, ambiguity)
- Cautious Observer → escalation and first-move scenarios
- Wounded Analyst → readiness scenarios + anxiety-check prompts before signal analysis
- Pattern Repeater → pattern recognition scenarios, "why are you attracted to this" reflections

**Personalized feedback:** AI analysis references the user's profile.

Example for Rusty Romantic:
> "You chose to keep chatting to build comfort. This is your pattern — you read situations well emotionally but hesitate on timing. Your action plan practice #2 (escalation timing) targets exactly this."

**Action plan integration:** The app's practice modules map directly to the 3 practices from their email action plan. The app is literally the tool that makes those practices easier to do.

### Quick Onboarding (Non-Quiz Users)

For users who find the app directly (App Store search, referral, etc.):
- 5-question mini-quiz during onboarding (pulled from the full 15)
- Assigns approximate profile type
- CTA: "Want a full profile? Take the complete quiz" (drives to web)
- This keeps the quiz as the primary funnel entry point

---

## Free Tier

### Who Gets It
Anyone. No gate. Quiz takers AND direct app downloads.

**Why:** The skeptical divorced man won't pay for something he hasn't tried. A free tier that requires signup first feels like a trick. Let them in, let them experience value, then ask for money.

### What's Included (Free Forever)

1. **5 practice scenarios per week** (refreshed weekly from the 30+ scenario library)
   - See the situation
   - Make your choice
   - Get AI-powered feedback with Signal Theory analysis
   - See how your choice maps to your profile's blind spots

2. **1 real-world analysis per week**
   - Paste a text conversation, dating app exchange, or describe a situation
   - Get full Signal Theory breakdown (signal state, observable behaviors, recommended response)
   - This is the "taste" of the killer feature

3. **Profile dashboard (read-only)**
   - Your profile type and dimension scores
   - Which blind spots were identified
   - No progress tracking (that's paid)

4. **Scenario library browse**
   - Can see scenario titles and categories
   - Can't access them beyond the 5/week

### How Free Leads to Paid

**The mechanic:** Free gives you enough to see the value but not enough to build the habit.

- 5 scenarios/week is enough to think "I'm learning something" but not enough to feel like you're making real progress
- 1 real-world analysis/week means when a confusing text exchange happens on Thursday and you've used your analysis on Monday, you're stuck waiting
- No progress tracking means you can't see if you're actually improving

**The psychological trigger:** The practices from the email action plan say "do this daily." The free tier only lets you practice 5x/week. The gap between what you know you should do and what the free tier allows creates organic upgrade desire — not a trick, just a real limitation.

**What we're NOT doing:**
- No countdown timers
- No "UPGRADE NOW" popups
- No degraded experience (free scenarios work fully, just fewer of them)
- No hiding features behind blur/lock icons (tacky, signals desperation)

---

## Paid Tier

### Pricing

- **Monthly:** $29/mo
- **Annual:** $249/yr (save $99 vs monthly)
- **No free trial** — the free tier IS the trial

### What Paid Unlocks

1. **Unlimited practice scenarios**
   - All 30+ scenarios available anytime
   - New scenarios added monthly (8-10 per month)
   - Profile-filtered recommendations ("Based on your blind spots, try these next")

2. **Unlimited real-world analysis**
   - Paste any situation, get instant Signal Theory breakdown
   - No weekly cap
   - Analysis history saved and searchable

3. **Progress tracking dashboard**
   - Track how your responses change over time
   - See which blind spots you're improving on vs. still struggling with
   - "Accuracy score" on scenarios (% where your first instinct was correct)
   - Weekly/monthly progress summaries

4. **Scenario deep-dives**
   - After getting feedback, ask follow-up questions
   - "What if she said X instead?" — explore scenario branches
   - Multi-turn conversation with the AI coach about specific situations

5. **Custom scenario builder** (V1.5 — ship within 30 days of launch)
   - Describe a situation you're facing
   - AI generates a practice scenario based on it
   - Practice your response before doing it for real

### The Core Unlock (What Makes $29/mo Worth It)

**It's not "more scenarios." It's the feedback loop.**

Free tier: You practice 5 times and get 1 analysis. You can't see if you're improving.
Paid tier: You practice daily, analyze real situations as they happen, and watch your accuracy improve over time.

The book gives you knowledge. The app gives you skill. Knowledge is a one-time purchase. Skill requires ongoing practice. That's the $29/mo.

**For the skeptical man's internal calculation:**
- One bad date costs $50-100+ (dinner, drinks, babysitter, emotional energy)
- One misread signal can waste weeks of texting
- $29/mo to avoid those costs is a no-brainer if the app actually works
- The free tier exists to prove it actually works

---

## MVP Features (V1 — What to Build First)

### Must-Have for Launch

1. **Personalized onboarding**
   - Quiz email → auto-link profile
   - Non-quiz users → 5-question mini-quiz
   - Welcome screen: "Welcome back, [Name]. Your profile: [Type]"
   - Brief explanation of what the app does (one screen, not a tutorial)

2. **Scenario practice engine**
   - Display scenario (text on screen, clean readable format)
   - 4 response options (A/B/C/D, styled like the quiz)
   - After choosing: reveal correct answer + AI-generated explanation
   - Explanation references user's profile blind spots
   - Tag system: dimension (signal/readiness/strategy), difficulty, category (texting/in-person/app)

3. **Real-world analysis (chat interface)**
   - Text input: "Paste a situation or describe what happened"
   - AI response with:
     - Signal state (Positive/Neutral/Negative/Ambiguous)
     - Observable behaviors cited
     - Recommended response
     - Framework note (one-sentence Signal Theory principle)
     - Profile-specific insight ("As a [Profile Type], watch out for...")
   - Response time: <10 seconds

4. **Free/paid tier enforcement**
   - Track scenarios used per week (free: 5) and analyses per week (free: 1)
   - Soft paywall: "You've used your free scenarios this week. Upgrade for unlimited practice, or come back Monday."
   - No hard lock — they can still browse, view profile, read past analyses

5. **Subscription management**
   - RevenueCat integration (handles iOS + Android + Stripe)
   - Monthly ($29) and Annual ($249) options
   - Clean paywall screen (no dark patterns, clear value prop)

6. **User accounts**
   - Email/password signup
   - Google sign-in (optional)
   - Profile data persisted in Supabase

7. **Analysis history**
   - List of past analyses and scenario results
   - Tap to review full analysis
   - Basic filtering (by date, by signal state)

8. **30 pre-built scenarios**
   - Already written (see SCENARIOS.md)
   - Tagged by dimension, difficulty, category
   - Each has correct answer, analysis, and profile-specific tips

### Nice-to-Have for V1 (Ship If Time Allows)

- Progress tracking (basic: accuracy % over time)
- Scenario deep-dive follow-ups (multi-turn)
- Push notification: "New scenarios available" (weekly)

---

## Features for V2 (Post-Launch, After Validating Funnel)

1. **Progress tracking dashboard** (full version)
   - Dimension-by-dimension improvement charts
   - Blind spot evolution (are they shrinking?)
   - Weekly insight emails: "This week you improved on X, still struggling with Y"

2. **Custom scenario builder**
   - User describes real situation → AI generates practice version
   - "What would you do?" → practice before doing it for real

3. **Scenario branching**
   - Multi-step scenarios (choose response → see what happens next → choose again)
   - Simulates real conversation flow

4. **Community features** (careful — audience is private by nature)
   - Anonymous scenario submissions ("This happened to me, what would you do?")
   - Not a forum. Not social. Just scenarios.

5. **Web version**
   - Some users prefer desktop for longer analysis sessions
   - Same account, synced data

6. **Coach/therapist referral**
   - For users the app identifies as "not ready" (Eager Rebuilder, Wounded Analyst)
   - Curated list of divorce-specializing coaches
   - Affiliate revenue potential

7. **Voice input**
   - "Tell me what happened" → transcribe → analyze
   - Lower barrier than typing

---

## Tech Stack

**Frontend:**
- React Native + Expo (iOS + Android from one codebase)
- Clean, minimal UI — readability over flash
- Dark mode default (mature aesthetic, not "bro app")

**Backend:**
- Supabase (auth, database, API, real-time)
- Edge Functions for AI orchestration

**AI:**
- OpenAI GPT-4 (scenario feedback + real-world analysis)
- System prompt includes Signal Theory framework + user profile context
- Structured output for consistent response format

**Payments:**
- RevenueCat (manages subscriptions across iOS, Android, Stripe)

**Analytics:**
- Built-in usage tracking (Supabase)
- Key metrics: DAU, scenarios completed, analyses run, conversion rate, churn

**Hosting:**
- Expo EAS for app builds
- Supabase managed hosting for backend

---

## Data Models

### Users Table
```sql
id                  uuid        PRIMARY KEY
email               text        UNIQUE
display_name        text        nullable
profile_type        text        -- e.g., 'rusty_romantic'
signal_score        int         -- from quiz (0-10)
readiness_score     int         -- from quiz (0-10)
strategy_score      int         -- from quiz (0-10)
blind_spots         jsonb       -- specific weak areas from quiz
action_plan_id      text        -- which 3 practices they received
quiz_completed_at   timestamp   -- null if no quiz
subscription_status text        -- 'free', 'monthly', 'annual'
stripe_customer_id  text        nullable
scenarios_used_week int         DEFAULT 0
analyses_used_week  int         DEFAULT 0
week_reset_at       timestamp   -- when to reset weekly counters
created_at          timestamp
updated_at          timestamp
```

### Analyses Table
```sql
id                  uuid        PRIMARY KEY
user_id             uuid        FK → users
input_text          text        -- what user pasted/described
signal_state        text        -- positive/neutral/negative/ambiguous
ai_response         jsonb       -- structured: behaviors, recommendation, framework_note, profile_insight
is_scenario         boolean     -- false = real-world analysis, true = scenario practice
scenario_id         uuid        nullable FK → scenarios
user_choice         text        nullable -- A/B/C/D for scenarios
was_correct         boolean     nullable -- for scenarios
created_at          timestamp
```

### Scenarios Table
```sql
id                  uuid        PRIMARY KEY
title               text
description         text        -- the situation
options             jsonb       -- [{label: "A", text: "...", is_correct: bool, scoring: "..."}]
correct_state       text        -- positive/neutral/negative/ambiguous
explanation         text        -- why the correct answer is correct
profile_tips        jsonb       -- {rusty_romantic: "...", cautious_observer: "...", etc.}
dimension           text        -- signal_reading / readiness / strategy
difficulty          text        -- beginner / intermediate / advanced
category            text        -- texting / in_person / app_based / first_move / escalation
sort_order          int
active              boolean     DEFAULT true
created_at          timestamp
```

### Email Signups Table (bridges quiz → app)
```sql
id                  uuid        PRIMARY KEY
email               text        UNIQUE
profile_type        text
scores              jsonb       -- {signal: X, readiness: Y, strategy: Z}
blind_spots         jsonb
action_plan_sent    boolean     DEFAULT false
app_account_linked  boolean     DEFAULT false
quiz_completed_at   timestamp
created_at          timestamp
```

---

## OpenAI Prompt Structure

### System Prompt (Analysis Mode)
```
You are a Signal Theory dating coach for men re-entering dating after divorce or long relationships.

FRAMEWORK:
Signal Theory classifies interactions into 4 states based on OBSERVABLE BEHAVIOR only:
1. POSITIVE (Interest): Actions showing desire for continued interaction
2. NEUTRAL (Information Gathering): Interaction exists but clear interest not demonstrated
3. NEGATIVE (Disinterest): Behavior indicating low interest or avoidance
4. AMBIGUOUS (Mixed/Insufficient): Contradictory or incomplete signals

RULES:
- Cite ONLY observable behaviors. Never assume intent, feelings, or backstory.
- Recommend proportional response (match signal strength, don't over- or under-invest).
- Never encourage chasing, game-playing, manipulation, or "winning her back" strategies.
- Promote emotional stability and outcome independence.
- Be direct. No hedging. No "it could mean anything." Make a call and explain why.
- Reference the user's profile type and blind spots when relevant.

USER PROFILE:
Type: {{profile_type}}
Signal Reading: {{signal_score}}/10
Emotional Readiness: {{readiness_score}}/10
Dating Strategy: {{strategy_score}}/10
Key blind spots: {{blind_spots}}

FORMAT:
**Signal State:** [Positive/Neutral/Negative/Ambiguous]
**Observable Behaviors:**
- [Specific action 1]
- [Specific action 2]
**What This Means:** [2-3 sentences]
**Recommended Response:** [Specific, actionable]
**Profile Insight:** [1 sentence connecting this to their specific blind spots]
**Framework Note:** [One-sentence Signal Theory principle]
```

### System Prompt (Scenario Feedback Mode)
```
The user just completed a practice scenario. They chose option {{user_choice}}.
The correct answer was {{correct_answer}}.

Provide feedback that:
1. Explains why their choice was {{correct/incorrect}}
2. Connects to their profile blind spots (Type: {{profile_type}})
3. References the Signal Theory principle at play
4. Is encouraging but honest (no "great try!" if they got it wrong)
5. Suggests what to watch for next time

Keep it to 3-4 sentences. Direct, not preachy.
```

---

## UI/UX Design

### Design Philosophy
- **Clean, minimal, content-first** — this is coaching, not entertainment
- **Dark mode default** — professional, mature, easy on eyes at night
- **Typography-forward** — large readable text, generous spacing
- **No gamification cringe** — no badges, no streaks, no leaderboards. These men are 35-55 and will smell patronization instantly.
- **Confidence in restraint** — the less the app tries to look like an app, the more it feels like a tool

### Key Screens

**1. Home / Dashboard**
- Welcome: "Good evening, Jeff. You're a Rusty Romantic."
- Two cards:
  - "Practice a Scenario" (shows count: 3/5 free remaining)
  - "Analyze a Situation" (shows count: 0/1 free remaining)
- Below: "Recent activity" (last 3 analyses/scenarios)
- Bottom nav: Home | Practice | Analyze | Profile

**2. Scenario Practice**
- Clean scenario text at top
- 4 options below (tappable cards, not radio buttons)
- After choosing: slide-up panel with feedback
- "Next Scenario" or "Back to Practice"

**3. Real-World Analysis**
- Large text input area
- Placeholder: "Paste a conversation or describe what happened..."
- "Analyze" button
- Results appear below in structured format
- Save to history automatically

**4. Profile**
- Profile type with brief description
- Three dimension scores (visual bars)
- Blind spots listed
- Link to full quiz results (web)
- Subscription status + manage

**5. Paywall (shown contextually, not as dedicated screen)**
- Appears when free limit hit
- Clean: "You've used your free scenarios this week."
- Value prop: 1-2 sentences, not a wall of text
- Pricing: Monthly / Annual toggle
- "Or come back [Day] for more free practice" (respects their choice)

**6. Settings**
- Account management
- Subscription management
- Notification preferences
- "Retake full quiz" link
- About / Support

---

## Payment Logic

### Free Tier
- 5 scenarios/week + 1 analysis/week
- Requires account creation (email — links to quiz data)
- Weekly counters reset every Monday
- No credit card required

### Monthly ($29/mo)
- Unlimited everything
- Cancel anytime
- 7-day grace period on failed payments

### Annual ($249/yr)
- Same as monthly
- Save $99 vs monthly
- One-time payment, auto-renews

### Subscription Management
- RevenueCat handles all platforms
- Downgrade to free on cancellation (keep account, keep history, lose unlimited)
- No "win-back" discount tricks at cancellation

---

## MVP Success Criteria

### Launch Validation (First 30 Days)
1. **Funnel works:** Quiz → Email → App download measurable end-to-end
2. **Free tier retention:** >30% of free users return in week 2
3. **Conversion rate:** >5% free → paid within 30 days
4. **Engagement:** Average paid user completes >3 scenarios/week
5. **Churn:** <15% monthly churn after month 1
6. **NPS proxy:** Users voluntarily share quiz link (organic referral)

### Technical Requirements
1. App works on iOS + Android
2. AI analysis returns in <10 seconds
3. Scenario practice flow feels snappy (no loading spinners between questions)
4. Payment works without errors
5. Quiz data auto-links on first app login
6. Doesn't crash

---

## Revenue Projections

**Assumptions:**
- 1,000 quiz takers/month (from book + organic + Reddit)
- 60% give email (600 emails/month)
- 20% download app within 90 days (120 app installs/month)
- 10% of app installs convert to paid within 30 days (12 new paid/month)

**Month 1-3 (Launch):**
- 36 paid users × $29 = $1,044/mo
- Costs: ~$200/mo (API + infrastructure)
- Net: ~$844/mo

**Month 6 (Compounding):**
- ~150 paid users (assuming 85% retention) × $29 = $4,350/mo
- Costs: ~$500/mo
- Net: ~$3,850/mo

**Month 12 (Steady State):**
- ~400 paid users × $29 = $11,600/mo
- Costs: ~$1,200/mo
- Net: ~$10,400/mo

**Key metric:** Every 100 paid users = $2,900/mo recurring. Hit 350 paid users and you're at six figures annually.

---

## Cost Estimates

### Monthly Operating Costs (at scale)

| Users | OpenAI API | Supabase | RevenueCat | Email (nurture) | Total |
|-------|-----------|----------|------------|-----------------|-------|
| 100   | $100-200  | $25      | $0*        | $20             | ~$250 |
| 500   | $500-1K   | $50      | $0*        | $50             | ~$600 |
| 2,000 | $2-4K     | $100     | $0*        | $100            | ~$2.5K |

*RevenueCat free tier covers first $2.5K/mo revenue

### One-Time Costs
- Apple Developer: $99/year
- Google Play: $25 one-time
- Domain: already owned (signaltheoryapp.com)
- Total: ~$124

---

## Development Plan

### Phase 1: Core App (Build First — 60-90 min with Claude Code)
1. React Native + Expo scaffold
2. Supabase setup (auth, tables, edge functions)
3. Scenario practice engine (display → choose → feedback)
4. Real-world analysis chat interface
5. Basic profile screen
6. Free tier counter logic

### Phase 2: Integration + Polish (30-60 min)
1. Quiz data auto-linking (email match)
2. Mini onboarding quiz (5 questions)
3. RevenueCat payment integration
4. Paywall screen
5. Analysis history

### Phase 3: Launch Prep (30 min)
1. Seed 30 scenarios into Supabase
2. Test end-to-end flow (quiz → email → app)
3. App store screenshots + description
4. Submit to iOS + Android

**Total estimated build time: 2-3 hours with Claude Code (parallel work)**

---

## Open Questions (Need Jeff's Decision)

1. **App name:** "Signal Theory" (matches book) or something distinct?
2. **Free tier limits:** 5 scenarios + 1 analysis per week — right balance?
3. **Annual pricing:** $249 or $199? ($199 = more accessible, $249 = higher LTV)
4. **Dark mode default:** Yes? Or let user choose?
5. **Email nurture sequence length:** 2 months or 3 months before strong app push?

---

## What Makes This Work (Strategic Notes)

### Why the quiz-first funnel is better than cold app launch

**Without quiz:** User downloads app → "What is this?" → churns in 5 minutes
**With quiz:** User already knows their profile, has tried practices, trusts the framework → opens app ready to engage

The quiz does the selling. The app does the delivering.

### Why someone pays after getting a free action plan

The action plan says: "Practice escalation timing by noticing 3 situations this week where you could have acted sooner."

That's real advice. But doing it requires:
- Remembering to do it
- Having situations to practice with
- Getting feedback on whether you did it right

The app is the gym membership. The action plan is the workout sheet. You can tape the sheet to your fridge, but you'll go to the gym more often if you're paying for it and it's designed to make the workout easy.

### How to avoid "quiz was better than app"

The quiz is a moment of insight. The app is a tool for change. They serve different purposes.

Risk: If the app just shows them their profile again, they'll feel like it's redundant.
Solution: The app references the profile but immediately moves to ACTION — "Here's a scenario that targets your biggest blind spot. Let's practice."

The app should never feel like it's rehashing what they already know. It should feel like the next step.

### Preventing free tier cannibalization

5 scenarios + 1 analysis per week is enough to:
- Confirm the app works
- See improvement on 1-2 blind spots
- Get hooked on the feedback loop

It's NOT enough to:
- Build a consistent daily practice
- Analyze real situations as they arise (dating doesn't wait for Monday)
- Track meaningful progress over time

This is a natural gate, not an artificial one. The paid tier isn't "free tier but more." It's "the app actually works as intended" vs "a limited preview."

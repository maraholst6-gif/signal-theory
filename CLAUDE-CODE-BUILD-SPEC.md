# Signal Theory Web App - Complete Build Instructions for Claude Code

## Overview
Rebuild the Signal Theory web app into a structured dating coach product with 4 core modules: Dashboard, Training Quizzes, Interactive Scenarios, and Real Situation Analysis.

---

## Critical Bugs to Fix

### 1. Token Authorization Bug
**Location:** `index.html` - `analyze()` function
**Problem:** Token is saved to localStorage but NOT being sent in API calls
**Symptoms:** "Invalid token" error when calling `/api/analyze`
**Fix Required:**
```javascript
// Current (broken):
const res = await fetch(`${API}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input_text })
});

// Fixed:
const res = await fetch(`${API}/analyze`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ← ADD THIS
    },
    body: JSON.stringify({ input_text })
});
```
**Apply to ALL API calls** that require authentication.

### 2. Usage Tracking
**Current:** localStorage only (resets per device)
**Problem:** User logs in on phone, sees 0/5 scenarios even though they did 3 on desktop
**Solution:** Backend tracking via database
**Backend endpoints needed:**
- `GET /api/usage` - returns user's weekly usage
- `POST /api/usage/track` - increments counters
**Database table:** Already exists (check backend/src/db/migrations for `user_usage`)

---

## Data Source: Scenarios

**Location:** `scenarios/SCENARIOS.md`
**Count:** 30 scenarios already written
**Categories:** Texting, In-Person, Mixed Signals, Post-Date, Breakups

**Task:** Parse all 30 scenarios and embed them in the new UI
**Categorization needed:**
- Beginner (10 easiest) - Free tier
- Intermediate (10 medium) - Pro tier
- Advanced (10 hardest) - Pro tier

**Use difficulty markers from SCENARIOS.md** or infer from scenario complexity.

---

## Product Structure

### Navigation
**Replace current 3-tab nav (Scenarios/Analyze/Profile) with:**
- **Dashboard (Home)** - Default landing page, shows progress + module cards
- **Training** - Quiz modules (Beginner/Intermediate/Advanced)
- **Scenarios** - Interactive role-play
- **Analyze** - Real situation analysis

**Bottom nav bar:**
```
🏠 Dashboard | 📚 Training | 🎭 Scenarios | 🔍 Analyze
```

---

## Module 1: Dashboard (Home Screen)

**Purpose:** Progress overview + navigation hub

**Layout:**
```
┌─────────────────────────────────────────┐
│  🔥 Signal Theory                       │
│  ────────────────────────────────────   │
│  Welcome back, [User Name]             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📊 Your Progress                       │
│  ────────────────────────────────────   │
│  Training: 40% (12/30 questions)        │
│  Scenarios: 1 free use remaining        │
│  Overall Accuracy: 75%                  │
└─────────────────────────────────────────┘

[Module Card: Training Quizzes]
┌─────────────────────────────────────────┐
│  📚 Training Quizzes                    │
│  ────────────────────────────────────   │
│  Test your signal recognition skills    │
│  through structured scenarios           │
│                                         │
│  ✅ Beginner - FREE (8/10 completed)   │
│  🔒 Intermediate - PRO                  │
│  🔒 Advanced - PRO                      │
│                                         │
│  [Start Training →]                    │
└─────────────────────────────────────────┘

[Module Card: Interactive Scenarios]
┌─────────────────────────────────────────┐
│  🎭 Interactive Scenarios               │
│  ────────────────────────────────────   │
│  Practice live conversations with AI    │
│  feedback in realistic dating situations│
│                                         │
│  Free: 1 scenario/week (0 used)        │
│  Pro: Unlimited                         │
│                                         │
│  [Browse Scenarios →]                  │
│  [🎲 Random Scenario →]                │
└─────────────────────────────────────────┘

[Module Card: Analyze]
┌─────────────────────────────────────────┐
│  🔍 Analyze Real Situations             │
│  ────────────────────────────────────   │
│  Get expert analysis of your actual     │
│  dates, texts, and interactions         │
│                                         │
│  1 of 2 free analyses this week         │
│                                         │
│  [Analyze Now →]                       │
└─────────────────────────────────────────┘
```

**Technical:**
- Load usage stats from backend: `GET /api/usage`
- Calculate progress percentages
- Show which quizzes completed
- Display usage counters

---

## Module 2: Training Quizzes

**Structure:** 3 quiz levels, 10 questions each, using the 30 existing scenarios

### Quiz Selection Screen
```
┌─────────────────────────────────────────┐
│  📚 Training Quizzes                    │
│  ────────────────────────────────────   │
│  Master signal recognition through      │
│  progressively challenging scenarios    │
└─────────────────────────────────────────┘

[Quiz Card: Beginner]
┌─────────────────────────────────────────┐
│  ✅ Beginner Level                      │
│  ────────────────────────────────────   │
│  10 fundamental scenarios               │
│  FREE                                   │
│                                         │
│  Your best: 8/10 (80%)                 │
│  Last completed: 2 days ago             │
│                                         │
│  [Start Quiz →]  [Review Answers]      │
└─────────────────────────────────────────┘

[Quiz Card: Intermediate]
┌─────────────────────────────────────────┐
│  🔒 Intermediate Level                  │
│  ────────────────────────────────────   │
│  10 nuanced scenarios                   │
│  PRO TIER                               │
│                                         │
│  [Unlock with Pro →]                   │
└─────────────────────────────────────────┘

[Quiz Card: Advanced]
┌─────────────────────────────────────────┐
│  🔒 Advanced Level                      │
│  ────────────────────────────────────   │
│  10 subtle, ambiguous scenarios         │
│  PRO TIER                               │
│                                         │
│  [Unlock with Pro →]                   │
└─────────────────────────────────────────┘
```

### Quiz Flow

**Question View:**
```
┌─────────────────────────────────────────┐
│  Beginner Quiz                          │
│  Question 3 of 10                       │
│  ────────────────────────────────────   │
│                                         │
│  Scenario: Delayed Response Pattern    │
│                                         │
│  She used to reply within an hour,      │
│  now takes 6-8 hours. Responses are     │
│  shorter.                               │
│                                         │
│  What does this signal?                 │
│                                         │
│  ○ A) She's just busy lately           │
│  ○ B) This is disengagement            │
│  ○ C) She's testing my patience        │
│  ○ D) Not enough information           │
│                                         │
│  [Submit Answer →]                     │
│                                         │
│  [← Back to Quiz List]                 │
└─────────────────────────────────────────┘
```

**Answer Feedback (Immediate):**
```
┌─────────────────────────────────────────┐
│  ✅ Correct!                            │
│  ────────────────────────────────────   │
│  Signal State: NEGATIVE (Disengagement) │
│                                         │
│  Observable Behaviors:                  │
│  • Response time increased              │
│  • Message length decreased             │
│  • Pattern shifted from engaged to      │
│    minimal                              │
│                                         │
│  Analysis:                              │
│  This is disengagement. Direction       │
│  matters more than absolute timing.     │
│  When energy moves away consistently,   │
│  that's the signal.                     │
│                                         │
│  Framework Principle:                   │
│  Disengagement is directional. Don't    │
│  chase shrinking energy.                │
│                                         │
│  [Next Question →]                     │
└─────────────────────────────────────────┘
```

**Final Results:**
```
┌─────────────────────────────────────────┐
│  📊 Quiz Complete!                      │
│  ────────────────────────────────────   │
│  Your Score: 8/10 (80%)                │
│                                         │
│  Breakdown by Signal Type:              │
│  • Positive: 3/3 ✅                     │
│  • Neutral: 2/4 ⚠️                      │
│  • Negative: 3/3 ✅                     │
│                                         │
│  Weak Area: Neutral Signals             │
│  You over-interpreted neutral situations│
│  as positive. Remember: absence of      │
│  forward movement IS information.       │
│                                         │
│  [Retake Quiz] [Next Level →]          │
│  [Back to Dashboard]                   │
└─────────────────────────────────────────┘
```

**Technical:**
- Store results: `POST /api/quizzes/complete` with score + answers
- Track progress in database
- Allow retakes (show "best score")

---

## Module 3: Interactive Scenarios (Role-Play)

**Purpose:** AI-powered conversation practice with dynamic feedback

### Scenario Selection
```
┌─────────────────────────────────────────┐
│  🎭 Interactive Scenarios               │
│  ────────────────────────────────────   │
│  Practice real conversations with AI    │
│                                         │
│  [🎲 Random Scenario]                   │
│                                         │
│  Or choose by category:                 │
│                                         │
│  • 📱 Texting / Messaging (5)           │
│  • 🍷 Bar / Social (4)                  │
│  • ☕ First Dates (4)                   │
│  • 💬 Mixed Signals (3)                 │
│  • 🔚 Breakups (2)                      │
│                                         │
│  🎨 Create Your Own (PRO only)          │
│                                         │
│  Usage: 0 / 1 free this week            │
└─────────────────────────────────────────┘
```

### Interactive Scenario Flow

**Turn 1:**
```
┌─────────────────────────────────────────┐
│  Hotel Bar Encounter                    │
│  Turn 1 of 5                            │
│  ────────────────────────────────────   │
│                                         │
│  You're sitting at a hotel bar. An      │
│  attractive woman sits down by herself  │
│  two seats away from you.               │
│                                         │
│  What do you do?                        │
│                                         │
│  ○ A) Look over casually, try to meet  │
│       her eye                           │
│  ○ B) Tell bartender her drink is on   │
│       you                               │
│  ○ C) Pat the stool next to you and    │
│       say "You're welcome to join me"  │
│                                         │
│  ○ D) Type your own response:          │
│     ┌───────────────────────────────┐  │
│     │                               │  │
│     └───────────────────────────────┘  │
│                                         │
│  [Submit →]                            │
└─────────────────────────────────────────┘
```

**Turn 2 (AI responds to user choice):**
```
┌─────────────────────────────────────────┐
│  Hotel Bar Encounter                    │
│  Turn 2 of 5                            │
│  ────────────────────────────────────   │
│                                         │
│  You: "You're welcome to join me"      │
│  (patting the bar stool)                │
│                                         │
│  Her Response:                          │
│  She rolls her eyes and says "No       │
│  thank you," then turns her body       │
│  away from you toward the bartender.   │
│                                         │
│  What do you do next?                   │
│                                         │
│  ○ A) Apologize - "Sorry, just being   │
│       friendly"                         │
│  ○ B) Leave her alone, focus on your   │
│       drink                             │
│  ○ C) Try again with the bartender -   │
│       "What's good here?"               │
│                                         │
│  ○ D) Type your own response:          │
│     ┌───────────────────────────────┐  │
│     │                               │  │
│     └───────────────────────────────┘  │
│                                         │
│  [Submit →]                            │
└─────────────────────────────────────────┘
```

**Continues for 5 turns, then:**

**Final Feedback:**
```
┌─────────────────────────────────────────┐
│  📊 Scenario Analysis                   │
│  ────────────────────────────────────   │
│  Signal State: NEGATIVE                 │
│                                         │
│  What I Saw:                            │
│  • Turn 1: You escalated too quickly   │
│    (invited without rapport)            │
│  • Her reaction: Eye roll + body turn   │
│    (clear negative)                     │
│  • Turn 2: You backed off gracefully    │
│    (good recovery)                      │
│  • Turns 3-5: Neutral conversation,     │
│    she stayed disengaged               │
│                                         │
│  Analysis:                              │
│  You skipped observational steps.       │
│  Option A (casual eye contact) would    │
│  have let you gauge interest before     │
│  escalating. Patting the stool assumes  │
│  interest that wasn't demonstrated.     │
│                                         │
│  Better Approach:                       │
│  Start subtle → observe response →      │
│  escalate only if signals are positive  │
│                                         │
│  Signal Theory Principle:               │
│  Don't create resistance by assuming    │
│  interest. Let behavior show you the    │
│  answer first.                          │
│                                         │
│  [Try Another Scenario]                │
│  [Back to Dashboard]                   │
└─────────────────────────────────────────┘
```

**Backend API Required:**
```
POST /api/scenarios/interactive
{
  "scenario_id": "hotel-bar",
  "turn": 1,
  "user_action": "option_c",
  "conversation_history": []
}

Response:
{
  "turn": 2,
  "ai_response": "She rolls her eyes and says...",
  "is_complete": false,
  "options": [
    {"id": "a", "text": "Apologize..."},
    {"id": "b", "text": "Leave her alone..."},
    {"id": "c", "text": "Try again..."}
  ]
}
```

**For MVP:** Can be client-side AI calls if backend not ready
**For Production:** Must be backend to secure API keys

---

## Module 4: Analyze (Keep Existing)

**Current module works, just needs:**
- ✅ Token bug fix (Authorization header)
- ✅ Backend usage tracking
- ✅ Results already formatted well

**No other changes needed.**

---

## Styling & Design

**Keep current theme:**
- Purple gradient (`#667eea` to `#764ba2`)
- Card-based layout
- White backgrounds for content
- Mobile-first responsive design
- Current button styles
- Current spacing/padding

**Navigation:**
- Bottom tab bar (current style is good)
- Active tab highlighted
- Smooth transitions

**Typography:**
- Current fonts work well
- Keep emoji icons (🔥, 📚, 🎭, 🔍, etc.)

---

## Freemium Gates

### Free Tier
- Beginner Training Quiz (10 questions)
- 1 Interactive Scenario per week
- 2 Analyses per week

### Pro Tier ($19/mo)
- All 3 Training Quizzes
- Unlimited Interactive Scenarios
- Create Your Own Scenario
- Unlimited Analyses

**Implementation:**
- Show "🔒 PRO" badges on locked content
- When user clicks locked item → Upgrade modal:
```
┌─────────────────────────────────────────┐
│  Unlock Signal Theory Pro               │
│  ────────────────────────────────────   │
│  • All 30 training scenarios            │
│  • Unlimited practice scenarios         │
│  • Unlimited real-world analysis        │
│  • Create custom scenarios              │
│                                         │
│  $19/month or $149/year                │
│                                         │
│  [Upgrade Now →]                       │
│  [Maybe Later]                         │
└─────────────────────────────────────────┘
```

For now: Just show the modal, don't actually process payment (Stripe integration later)

---

## Technical Requirements

### File Structure
**Update:** `index.html` (single-file app for now)
**Keep:**
- All current auth code (signup/login/logout)
- localStorage for token persistence
- Current styling approach (inline CSS)

### Data Embedded in Frontend
1. All 30 scenarios (parsed from SCENARIOS.md)
2. Categorized by difficulty (Beginner/Intermediate/Advanced)
3. Pre-written options for each scenario
4. Correct answers + feedback

### Backend API Calls Required
```javascript
// Usage tracking
GET  /api/usage → {scenarios_done, analyses_done, week_start}
POST /api/usage/track → {type: 'scenario'|'analysis'}

// Quiz results
POST /api/quizzes/complete → {level, score, answers}
GET  /api/quizzes/history → [{level, score, completed_at}]

// Interactive scenarios (for later - can simulate client-side for now)
POST /api/scenarios/interactive → {scenario_id, turn, action}

// Analysis (already exists - just fix token)
POST /api/analyze → {input_text}
```

### localStorage Structure
```javascript
{
  "signal_theory_token": "jwt_token_here",
  "usage": {
    "week_start": "2026-03-29",
    "scenarios_done": 3,
    "analyses_done": 1
  },
  "quiz_progress": {
    "beginner": {"completed": true, "score": 8, "total": 10},
    "intermediate": {"completed": false},
    "advanced": {"completed": false}
  }
}
```

**For Phase 1:** Use localStorage for usage tracking (will migrate to backend later)

---

## Success Criteria

**Must work:**
1. ✅ Token persists and authorizes API calls
2. ✅ 4-module navigation (Dashboard, Training, Scenarios, Analyze)
3. ✅ Dashboard shows progress overview
4. ✅ Training Quizzes: Can complete Beginner quiz, see results
5. ✅ Scenarios: Can browse (interactive AI scenarios can be placeholder for now)
6. ✅ Analyze: Fixed token, returns AI results
7. ✅ Usage tracking syncs (even if just localStorage for now)
8. ✅ Freemium gates visible (don't need to enforce yet)
9. ✅ Mobile-friendly (primary use case)

**Nice to have:**
- Quiz retakes
- Answer review
- Better loading states
- Error handling

---

## Build Notes

**Estimated time:** 30-40 minutes for complete rebuild
**Output:** Single updated `index.html` file
**Testing:** Must test token bug fix + navigation + quiz flow before deploying

**All 30 scenarios are in:** `scenarios/SCENARIOS.md`
**Parse them and categorize** by difficulty (use your judgment or look for difficulty markers in the file)

**Interactive scenarios with AI** can be simulated client-side initially:
- Hard-code 2-3 response options per scenario
- Use Claude API directly from frontend for "Something else" option
- Full backend integration can come later

---

## Admin Panel Requirements

**Build a developer/admin portal for managing AI coaching logic:**

### Admin Page Route: `/admin`
**Auth:** Requires `is_admin` flag on user account

**Database changes:**
```sql
-- Add admin flag to users
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- AI prompt versioning table
CREATE TABLE ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL, -- 'scenario_coach'
  version INT NOT NULL,
  prompt_text TEXT NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Set initial placeholder prompt
INSERT INTO ai_prompts (name, version, prompt_text, active) VALUES (
  'scenario_coach',
  1,
  'You are a Signal Theory dating coach. [Placeholder - will be refined later]',
  TRUE
);
```

**Admin UI:**
```
┌─────────────────────────────────────────┐
│  🛠️ Signal Theory Admin                │
│  ────────────────────────────────────   │
│  Scenario Coaching Prompt               │
│  ────────────────────────────────────   │
│  Current Version: 1 (Active)            │
│  Last Updated: 2026-03-29               │
│                                         │
│  [Edit Prompt] [View History]          │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ [Prompt text area - editable]     │ │
│  │                                   │ │
│  │ [Full coaching instructions]      │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [💾 Save New Version]                 │
│  [🧪 Test with Sample Scenario]        │
│                                         │
│  ────────────────────────────────────   │
│                                         │
│  📊 Usage Statistics                    │
│  Total Users: 12                        │
│  Active This Week: 8                    │
│  Scenarios Completed: 47                │
│  Avg Quiz Score: 73%                    │
│                                         │
│  [Export Data] [View Logs]             │
└─────────────────────────────────────────┘
```

**Backend API:**
```javascript
// Get active prompt
GET /api/prompts/scenario-coach → {version, prompt_text, created_at}

// Update prompt (admin only)
PUT /api/admin/prompts/scenario-coach
Body: {prompt_text: "..."}
Response: {version: 2, saved: true}

// View prompt history (admin only)
GET /api/admin/prompts/history → [{version, prompt_text, active, created_at}]
```

**Usage:** Interactive scenario engine loads prompt from database, uses it for all AI responses. We can refine coaching logic without touching code.

---

## Implementation Notes for Claude Code

**For Interactive Scenarios:**
- Use placeholder coaching prompt initially: "You are a Signal Theory dating coach. Respond realistically to user actions in dating scenarios. After 5 turns, provide analysis grounded in behavioral observation."
- Build full scenario engine (5-turn conversation, dynamic AI responses)
- Store prompt in database (`ai_prompts` table)
- Load from database when generating scenario responses
- We'll refine the actual coaching instructions after analyzing the Signal Theory book

**Admin access:**
- For now, hardcode Jeff's email as admin OR add manual SQL command to set `is_admin = TRUE`
- Admin check middleware: `req.user.is_admin`

---

## Build Priority Order

1. **Fix token bug** (critical - blocks everything)
2. **Backend usage tracking** (critical - multi-device sync)
3. **Database schema updates** (users.is_admin, user_usage, quiz_results, scenario_history, ai_prompts)
4. **Frontend rebuild:**
   - Dashboard (home screen)
   - Training Quizzes (3 levels, 10 questions each)
   - Interactive Scenarios (5-turn AI conversation)
   - Analyze (keep existing, just fix token)
5. **Admin panel** (prompt management + usage stats)

**Estimated build time:** 60-90 minutes for complete rebuild

---

Ready to proceed!

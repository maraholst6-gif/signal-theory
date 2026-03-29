# Signal Theory App - Complete Product Rebuild Spec

## Vision
Transform the current basic web app into a **flight simulator for dating** - structured training + live practice with AI feedback, all grounded in Signal Theory framework.

---

## Critical Issues to Fix First

### 1. Token Bug (Blocking)
- Analysis API calls fail with "Invalid token"
- Token saved to localStorage but not included in Authorization header
- **Fix:** Ensure `analyze()` function reads token and sends as `Bearer ${token}`

### 2. Usage Tracking (Blocking for Multi-Device)
- Currently: localStorage only (per-device, resets on new device)
- **Needed:** Backend tracking per user account
  - Track in database: `user_usage` table
  - Weekly reset logic (Sunday midnight or similar)
  - Sync across all devices
  - API endpoints: `GET /api/usage`, `POST /api/usage/increment`

---

## New Product Structure

### Landing Page / Dashboard
**What user sees when they log in:**

```
┌─────────────────────────────────────────┐
│  🎯 Your Progress                       │
│  ────────────────────────────────────   │
│  Training: 40% complete (12/30)         │
│  Scenarios: 1 free remaining this week  │
│  Accuracy: 75% (9 correct / 12 total)   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📚 Training Quizzes                    │
│  ────────────────────────────────────   │
│  Master signal recognition through      │
│  progressively challenging scenarios    │
│                                         │
│  ✅ Beginner (10 questions) - FREE     │
│     Score: 8/10                         │
│                                         │
│  🔒 Intermediate (10 questions) - PRO  │
│                                         │
│  🔒 Advanced (10 questions) - PRO      │
│                                         │
│  [Start Training →]                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🎭 Interactive Scenarios               │
│  ────────────────────────────────────   │
│  Live role-play with AI feedback.       │
│  Practice real conversations.           │
│                                         │
│  Free: 1 scenario per week             │
│  Pro: Unlimited                         │
│                                         │
│  [Browse Scenarios →]                  │
│  [Random Scenario →]                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🔍 Analyze Real Situations             │
│  ────────────────────────────────────   │
│  Get AI analysis of your actual dates,  │
│  texts, and interactions.               │
│                                         │
│  [Analyze Now →]                       │
└─────────────────────────────────────────┘
```

---

## Module 1: Training Quizzes

**Purpose:** Test and improve signal recognition with structured feedback

**Structure:**
- 30 existing scenarios split into 3 quizzes
- 10 questions each
- Progressive difficulty
- Score + detailed feedback at end

### Beginner Quiz (FREE)
- 10 easiest scenarios
- Multiple choice (4 options)
- Immediate feedback after each answer
- Final score + summary:
  - "You got 8/10 correct (80%)"
  - Breakdown by signal type (Positive: 3/3, Neutral: 2/4, Negative: 3/3)
  - Areas to improve

### Intermediate Quiz (PRO)
- Next 10 scenarios
- Slightly ambiguous situations
- Same format

### Advanced Quiz (PRO)
- Hardest 10 scenarios
- Ambiguous, subtle signals
- Requires deeper framework understanding

### Quiz Flow
```
1. Dashboard → "Start Training"
2. Select quiz level (Beginner FREE / Intermediate PRO / Advanced PRO)
3. Question 1 of 10
   - Scenario description
   - 4 choices
   - Select answer → [Submit]
4. Result page for Q1
   - ✅ Correct! or ❌ Incorrect
   - Signal State revealed
   - Explanation (What I See, What It Means)
   - [Next Question →]
5. Repeat for all 10
6. Final Results Page
   - Score: 8/10 (80%)
   - Accuracy by signal type
   - Weak areas highlighted
   - [Retake Quiz] [Back to Dashboard]
```

**Backend Needs:**
- Track quiz completions per user
- Store scores in `quiz_results` table
- Calculate accuracy trends over time

---

## Module 2: Interactive Scenarios (Role-Play)

**Purpose:** Flight simulator experience - live practice with dynamic AI responses

**Freemium:**
- Free: 1 scenario per week
- Pro: Unlimited scenarios + "Create Your Own"

### Scenario Selection
```
┌─────────────────────────────────────────┐
│  🎭 Interactive Scenarios               │
│  ────────────────────────────────────   │
│  [🎲 Random Scenario]                   │
│                                         │
│  Or choose from:                        │
│                                         │
│  📱 Texting / Messaging                 │
│  🍷 Bar / Social Situations             │
│  ☕ Coffee / First Dates                │
│  💬 Mixed Signals                       │
│  🔚 Breakups / Reconciliation           │
│                                         │
│  🎨 Create Your Own (PRO)               │
└─────────────────────────────────────────┘
```

### Scenario Experience

**Turn 1:**
```
┌─────────────────────────────────────────┐
│  Hotel Bar Encounter                    │
│  ────────────────────────────────────   │
│  You're sitting at a hotel bar.         │
│  An attractive woman sits down by       │
│  herself two seats away from you.       │
│                                         │
│  What do you do?                        │
│                                         │
│  ○ A) Look over casually, trying to    │
│       meet her eye                      │
│  ○ B) Tell the bartender her drink     │
│       is on you                         │
│  ○ C) Pat the bar stool next to you    │
│       and say "You're welcome to join" │
│  ○ D) Something else:                  │
│     ┌─────────────────────────────┐   │
│     │ [Type your response...]     │   │
│     └─────────────────────────────┘   │
│                                         │
│  [Submit →]                            │
└─────────────────────────────────────────┘
```

**Turn 2 (After user selects C):**
```
┌─────────────────────────────────────────┐
│  Hotel Bar Encounter (Turn 2/5)        │
│  ────────────────────────────────────   │
│  You: "You're welcome to join me"      │
│  (patting the bar stool)                │
│                                         │
│  Her Response:                          │
│  She rolls her eyes and says "No       │
│  thank you," then turns her body       │
│  away from you, facing the bartender.  │
│                                         │
│  What do you do next?                   │
│                                         │
│  ○ A) Apologize and explain you were   │
│       just being friendly               │
│  ○ B) Leave her alone and focus on     │
│       your drink                        │
│  ○ C) Try a different approach by      │
│       asking the bartender about drinks │
│  ○ D) Something else:                  │
│     ┌─────────────────────────────┐   │
│     │ [Type your response...]     │   │
│     └─────────────────────────────┘   │
│                                         │
│  [Submit →]                            │
└─────────────────────────────────────────┘
```

**After 5 Turns - Final Feedback:**
```
┌─────────────────────────────────────────┐
│  📊 Scenario Complete                   │
│  ────────────────────────────────────   │
│  Signal State: NEGATIVE                 │
│                                         │
│  What I Saw:                            │
│  • Eye roll (clear negative signal)     │
│  • Body turned away (disengagement)     │
│  • Verbal rejection ("No thank you")    │
│  • After you apologized, she softened   │
│    slightly (neutral recovery)          │
│                                         │
│  Analysis:                              │
│  Your opening (Turn 1) was too forward  │
│  without establishing any rapport first.│
│  Patting the stool assumes interest that│
│  wasn't demonstrated. Her negative      │
│  response was clear and direct.         │
│                                         │
│  However, your recovery in Turn 2 was   │
│  good - you backed off gracefully.      │
│                                         │
│  Better Approach:                       │
│  Start with non-committal observation   │
│  (Option A - casual eye contact).       │
│  Look for responsive signals before     │
│  escalating to an invitation.           │
│                                         │
│  Key Lesson:                            │
│  Don't skip steps. Signal recognition   │
│  requires observing actual behavior     │
│  before acting. Assumptions create      │
│  resistance.                            │
│                                         │
│  [Try Another Scenario]                │
│  [Back to Dashboard]                   │
└─────────────────────────────────────────┘
```

### AI Requirements for Scenarios

**AI needs to:**
1. Play the role of the other person (woman, date, ex, etc.)
2. React dynamically to user choices (not pre-scripted)
3. Show realistic behavior changes based on actions
4. End after 5 turns OR natural conclusion
5. Provide Signal Theory-framed analysis:
   - Observable behaviors
   - Signal state classification
   - What user did right/wrong
   - Better alternatives
   - Framework principles demonstrated

**AI System Prompt (needs to be created):**
- Synthesize Signal Theory book principles
- Behavioral observation focus (not interpretation)
- Positive/Neutral/Negative/Ambiguous classification
- Realistic human responses (not idealized)

**Backend Needs:**
- New API endpoint: `POST /api/scenarios/interactive`
- Maintains conversation state across turns
- Stores scenario history per user
- Tracks usage (1 free/week, unlimited pro)

---

## Module 3: Analyze Real Situations

**Current module - keep as is, just fix token bug**

Purpose: Paste real text conversations, date experiences, etc. → Get AI breakdown

**No changes needed** except:
- Fix token authorization
- Backend usage tracking
- Better formatting (already done)

---

## Freemium Model

### Free Tier
- Beginner Training Quiz (10 questions)
- 1 Interactive Scenario per week
- 2 Real Situation Analyses per week
- View past results

### Pro Tier ($19/mo)
- All 3 Training Quizzes (30 questions total)
- Unlimited Interactive Scenarios
- "Create Your Own Scenario" option
- Unlimited Real Situation Analyses
- Progress tracking dashboard

---

## Technical Implementation Plan

### Phase 1: Fix Critical Bugs (Now)
1. Token authorization in analyze() function
2. Backend usage tracking endpoints
3. Database schema updates:
   ```sql
   CREATE TABLE user_usage (
     user_id UUID PRIMARY KEY,
     week_start DATE,
     scenarios_completed INT DEFAULT 0,
     analyses_done INT DEFAULT 0,
     last_reset TIMESTAMP
   );
   
   CREATE TABLE quiz_results (
     id UUID PRIMARY KEY,
     user_id UUID,
     quiz_level VARCHAR(20), -- beginner/intermediate/advanced
     score INT,
     total_questions INT,
     completed_at TIMESTAMP
   );
   
   CREATE TABLE scenario_history (
     id UUID PRIMARY KEY,
     user_id UUID,
     scenario_id VARCHAR(50),
     turns JSONB, -- stores conversation
     feedback TEXT,
     completed_at TIMESTAMP
   );
   ```

### Phase 2: Restructure Frontend (Next)
1. New dashboard view
2. Split scenarios into Training Quizzes
3. Add Interactive Scenarios module
4. Keep Analyze module as-is

### Phase 3: AI Scenario Engine (After Phase 2)
1. Create Signal Theory system prompt
2. Build interactive scenario API
3. Implement turn-based conversation
4. Generate dynamic feedback

### Phase 4: Polish (Final)
1. Stripe integration for Pro tier
2. Weekly reset cron job
3. Progress dashboard charts
4. Mobile optimization

---

## Next Steps

1. **Fix token bug** (5 min)
2. **Backend usage tracking** (30 min)
3. **Create comprehensive rebuild spec for Claude Code** with:
   - Dashboard layout
   - Training Quiz flow
   - Interactive Scenario UX
   - All JSON data structures
4. **Build Phase 2** (30-45 min with Claude Code)
5. **Test end-to-end**
6. **Build Phase 3** (AI scenario engine)

---

## Success Criteria

**Must have:**
- ✅ Multi-device usage tracking
- ✅ 3-tier training quiz system
- ✅ Interactive scenario role-play (5 turns)
- ✅ AI feedback grounded in Signal Theory
- ✅ Dashboard with progress metrics
- ✅ Freemium gates enforced
- ✅ All features work on mobile

**This will be a genuinely unique and valuable product - nothing like it exists in dating coaching.**

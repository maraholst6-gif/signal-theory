# Signal Theory App - Framework-Aligned Build Spec

**Last Updated:** 2026-03-29 4:59 PM EDT  
**Status:** Ready for implementation  
**Purpose:** Rebuild app components to align with Signal Theory framework

---

## Core Framework Principles (Master Reference)

**The Four Signal States:**
1. **Interest** - Reciprocal effort, consistent forward movement
2. **Uncertainty** - Evaluating but hasn't decided, inconsistent patterns
3. **Comfort** - Safe/familiar but no romantic pull
4. **Disengagement** - Moving away, fading energy

**Core Rules:**
- **Signals Over Stories** - Trust behavior, not explanations
- **Timing Over Intent** - When you act matters more than why
- **Calibration Over Performance** - Match energy, don't exceed it
- **The Master Question** - "Am I aligned with the signal or trying to change it?"

**Key Insight:** You don't fix signals. You respond to them.

---

## App Architecture (3 Integrated Features)

### 1. Training Quizzes
**Purpose:** Teach signal state recognition + response calibration  
**Format:** Multiple choice scenarios with instant feedback  
**Outcome:** User learns to identify states and avoid common mistakes

### 2. Interactive Scenarios (Future Build)
**Purpose:** AI-powered conversation practice  
**Format:** Multi-turn roleplay with dynamic responses  
**Outcome:** User practices calibrated responses in realistic situations

### 3. Analyze Tool
**Purpose:** Real-time diagnosis of user's actual situations  
**Format:** Text input → AI analysis with framework-based feedback  
**Outcome:** User applies framework to their real dating life

---

## Part 1: Training Quizzes (Current Priority)

### Current State Audit

**What works:**
- ✅ Basic quiz UI (question display, option selection, navigation)
- ✅ Final results screen with score breakdown
- ✅ Progress tracking by signal state
- ✅ Mobile-first responsive design

**What's broken/missing:**
- ❌ Only 3 test questions (needs 30+ for 3 difficulty levels)
- ❌ Questions don't map to framework states explicitly
- ❌ Feedback doesn't teach WHY answer is right/wrong
- ❌ No "correct answer shown" when user gets it wrong
- ❌ Desktop scroll bug (can't see feedback header)
- ❌ No cross-references to framework principles

### Quiz Structure (Redesign)

**3 Quiz Levels:**

**Beginner (FREE) - 10 questions**
- Focus: Basic signal state recognition
- Difficulty: Clear/obvious signals
- Example: "She texts back immediately and suggests plans" → Interest

**Intermediate (PRO) - 10 questions**
- Focus: Nuanced state identification + response selection
- Difficulty: Mixed signals, uncertainty vs comfort
- Example: "Warm in person, slow texts after" → Uncertainty

**Advanced (PRO) - 10 questions**
- Focus: Complex situations, common mistake avoidance
- Difficulty: Multiple states in sequence, calibration decisions
- Example: "3 weeks of comfort, should you escalate?" → Timing over Intent

### Question Template (MANDATORY STRUCTURE)

Every question must include:

```json
{
  "id": "q-beginner-01",
  "level": "beginner",
  "signalState": "Interest",
  "scenario": {
    "title": "Consistent Follow-Through",
    "situation": "You've been on two dates with Emma. She texts you first sometimes, suggests specific days to meet, and follows through on plans without vagueness. Energy feels easy and reciprocal.",
    "question": "What signal state is Emma showing?"
  },
  "options": [
    {
      "id": "a",
      "text": "Interest",
      "correct": true,
      "explanation": "✅ Emma is showing Interest. Observable behaviors: reciprocal initiation, specific plan suggestions, consistent follow-through. These cost her something (time, effort, prioritization), which signals genuine interest."
    },
    {
      "id": "b",
      "text": "Uncertainty",
      "correct": false,
      "explanation": "❌ Uncertainty would show inconsistent patterns: warm but distant after, vague about plans. Emma's behavior is consistent and forward-moving."
    },
    {
      "id": "c",
      "text": "Comfort",
      "correct": false,
      "explanation": "❌ Comfort would show easy connection without romantic direction. Emma is actively moving things forward with specific plans."
    },
    {
      "id": "d",
      "text": "Disengagement",
      "correct": false,
      "explanation": "❌ Disengagement would show fading energy, slower responses, plans falling through. Emma is doing the opposite."
    }
  ],
  "frameworkPrinciple": "Signals Over Stories",
  "teachingPoint": "Interest is not intensity—it's consistency. Look for behaviors that cost her something (time, effort, prioritization). Emma is moving toward you in observable ways.",
  "commonMistake": "Mistaking intensity for interest. A woman can text constantly but never make plans (Comfort). Emma does both—that's Interest.",
  "calibratedResponse": "Stay steady, match her investment, don't accelerate. Let momentum continue naturally.",
  "relatedScenarios": ["scenario-interest-01", "scenario-pacing-02"]
}
```

### Feedback Display (UI Requirements)

**When user answers:**

1. **Scroll to top immediately** (`window.scrollTo(0, 0)`)
2. **Show correct answer badge** (green checkmark or red X)
3. **Display signal state** with color-coded badge:
   - Interest = Green
   - Uncertainty = Yellow
   - Comfort = Blue
   - Disengagement = Red
4. **Show their selected answer explanation** (why it's right or wrong)
5. **Show correct answer explanation** (if they got it wrong)
6. **Display teaching point** (framework principle reinforced)
7. **Show common mistake** (what most people do wrong)
8. **Show calibrated response** (what to do in this state)

**UI Wireframe:**

```
┌─────────────────────────────────────┐
│  ✅ CORRECT! / ❌ INCORRECT         │
│                                     │
│  Signal State: [Interest] 🟢       │
│                                     │
│  Your Answer:                       │
│  [Explanation of their choice]      │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Why This Matters:                  │
│  [Teaching point]                   │
│                                     │
│  Common Mistake:                    │
│  [What most people do wrong]        │
│                                     │
│  Calibrated Response:               │
│  [What to do in this state]         │
│                                     │
│  Framework Principle:               │
│  📖 Signals Over Stories            │
│                                     │
│  [Next Question →]                  │
└─────────────────────────────────────┘
```

### Quiz Content Requirements

**10 Beginner Questions - Signal State Recognition**

Must cover:
- 2-3 clear Interest examples (reciprocal, consistent)
- 2-3 clear Disengagement examples (fading, plans falling through)
- 2-3 Uncertainty examples (warm but inconsistent)
- 2-3 Comfort examples (connection without direction)

**10 Intermediate Questions - Response Calibration**

Must cover:
- When to escalate vs hold steady (Interest → timing)
- When to give space vs pursue (Uncertainty → don't push)
- When to step back vs linger (Comfort → recognize plateau)
- When to accept direction vs try to fix (Disengagement → preserve dignity)

**10 Advanced Questions - Common Mistakes**

Must cover:
- Over-investment scenarios (3 weeks texting, no date)
- Pushing uncertainty (double-texting, explaining feelings early)
- Lingering in comfort (friend zone recognition)
- Misreading politeness as interest (soft disengagement)

### Results Screen (Enhanced)

**Current state:**
- Shows score out of 10
- Shows percentage
- Shows breakdown by signal state (Positive/Neutral/Negative)

**Keep + Add:**

```
┌─────────────────────────────────────┐
│         Quiz Complete!              │
│                                     │
│   ┌─────────────┐                  │
│   │      8      │                  │
│   │     /10     │                  │
│   └─────────────┘                  │
│     80% Accuracy                    │
│                                     │
│  Your Signal State Recognition:     │
│  ✅ Interest: 3/3 correct           │
│  ⚠️ Uncertainty: 1/3 correct        │
│  ✅ Comfort: 2/2 correct            │
│  ✅ Disengagement: 2/2 correct      │
│                                     │
│  You Struggled With:                │
│  🎯 Uncertainty Recognition         │
│                                     │
│  Recommended:                       │
│  📖 Review "Signals vs Stories"     │
│  🎬 Check Scenario: "Hot and Cold"  │
│                                     │
│  [Retake Quiz] [Review Answers]     │
│  [Back to Dashboard]                │
└─────────────────────────────────────┘
```

**New features:**
- Track which specific state they struggle with
- Suggest relevant scenarios or framework review
- Link to Analyze tool ("Want to analyze a real situation?")

---

## Part 2: Analyze Tool (Fix + Enhance)

### Current State

**What's broken:**
- ❌ Returns error instead of analysis
- ❌ Textarea has hidden whitespace bug
- ❌ No signal state detection
- ❌ No framework-based feedback

### Fix Priority 1: Get Basic Function Working

**Backend requirements:**
1. Accept text input (user's description of situation)
2. Send to Claude API with Signal Theory framework prompt
3. Return structured analysis
4. Handle errors gracefully (502/503 = backend starting, 401 = session expired)

**Prompt Template (Backend):**

```
You are analyzing a dating situation using the Signal Theory framework.

Framework principles:
- Four signal states: Interest, Uncertainty, Comfort, Disengagement
- Signals over Stories: Trust behavior, not explanations
- Timing over Intent: When matters more than why
- Calibration over Performance: Match energy, don't exceed it
- The Master Question: "Am I aligned with the signal or trying to change it?"

User's situation:
{user_input}

Analyze this situation and provide:

1. **Signal State**: Which of the four states is this? (Interest/Uncertainty/Comfort/Disengagement)

2. **Observable Behaviors**: List specific behaviors (who initiates, response times, plan follow-through, etc.)

3. **Framework Violations**: Is the user pushing uncertainty? Over-investing? Lingering in comfort?

4. **Common Mistake**: What do most people do wrong in this situation?

5. **Calibrated Response**: What should the user do next, aligned with the signal state?

6. **Teaching Point**: Which framework principle applies here?

Format response as plain text with clear sections.
```

### Enhanced Analyze UI

**Input options:**
1. **Free-text description** (current)
2. **Text exchange paste** (future: auto-format with Me:/Her: labels)

**Output format:**

```
┌─────────────────────────────────────┐
│  Signal State Detected:             │
│  [Uncertainty] 🟡                   │
│                                     │
│  Observable Behaviors:              │
│  ✅ She texts you back              │
│  ❌ Takes 6-12 hours to respond     │
│  ❌ Vague about plans ("maybe")     │
│  ✅ Warm in person                  │
│                                     │
│  Pattern Analysis:                  │
│  Warmth without consistent          │
│  follow-through = Uncertainty.      │
│  She's evaluating but hasn't        │
│  decided yet.                       │
│                                     │
│  Framework Check:                   │
│  ⚠️ Are you trying to change this   │
│     signal or respond to it?        │
│                                     │
│  Common Mistake:                    │
│  Pushing for clarity ("Are we on?") │
│  or increasing contact frequency.   │
│  This converts Uncertainty →        │
│  Disengagement.                     │
│                                     │
│  Calibrated Response:               │
│  Stay warm but not insistent.       │
│  Give space. Let time and behavior  │
│  provide clarity. Don't push.       │
│                                     │
│  Framework Principle:               │
│  📖 Signals Over Stories            │
│  (Trust her behavior, not your      │
│  interpretation of "maybe")         │
│                                     │
│  Related Scenarios:                 │
│  🎬 "Hot and Cold" scenario         │
│  📚 Training Module 2: Uncertainty  │
└─────────────────────────────────────┘
```

### Analyze Pattern Recognition Logic

**What to detect:**

**Interest indicators:**
- She initiates contact
- Suggests specific plans
- Follows through consistently
- Reciprocal energy

**Uncertainty indicators:**
- Inconsistent initiation
- Warm but distance after
- Vague about plans
- Takes time to respond

**Comfort indicators:**
- Easy conversation
- Emotional openness
- No romantic direction
- No escalation from her

**Disengagement indicators:**
- Slower responses over time
- Plans falling through
- Polite but transactional
- Fading energy

**Over-investment red flags (user's behavior):**
- Double-texting
- Explaining feelings early
- Suggesting multiple plans after "maybe"
- Trying to "fix" uncertainty with more contact

---

## Part 3: Dashboard (Module Hub)

### Current State

**What exists:**
- Basic stats (quiz completion %, accuracy, scenarios used)
- Navigation to modules

**What needs to be added:**

```
┌─────────────────────────────────────┐
│  Dashboard                          │
│                                     │
│  Welcome back, Jeff!                │
│                                     │
│  Your Progress:                     │
│  ├─ Training: 1/3 quizzes complete  │
│  ├─ Accuracy: 75% (improving!)      │
│  └─ Scenarios: 3/5 used this week   │
│                                     │
│  What You're Mastering:             │
│  ✅ Interest Recognition            │
│  ✅ Disengagement Recognition       │
│                                     │
│  What Needs Work:                   │
│  ⚠️ Uncertainty vs Comfort          │
│                                     │
│  Recommended Next:                  │
│  📖 Intermediate Quiz (Unlock Pro)  │
│  🎬 Scenario: "3 Weeks of Texting"  │
│                                     │
│  ┌────────────────────────────────┐ │
│  │  Quick Analyze                 │ │
│  │  Got a situation? Paste it     │ │
│  │  here for instant feedback.    │ │
│  │  [Text input...]               │ │
│  └────────────────────────────────┘ │
│                                     │
│  [Training Quizzes] [Scenarios]     │
│  [Analyze Tool] [Profile]           │
└─────────────────────────────────────┘
```

---

## Part 4: Color Scheme (Final Standardization)

**Match "Are You Ready to Date" quiz colors:**

- **Primary:** Orange `#FF6B35`
- **Background:** Dark gray `#1a1a1a`
- **Cards:** Medium dark `#2a2a2a`
- **Borders:** Subtle gray `#3a3a3a`
- **Text:** Light `#f5f5f5`
- **Accent/Hover:** Darker orange `#e55a25`

**Signal state colors:**
- **Interest:** Green `#10b981`
- **Uncertainty:** Yellow `#f59e0b`
- **Comfort:** Blue `#3b82f6`
- **Disengagement:** Red `#ef4444`

**Already applied:** ✅ (commit 7b3bead, 93342b0)

---

## Part 5: Authentication Improvements

### Current Issues
- ❌ Login checks `data.token` but backend returns `data.accessToken` (NOW FIXED: commit 0c72efc)
- ⚠️ Signup uses `name` field but backend expects `display_name` (NOW FIXED: commit 0c72efc)

### Future Enhancements (Not Critical)
- [ ] Add "Login with Google" OAuth
- [ ] Forgot password flow (requires email integration)
- [ ] Better session management (refresh tokens)

**Status:** Login now works. Future enhancements are nice-to-have, not blockers.

---

## Implementation Priority

### Phase 1: Fix Critical Bugs (Complete ✅)
- [x] Login token field mismatch
- [x] Color scheme alignment
- [x] Quiz navigation back buttons
- [x] Scroll position fixes

### Phase 2: Content Alignment (CURRENT FOCUS)
- [ ] Rebuild quiz questions with framework structure (30 questions)
- [ ] Add framework-aligned feedback to each question
- [ ] Fix Analyze tool error
- [ ] Implement basic signal state detection in Analyzer

### Phase 3: Enhanced Features
- [ ] Cross-link modules/scenarios/analyzer
- [ ] Progress tracking by principle
- [ ] Recommended next steps on dashboard
- [ ] "Review answers" mode for quizzes

### Phase 4: Interactive Scenarios (Future)
- [ ] AI-powered multi-turn conversations
- [ ] Dynamic scenario responses
- [ ] Custom scenario creation (Pro feature)

---

## Success Metrics

**User should be able to:**
1. Take a quiz and understand WHY each answer is right/wrong
2. Identify which signal state they're in (Interest/Uncertainty/Comfort/Disengagement)
3. Know what the calibrated response is for that state
4. Avoid common mistakes (over-investment, pushing uncertainty, lingering in comfort)
5. Apply framework to their real situations via Analyzer

**App should teach:**
- Signal state recognition (behavior patterns)
- Response calibration (match energy to state)
- Framework principles (Signals over Stories, Timing over Intent, etc.)
- Common mistakes (what not to do)

---

## Technical Notes

### Quiz Question JSON Schema

```typescript
interface QuizQuestion {
  id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  signalState: 'Interest' | 'Uncertainty' | 'Comfort' | 'Disengagement';
  scenario: {
    title: string;
    situation: string;
    question: string;
  };
  options: Array<{
    id: string;
    text: string;
    correct: boolean;
    explanation: string;
  }>;
  frameworkPrinciple: string;
  teachingPoint: string;
  commonMistake: string;
  calibratedResponse: string;
  relatedScenarios?: string[];
}
```

### Analyzer API Contract

**Request:**
```json
{
  "situation": "User's text description of dating situation"
}
```

**Response:**
```json
{
  "signalState": "Uncertainty",
  "observableBehaviors": [
    "She texts back",
    "Takes 6-12 hours to respond",
    "Vague about plans"
  ],
  "patternAnalysis": "Warmth without follow-through = Uncertainty",
  "frameworkViolations": [
    "Trying to change signal instead of respond to it"
  ],
  "commonMistake": "Pushing for clarity or increasing contact",
  "calibratedResponse": "Stay warm but not insistent. Give space.",
  "frameworkPrinciple": "Signals Over Stories",
  "teachingPoint": "Trust behavior, not words",
  "relatedScenarios": ["scenario-uncertainty-01"],
  "relatedModules": ["module-02-uncertainty"]
}
```

---

## Next Steps

1. **Review this spec with Jeff** - Confirm alignment with vision
2. **Create 30 quiz questions** - 10 beginner, 10 intermediate, 10 advanced (all framework-aligned)
3. **Fix Analyzer backend** - Get basic signal state detection working
4. **Update quiz feedback UI** - Show correct answer, teaching points, calibrated responses
5. **Test end-to-end** - User completes quiz → gets personalized feedback → uses Analyzer

---

**Status:** Ready for implementation phase. Awaiting Jeff's approval to proceed with content creation.

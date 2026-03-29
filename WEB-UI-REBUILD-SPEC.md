# Signal Theory Web App - Complete Rebuild Spec

## Goal
Transform the current basic web UI into a fully functional Signal Theory dating coach app with scenarios, analysis, and proper UX.

## Current State
- ✅ Auth works (signup/login)
- ✅ Token persistence fixed
- ✅ Backend API fully functional
- ✅ 30+ scenarios already written (scenarios/SCENARIOS.md)
- ❌ UI only has text analysis (bare bones)
- ❌ No scenario library
- ❌ Results display is plain text
- ❌ No navigation or structure

## Target State
Professional dating coach web app that users can test immediately and potentially pay for.

---

## Features to Build

### 1. Navigation Structure

**Three main sections (tabs/pages):**

**A. Scenarios (Default/Home)**
- Grid of scenario cards
- Categories: Texting, First Date, Mixed Signals, Post-Breakup, etc.
- Each card shows:
  - Scenario title
  - Brief description (1 line)
  - Difficulty badge
  - "Start →" button
- Filter by category (optional for v1)

**B. Analyze**
- "Describe Your Situation" text area
- "Analyze with AI" button
- Results display (formatted, not plain text)
- Usage counter: "1 of 2 free analyses this week"

**C. Profile (Simple)**
- User email
- Logout button
- Usage stats (scenarios completed, analyses done)
- (Profile type / blind spots can come later)

---

### 2. Scenario Flow

**Step 1: Scenario List**
```
┌─────────────────────────────────┐
│  📱 Texting Scenarios          │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Late Night Text           │ │
│  │ She texts at 11pm...      │ │
│  │ [Start →]                 │ │
│  └───────────────────────────┘ │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Delayed Response Pattern  │ │
│  │ She used to reply fast... │ │
│  │ [Start →]                 │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

**Step 2: Scenario Detail**
```
┌─────────────────────────────────┐
│  Late Night Text                │
│  ────────────────────            │
│                                 │
│  She texts "Hey what are you   │
│  up to?" at 11 PM, three days  │
│  after your first date.        │
│                                 │
│  What do you do?               │
│                                 │
│  ○ Respond immediately with    │
│    detailed answer             │
│  ○ Wait until morning          │
│  ○ Reply warmly but briefly    │
│  ○ Ask if she wants to hang    │
│                                 │
│  [Submit Answer →]             │
└─────────────────────────────────┘
```

**Step 3: Scenario Result**
```
┌─────────────────────────────────┐
│  ✅ Correct!                    │
│  ────────────────────            │
│                                 │
│  Signal State: NEUTRAL         │
│                                 │
│  What I See:                   │
│  • Initiated contact (positive)│
│  • Late timing (neutral)       │
│  • No future plans mentioned   │
│                                 │
│  Analysis:                     │
│  This is information gathering.│
│  She's checking availability   │
│  but hasn't demonstrated clear │
│  forward interest...           │
│                                 │
│  [Next Scenario] [Back to List]│
└─────────────────────────────────┘
```

---

### 3. Analysis Flow (Real-World)

**Step 1: Input**
```
┌─────────────────────────────────┐
│  Analyze Your Situation         │
│  ────────────────────            │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Describe what happened  │   │
│  │ (text conversation,     │   │
│  │ date behavior, etc.)    │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  [Analyze with AI →]           │
│                                 │
│  📊 1 of 2 free analyses left  │
└─────────────────────────────────┘
```

**Step 2: Results**
```
┌─────────────────────────────────┐
│  🔥 Analysis Results            │
│  ────────────────────            │
│                                 │
│  Signal State: NEGATIVE        │
│                                 │
│  What I See:                   │
│  Response time increased from  │
│  1 hour to 6-8 hours. Message  │
│  length decreased...           │
│                                 │
│  What It Means:                │
│  This is disengagement. When   │
│  energy moves away consistently│
│  that's the signal...          │
│                                 │
│  Your Move:                    │
│  Do not chase. Pull back and   │
│  give space...                 │
│                                 │
│  Watch For:                    │
│  If interest returns, she'll   │
│  re-initiate...                │
│                                 │
│  [Analyze Another] [Back]      │
└─────────────────────────────────┘
```

---

### 4. Freemium Gates

**Free Tier:**
- 5 scenarios per week
- 2 analyses per week
- View past results

**When limit hit:**
```
┌─────────────────────────────────┐
│  📈 You've Used Your Free      │
│     Scenarios This Week         │
│                                 │
│  Come back Monday for more!    │
│                                 │
│  Or unlock unlimited access:   │
│                                 │
│  [Upgrade to Pro - $19/mo]     │
│  [Maybe Later]                 │
└─────────────────────────────────┘
```

For now: Just show the counter, don't enforce (we'll add Stripe later)

---

## Technical Implementation

### Data Sources

**Scenarios:**
- Parse `scenarios/SCENARIOS.md` into JSON format
- Store in frontend as static data (don't need backend yet)
- Format:
```json
{
  "id": 1,
  "title": "Late Night Text",
  "category": "texting",
  "difficulty": "beginner",
  "situation": "She texts 'Hey what are you up to?' at 11 PM...",
  "options": [
    {"id": "a", "text": "Respond immediately..."},
    {"id": "b", "text": "Wait until morning"},
    {"id": "c", "text": "Reply warmly but briefly", "correct": true},
    {"id": "d", "text": "Ask if she wants to hang"}
  ],
  "signal_state": "NEUTRAL",
  "analysis": "This is information gathering...",
  "recommended_response": "Respond warmly but briefly..."
}
```

**Analysis:**
- Keep current API call to `/api/analyze`
- Just improve result display

**Usage Tracking:**
- For now: localStorage counters
- Later: backend tracking via API

### File Structure

Update `index.html` with:
1. Navigation tabs (Scenarios | Analyze | Profile)
2. Scenario library view
3. Scenario detail view
4. Better analysis results
5. All styling inline (keep it single-file for now)

### Styling

- Keep current gradient purple theme
- Card-based layout (like current signup)
- Mobile-first (most users will test on phone)
- Smooth transitions between views
- Professional but approachable

---

## Success Criteria

**Must have:**
- ✅ User can browse 10-15 scenarios
- ✅ User can select scenario → see question → choose answer → see result
- ✅ User can analyze real situation → get formatted AI response
- ✅ Navigation between sections works
- ✅ Mobile-friendly
- ✅ Usage counters visible (even if not enforced)

**Nice to have:**
- Categories/filtering
- Search scenarios
- History of analyses
- Profile customization

---

## Deliverable

Single updated `index.html` file that:
1. Loads 10-15 scenarios from embedded JSON
2. Shows scenario library UI
3. Implements scenario flow (question → answer → result)
4. Improves analysis result display
5. Adds basic navigation
6. Tracks usage in localStorage

Estimated build time: 4-6 minutes with Claude Code (Jeff's timing reference)

---

## Next Steps After This

1. Test with real users
2. Add more scenarios (we have 30 ready)
3. Backend scenario storage (if needed)
4. Stripe integration for paid tier
5. Polish based on feedback

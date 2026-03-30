# Analyzer Update Spec - Framework Alignment

**Goal:** Align analyzer with training quiz framework and usage tracking system.

---

## Issues to Fix

### 1. Signal States Mismatch
**Current:** POSITIVE, NEUTRAL, NEGATIVE, AMBIGUOUS  
**Should be:** Interest, Uncertainty, Comfort, Disengagement (match training quiz)

### 2. Usage Tracking
**Current:** Uses old `analyses_used_week` column  
**Should use:** New `user_usage` table (same as quiz tracking)

### 3. Missing Profile Data
**Current:** Crashes if `quiz_profiles` table doesn't exist or user has no profile  
**Should:** Gracefully handle missing data, provide generic analysis

---

## Updated Signal States

**Replace in `backend/src/services/claude.ts`:**

```typescript
export interface AnalysisResult {
  signal_state: 'Interest' | 'Uncertainty' | 'Comfort' | 'Disengagement';
  what_i_see: string;
  what_it_means: string;
  your_move: string;
  watch_for: string;
}
```

**Update system prompt:**

```typescript
SIGNAL STATES (Signal Theory Framework):

1. **Interest** - Choose this when you observe:
   - She initiates contact or plans
   - Consistent, timely responses (not sporadic)
   - Time investment (long conversations, effort to see you)
   - Physical warmth or escalation acceptance
   - Follow-through on commitments
   - Creates opportunities to connect
   Example: "She texted first, suggested coffee Thursday, confirmed the day before"

2. **Uncertainty** - Choose this when you observe:
   - Inconsistent response patterns (sometimes fast, sometimes slow)
   - Warm but vague (positive words without concrete action)
   - Polite engagement but no reciprocal initiation
   - "Maybe" without counter-offers
   - Could go either way depending on future behavior
   Example: "She replies warmly but never suggests plans, always 'maybe next week'"

3. **Comfort** - Choose this when you observe:
   - Easy, friendly connection exists
   - No romantic escalation happening
   - She treats you like a friend (talks about other guys, asks advice)
   - Physical boundaries stay platonic
   - Prefers group settings over one-on-one
   Example: "Great conversation, she touches your arm, then asks your opinion on another guy"

4. **Disengagement** - Choose this when you observe:
   - Response times increasing (directional change away)
   - Message length/investment decreasing
   - Plans falling through without rescheduling
   - Avoids concrete commitments
   - Pattern is consistently moving away
   Example: "Used to reply in an hour, now takes 8+ hours, messages shorter, canceled twice"

**Decision Tree:**
- Is she moving TOWARD you with consistent action? → Interest
- Is behavior inconsistent or vague without clear direction? → Uncertainty  
- Is connection friendly but romantically platonic? → Comfort
- Is she moving AWAY from you over time? → Disengagement

**KEY BEHAVIORAL MARKERS:**

**Interest signals (look for 2+ of these):**
- Initiates contact or plans
- Responds within reasonable time (hours, not days)
- Invests time (long conversations, wants to see you)
- Creates opportunities ("I'll be at X on Saturday")
- Physical warmth (touch, proximity, accepts escalation)
- Follows through on commitments

**Uncertainty signals (look for 2+ of these):**
- Response timing varies wildly (fast sometimes, slow others)
- Positive words without action ("That sounds fun!" but no plans)
- Polite but doesn't reciprocate initiation
- "Maybe" without counter-offers
- Warm in person, distant in follow-up

**Comfort signals (look for 2+ of these):**
- Easy, friendly conversation
- Asks your advice about other guys
- Prefers group settings
- Physical touch stays platonic (friend hugs, not romantic)
- No escalation attempts from either side

**Disengagement signals (look for 2+ of these):**
- Response time increasing (directional pattern)
- Message length/energy decreasing
- Plans canceled without rescheduling
- Vague about future ("I'll let you know")
- Pattern is consistently moving away

**THE MASTER QUESTION (ask this to confirm your classification):**
"Am I aligned with the signal or trying to change it?"
- If you're describing what SHE should do differently, you're trying to change the signal (it's not Interest)
- If her behavior REQUIRES you to compensate/chase/interpret, it's not Interest

STEP-BY-STEP ANALYSIS PROCESS:

**Step 1: Extract Observable Behaviors**
Read the user's description and list ONLY actions/events that actually happened (not interpretations).
Examples: "She texted first", "Took 8 hours to reply", "Suggested Thursday"
NOT: "She's probably busy", "She might like me", "She seems interested"

**Step 2: Count Signal Markers**
Go through the behavioral markers list for each state. Count how many match what you observed.
- Interest markers: [count]
- Uncertainty markers: [count]
- Comfort markers: [count]
- Disengagement markers: [count]

**Step 3: Classify the Signal State**
The state with the MOST matching markers (2+) is your classification.
If tied, default to Uncertainty (when behavior is mixed/unclear, that's what Uncertainty means).

**Step 4: Apply The Master Question**
"Am I aligned with the signal or trying to change it?"
If your "Your Move" section involves chasing/compensating/hoping she'll change → it's NOT Interest.

**Step 5: Format Output**
Use the exact template below with these exact section headers.

RULES:
- Base analysis ONLY on observable behavior from the user's description
- Cite specific actions, not assumptions or interpretations
- "Your Move" must match the signal state (don't tell them to chase Disengagement)
- Keep each section concise: 1-3 sentences
- Direct tone, no preaching (user is 35-55, divorced, skeptical of BS)

OUTPUT FORMAT (use these exact sections):

**Signal State:** [Interest | Uncertainty | Comfort | Disengagement]

**What I See:** (Observable behaviors only)
- [Specific behavior 1 from the description]
- [Specific behavior 2 from the description]  
- [Specific behavior 3 from the description]

**What It Means:** (Pattern interpretation)
This pattern indicates [1-2 sentences explaining what the signal state typically means in dating context].

**Your Move:** (Calibrated action for THIS state)
[Specific recommendation that aligns with the signal state — what to do or not do]

**Watch For:** (Blind spot warning)
[1 sentence about common mistakes people make when reading this signal state]

---

**EXAMPLES OF GOOD OUTPUT:**

**Example 1 - Interest:**
Signal State: Interest
What I See: She texted first to suggest coffee, picked a specific day/time, confirmed the morning of the date
What It Means: This is clear forward movement with concrete action. When someone wants to see you, they make it easy.
Your Move: Show up, be present, match her energy. Don't overthink it — just enjoy the date.
Watch For: Don't create doubt where none exists. When all signals point the same direction, trust them.

**Example 2 - Uncertainty:**
Signal State: Uncertainty
What I See: She replied "Yeah that was fun!" but didn't suggest seeing you again, hasn't initiated contact in 3 days, response was warm but vague
What It Means: Politeness without commitment. If she wanted to see you again, she'd agree to plans or counter with her availability.
Your Move: Follow up once with a specific invite (day, time, place). Her response will clarify — commits = interest, stays vague = disengagement.
Watch For: Don't mistake warm replies for interest. Reciprocity is the marker, not tone.

**Example 3 - Disengagement:**
Signal State: Disengagement
What I See: Used to reply in an hour, now takes 8+ hours, messages went from paragraphs to one-word answers, canceled plans twice without rescheduling
What It Means: The direction is away. When energy consistently decreases over time, that's the signal — not individual delays.
Your Move: Pull back. Stop investing where energy is shrinking. Match her level or below.
Watch For: Don't chase declining interest. Trying harder creates more distance.
```

**Update parser:**

```typescript
function parseResponse(text: string): AnalysisResult {
  const extract = (label: string): string => {
    const pattern = new RegExp(
      `\\*\\*${label}:\\*\\*\\s*(.+?)(?=\\*\\*|$)`,
      'is'
    );
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  };

  const signalStateRaw = extract('Signal State');
  const validStates = ['Interest', 'Uncertainty', 'Comfort', 'Disengagement'] as const;
  const signal_state =
    validStates.find((s) => signalStateRaw.includes(s)) ?? 'Uncertainty';

  return {
    signal_state,
    what_i_see: extract('What I See') || 'Unable to parse observable behaviors.',
    what_it_means: extract('What It Means') || 'Unable to parse interpretation.',
    your_move: extract('Your Move') || 'Unable to parse recommendation.',
    watch_for: extract('Watch For') || 'Unable to parse pattern note.',
  };
}
```

---

## Updated Usage Tracking

**Replace in `backend/src/routes/analysis.ts`:**

**Before analysis (check limit):**

```typescript
// Check usage limit (5 analyses per week for free tier)
const weekStart = getWeekStart(); // Reuse function from usage.ts or import
const usageResult = await pool.query(
  `SELECT analyzer_uses FROM user_usage 
   WHERE user_id = $1 AND week_start = $2`,
  [userId, weekStart]
);

const currentUsage = usageResult.rows[0]?.analyzer_uses ?? 0;

if (currentUsage >= 5) {
  res.status(429).json({ 
    error: 'Weekly limit reached (5 analyses). Upgrade to Pro for unlimited access.',
    limit: 5,
    used: currentUsage
  });
  return;
}
```

**After analysis (track usage):**

```typescript
// Increment usage counter
await pool.query(
  `INSERT INTO user_usage (user_id, week_start, analyzer_uses)
   VALUES ($1, $2, 1)
   ON CONFLICT (user_id, week_start)
   DO UPDATE SET analyzer_uses = user_usage.analyzer_uses + 1, updated_at = NOW()`,
  [userId, weekStart]
);
```

**Remove old counter:**
```typescript
// DELETE THIS:
await pool.query(
  `UPDATE users SET analyses_used_week = analyses_used_week + 1
   WHERE id = $1`,
  [userId]
);
```

---

## Graceful Profile Handling

**Replace profile fetch with optional handling:**

```typescript
// Fetch user profile for context (optional)
const userResult = await pool.query(
  `SELECT u.profile_type, u.quiz_profile_id,
          qp.signal_score, qp.readiness_score, qp.strategy_score, qp.weak_questions
   FROM users u
   LEFT JOIN quiz_profiles qp ON qp.id = u.quiz_profile_id
   WHERE u.id = $1`,
  [userId]
);

const userData = userResult.rows[0];
if (!userData) {
  res.status(404).json({ error: 'User not found.' });
  return;
}

// Use defaults if profile data is missing
const weakQuestions: Array<{ question_text: string }> = userData.weak_questions ?? [];
const blindSpots = weakQuestions.map((q) => q.question_text);

const analysisResult = await analyzeWithClaude({
  input_text: input_text.trim(),
  profile_type: userData.profile_type ?? 'general',  // Default to 'general'
  signal_score: userData.signal_score ?? 5,          // Default to middle score
  readiness_score: userData.readiness_score ?? 5,
  strategy_score: userData.strategy_score ?? 5,
  blind_spots: blindSpots,  // Empty array if no profile
});
```

**Update system prompt to handle missing profile:**

```typescript
function buildSystemPrompt(payload: AnalysisPayload): string {
  const hasProfile = payload.profile_type !== 'general';
  
  const contextSection = hasProfile
    ? `USER CONTEXT:
- Profile type: ${payload.profile_type}
- Signal reading: ${payload.signal_score}/10
- Readiness: ${payload.readiness_score}/10
- Strategy: ${payload.strategy_score}/10
- Blind spots: ${payload.blind_spots.length > 0 ? payload.blind_spots.join(', ') : 'None identified yet'}`
    : `USER CONTEXT:
- No profile completed yet — provide general Signal Theory analysis`;

  return `You are a Signal Theory coach helping a user analyze a dating interaction.

${contextSection}

SIGNAL STATES (Signal Theory Framework):
...rest of prompt...
`;
}
```

---

## Week Start Helper

**Add to top of `analysis.ts` (or import from `usage.ts`):**

```typescript
function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday = start of week
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0]; // YYYY-MM-DD
}
```

---

## Migration Note

**Database cleanup (optional, not critical):**

Can remove `analyses_used_week` column from `users` table in future migration:

```sql
ALTER TABLE users DROP COLUMN analyses_used_week;
```

But not required for analyzer to work — new code just won't use it.

---

## Testing Checklist

Once DNS resolves and we can access the app:

1. ✅ Login works
2. ✅ Navigate to Analyzer tab
3. ✅ Paste a dating scenario (e.g., "She texted me after 3 days but didn't suggest plans")
4. ✅ Submit and verify:
   - Signal state is one of: Interest, Uncertainty, Comfort, Disengagement
   - "What I See" lists observable behaviors
   - "Your Move" gives calibrated advice
   - "Watch For" includes blind spot note
5. ✅ Submit 5 times in a row, verify 6th attempt shows "Weekly limit reached"
6. ✅ Check that usage syncs across devices (test on phone after hitting limit on desktop)

---

## Files to Modify

1. `backend/src/services/claude.ts` - Update signal states and prompt
2. `backend/src/routes/analysis.ts` - Update usage tracking and profile handling

**Estimated time:** 10-15 minutes to implement once we can test.

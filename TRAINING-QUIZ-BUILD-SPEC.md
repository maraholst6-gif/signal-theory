# Training Quiz Build Spec - Claude Code Ready

**Goal:** Replace existing 30 quiz questions with framework-aligned versions. Update feedback display to show complete Signal Theory teaching content.

**Scope:** Training quiz ONLY. Do not touch scenarios or analyzer modules.

---

## File Path Map

```
PROJECT STRUCTURE:
signal-theory/
├── index.html              ← Main app (MODIFY THIS)
├── quiz/                   ← Dating quiz (separate, don't touch)
│   └── index.html
└── backend/
    └── src/
        ├── index.ts        ← Express server
        ├── routes/
        │   ├── quizzes.ts  ← Quiz endpoints (don't touch)
        │   ├── analysis.ts ← Analyzer (don't touch)
        │   └── auth.ts     ← Auth (don't touch)
        └── migrations/
            └── 002_features.sql ← DB schema (don't touch)
```

**ONLY MODIFY:** `signal-theory/index.html` (lines ~539-2000, the QUIZ_SCENARIOS object)

---

## Current State

**File:** `signal-theory/index.html` line 539  
**Object:** `const QUIZ_SCENARIOS = { ... }`  
**Structure:** 30 questions (10 beginner, 10 intermediate, 10 advanced)  
**Problem:** Questions use arbitrary answer options, not the 4 signal states

---

## New Question Structure

**Replace the entire `QUIZ_SCENARIOS` object with:**

```javascript
const QUIZ_SCENARIOS = {
  beginner: [
    {
      id: 'b1',
      level: 'beginner',
      signalState: 'uncertainty',
      title: 'Late Night Text',
      scenario: 'She texts "Hey what are you up to?" at 11 PM, three days after your first date. No mention of the date or future plans.',
      question: 'What signal state is this?',
      options: [
        { id: 'A', text: 'Interest - She\'s showing reciprocal effort and forward movement', correct: false },
        { id: 'B', text: 'Uncertainty - Inconsistent pattern, no clear forward direction', correct: true },
        { id: 'C', text: 'Comfort - Easy connection exists but no romantic escalation', correct: false },
        { id: 'D', text: 'Disengagement - She\'s moving away with fading energy', correct: false }
      ],
      explanation: {
        correctAnswer: 'B',
        signalState: 'Uncertainty',
        why: 'Initiated contact is slightly positive, but late timing, no reference to the date, and three-day gap with no forward plans = uncertainty. She\'s checking in but not demonstrating clear romantic interest.',
        behaviors: [
          'Initiated contact (slight positive)',
          'Timing is late/casual (neutral)',
          'No reference to past date or future plans (neutral)',
          'Three-day gap since last contact (neutral)'
        ],
        commonMistake: 'Interpreting late-night text as "she\'s thinking about me = interest." Timing and content matter more than just contact.',
        calibratedResponse: 'Reply warmly but don\'t over-invest. Keep it brief and friendly. Let her demonstrate more consistent interest before escalating.',
        frameworkPrinciple: 'Signals Over Stories - Don\'t fill gaps with hopeful narratives. Observe behavior patterns.'
      }
    },
    // ... (all 30 questions follow this structure)
  ],
  intermediate: [ /* 10 questions */ ],
  advanced: [ /* 10 questions */ ]
};
```

**Full question set:** See `QUIZ-QUESTIONS-RESTRUCTURED.md` for all 30 questions with complete data.

---

## Question Data Source

**File:** `signal-theory/QUIZ-QUESTIONS-RESTRUCTURED.md`  
**Contains:** All 30 questions fully written with:
- Scenario text
- Question text
- 4 signal state options (A/B/C/D)
- Correct answer marked with ✓
- Full explanation object (why, behaviors, mistake, response, principle)

**Your task:** Convert markdown format to JavaScript object structure shown above.

---

## Feedback Display Updates

**Current feedback screen shows:** Basic right/wrong with brief explanation

**New feedback screen must show:**

```html
<div class="feedback-screen">
  <!-- Correct/Incorrect Badge -->
  <div class="result-badge ${correct ? 'correct' : 'incorrect'}">
    ${correct ? '✅ Correct!' : '❌ Incorrect'}
  </div>

  <!-- Signal State Badge -->
  <div class="signal-badge ${signalState.toLowerCase()}">
    ${signalState}
  </div>

  <!-- Why This State -->
  <div class="explanation-section">
    <h3>Why This Is ${signalState}</h3>
    <p>${explanation.why}</p>
  </div>

  <!-- Observable Behaviors -->
  <div class="behaviors-section">
    <h3>Observable Behaviors</h3>
    <ul>
      ${explanation.behaviors.map(b => `<li>${b}</li>`).join('')}
    </ul>
  </div>

  <!-- Common Mistake -->
  <div class="mistake-section">
    <h3>Common Mistake</h3>
    <p>${explanation.commonMistake}</p>
  </div>

  <!-- Calibrated Response -->
  <div class="response-section">
    <h3>Calibrated Response</h3>
    <p>${explanation.calibratedResponse}</p>
  </div>

  <!-- Framework Principle -->
  <div class="principle-section">
    <h3>Framework Principle</h3>
    <p>${explanation.frameworkPrinciple}</p>
  </div>

  <!-- Navigation -->
  <button onclick="nextQuestion()">Next Question →</button>
</div>
```

**CSS for signal state badges:**
```css
.signal-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  margin: 16px 0;
}

.signal-badge.interest { background: #10b981; color: white; }
.signal-badge.uncertainty { background: #f59e0b; color: white; }
.signal-badge.comfort { background: #3b82f6; color: white; }
.signal-badge.disengagement { background: #ef4444; color: white; }
```

---

## Results Screen Updates

**After completing all 10 questions in a level, show:**

```html
<div class="results-screen">
  <h2>Quiz Complete!</h2>
  
  <!-- Overall Score -->
  <div class="score-display">
    <div class="score-number">${correct}/${total}</div>
    <div class="score-percentage">${percentage}%</div>
  </div>

  <!-- Breakdown by Signal State -->
  <div class="breakdown-section">
    <h3>Accuracy by Signal State</h3>
    <div class="state-breakdown">
      <div class="state-stat">
        <span class="state-name">Interest</span>
        <span class="state-score">${interestCorrect}/${interestTotal}</span>
      </div>
      <div class="state-stat">
        <span class="state-name">Uncertainty</span>
        <span class="state-score">${uncertaintyCorrect}/${uncertaintyTotal}</span>
      </div>
      <div class="state-stat">
        <span class="state-name">Comfort</span>
        <span class="state-score">${comfortCorrect}/${comfortTotal}</span>
      </div>
      <div class="state-stat">
        <span class="state-name">Disengagement</span>
        <span class="state-score">${disengagementCorrect}/${disengagementTotal}</span>
      </div>
    </div>
  </div>

  <!-- Struggle Areas (if any state < 70%) -->
  ${struggleStates.length > 0 ? `
    <div class="struggle-section">
      <h3>Areas to Review</h3>
      <p>You struggled with: ${struggleStates.join(', ')}</p>
      <p>Consider reviewing Signal Theory framework sections on these states.</p>
    </div>
  ` : ''}

  <!-- Navigation -->
  <button onclick="returnToQuizList()">Back to Quiz List</button>
</div>
```

---

## Implementation Checklist

### Phase 1: Replace Question Data
- [ ] Read `QUIZ-QUESTIONS-RESTRUCTURED.md`
- [ ] Convert all 30 questions to JavaScript object format
- [ ] Replace `QUIZ_SCENARIOS` object in `index.html` (line ~539)
- [ ] Verify all questions have correct structure (id, level, signalState, title, scenario, question, options, explanation)

### Phase 2: Update Feedback Display
- [ ] Modify feedback screen HTML to show all explanation fields
- [ ] Add CSS for signal state badges (4 colors)
- [ ] Add CSS for new sections (behaviors, mistake, response, principle)
- [ ] Test feedback displays correctly for correct AND incorrect answers

### Phase 3: Update Results Screen
- [ ] Calculate score breakdown by signal state
- [ ] Display overall score (X/10, percentage)
- [ ] Show per-state accuracy
- [ ] Identify struggle areas (< 70% accuracy)
- [ ] Add back button to quiz list

### Phase 4: Testing
- [ ] Complete a beginner quiz and verify feedback shows all sections
- [ ] Verify results screen shows state breakdown
- [ ] Test incorrect answers show same rich feedback
- [ ] Verify navigation works (next question, back to list)
- [ ] Mobile responsive check (all new content displays well)

---

## What NOT to Change

❌ **Do not modify:**
- Scenarios tab (leave as-is)
- Analyzer tab (leave as-is)
- Auth flow (leave as-is)
- Backend routes (leave as-is)
- Color scheme (already orange/dark)
- Navigation structure (3 tabs stay)
- Profile/dashboard (leave as-is)

✅ **Only modify:**
- Training quiz question data
- Training quiz feedback display
- Training quiz results screen

---

## Signal State Distribution (Reference)

**Beginner (10 questions):**
- Interest: 3 (B6, B7, B8)
- Uncertainty: 5 (B1, B3, B5, B9, B10)
- Comfort: 0
- Disengagement: 2 (B2, B4)

**Intermediate (10 questions):**
- Interest: 2 (I8, I10)
- Uncertainty: 3 (I2, I5, I9)
- Comfort: 0
- Disengagement: 5 (I1, I3, I4, I6, I7)

**Advanced (10 questions):**
- Interest: 0
- Uncertainty: 5 (A1, A2, A7, A8, A10)
- Comfort: 1 (A6)
- Disengagement: 4 (A3, A4, A5, A9)

**Overall totals:**
- Interest: 5/30 (17%)
- Uncertainty: 13/30 (43%)
- Comfort: 1/30 (3%)
- Disengagement: 11/30 (37%)

This distribution matches real-world dating: most situations are ambiguous (Uncertainty) or declining (Disengagement). Clear Interest is rare.

---

## Success Criteria

**Done when:**
1. ✅ All 30 questions replaced with framework-aligned versions
2. ✅ Feedback shows: badge, state, why, behaviors, mistake, response, principle
3. ✅ Results show: overall score + per-state breakdown + struggle areas
4. ✅ User can complete beginner quiz end-to-end and see rich teaching content
5. ✅ No changes to scenarios or analyzer tabs
6. ✅ Mobile responsive (all new content works on phone)

---

## Notes for Claude Code

**Data source:** All question content is in `QUIZ-QUESTIONS-RESTRUCTURED.md` — just convert markdown to JavaScript objects.

**Keep existing logic for:**
- Question navigation (next/prev)
- Answer selection (radio buttons)
- Score tracking
- Level selection (beginner/intermediate/advanced)

**Only change:**
- Question data structure
- Feedback display (expand to show all explanation fields)
- Results calculation (add per-state breakdown)

**Style consistency:**
- Use existing orange/dark color scheme
- Match existing card/button styles
- Keep mobile-first responsive approach

---

**Ready to implement!**

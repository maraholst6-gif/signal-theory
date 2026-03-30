# SIMPLE QUIZ REBUILD - DO EXACTLY THIS

**ONLY ONE TASK:** Replace the QUIZ_SCENARIOS object in `app/index.html` (line ~539) with the questions from `QUIZ-QUESTIONS-RESTRUCTURED.md`.

**DO NOT:**
- Change feedback display
- Change results screen
- Change any other code
- Interpret or modify the questions
- Change CSS
- Touch anything else

**JUST:**
1. Read `QUIZ-QUESTIONS-RESTRUCTURED.md`
2. Convert those 30 questions to JavaScript object format
3. Replace the QUIZ_SCENARIOS object in `app/index.html`
4. Done.

---

## Source File

**File:** `QUIZ-QUESTIONS-RESTRUCTURED.md`  
**Contains:** All 30 questions already written in this exact format:

```markdown
### B1: Late Night Text
**Scenario:** She texts "Hey what are you up to?" at 11 PM...
**Question:** What signal state is this?
**Options:**
- A) Interest - She's showing reciprocal effort...
- B) Uncertainty - Inconsistent pattern... ✓
- C) Comfort - Easy connection...
- D) Disengagement - She's moving away...
**Correct Answer:** B (Uncertainty)
**Why:** Initiated contact is slightly positive...
**Observable Behaviors:**
- Initiated contact (slight positive)
- Timing is late/casual (neutral)
...
```

---

## Target Structure (COPY THIS EXACTLY)

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
    // ... repeat for all 10 beginner questions
  ],
  intermediate: [
    // ... 10 intermediate questions same structure
  ],
  advanced: [
    // ... 10 advanced questions same structure
  ]
};
```

---

## Field Mapping (Read from .md, Write to .js)

**From QUIZ-QUESTIONS-RESTRUCTURED.md → To JavaScript object:**

| Markdown Field | JS Field | Example |
|---------------|----------|---------|
| ### B1: Late Night Text | `id: 'b1'`, `title: 'Late Night Text'` | Lowercase ID, title as-is |
| (section header) | `level: 'beginner'` | beginner/intermediate/advanced |
| **Correct Answer:** B (Uncertainty) | `signalState: 'uncertainty'` | Lowercase, from parentheses |
| **Scenario:** ... | `scenario: '...'` | Direct copy |
| **Question:** ... | `question: '...'` | Direct copy |
| - A) Interest - ... | `{ id: 'A', text: 'Interest - ...', correct: false }` | Parse all 4 options |
| - B) ... ✓ | `{ id: 'B', text: '...', correct: true }` | ✓ means correct: true |
| **Why:** ... | `explanation.why: '...'` | Direct copy |
| **Observable Behaviors:** | `explanation.behaviors: [...]` | Array of bullet points |
| **Common Mistake:** ... | `explanation.commonMistake: '...'` | Direct copy |
| **Calibrated Response:** ... | `explanation.calibratedResponse: '...'` | Direct copy |
| **Framework Principle:** ... | `explanation.frameworkPrinciple: '...'` | Direct copy |

---

## Conversion Rules

1. **Question IDs:** b1-b10, i1-i10, a1-a10 (lowercase)
2. **Signal states:** 'interest', 'uncertainty', 'comfort', 'disengagement' (lowercase)
3. **Options:** ALWAYS 4 options labeled A/B/C/D
4. **Correct answer:** The option with ✓ marker gets `correct: true`, others get `correct: false`
5. **Escape quotes:** Use `\'` for apostrophes in JavaScript strings
6. **Behaviors:** Convert bulleted list to string array

---

## Example Conversion

**Markdown:**
```markdown
### B1: Late Night Text
**Scenario:** She texts "Hey what are you up to?" at 11 PM...
**Question:** What signal state is this?
**Options:**
- A) Interest - She's showing reciprocal effort
- B) Uncertainty - Inconsistent pattern ✓
- C) Comfort - Easy connection
- D) Disengagement - Moving away
**Correct Answer:** B (Uncertainty)
**Why:** Initiated contact is positive but...
**Observable Behaviors:**
- Initiated contact (slight positive)
- Timing is late/casual (neutral)
**Common Mistake:** Interpreting late-night text as interest
**Calibrated Response:** Reply warmly but don't over-invest
**Framework Principle:** Signals Over Stories
```

**JavaScript:**
```javascript
{
  id: 'b1',
  level: 'beginner',
  signalState: 'uncertainty',
  title: 'Late Night Text',
  scenario: 'She texts "Hey what are you up to?" at 11 PM...',
  question: 'What signal state is this?',
  options: [
    { id: 'A', text: 'Interest - She\'s showing reciprocal effort', correct: false },
    { id: 'B', text: 'Uncertainty - Inconsistent pattern', correct: true },
    { id: 'C', text: 'Comfort - Easy connection', correct: false },
    { id: 'D', text: 'Disengagement - Moving away', correct: false }
  ],
  explanation: {
    correctAnswer: 'B',
    signalState: 'Uncertainty',
    why: 'Initiated contact is positive but...',
    behaviors: [
      'Initiated contact (slight positive)',
      'Timing is late/casual (neutral)'
    ],
    commonMistake: 'Interpreting late-night text as interest',
    calibratedResponse: 'Reply warmly but don\'t over-invest',
    frameworkPrinciple: 'Signals Over Stories'
  }
}
```

---

## File Location

**Source:** `C:\Users\jeffr\.openclaw\workspace\signal-theory\QUIZ-QUESTIONS-RESTRUCTURED.md`  
**Target:** `C:\Users\jeffr\.openclaw\workspace\signal-theory\app\index.html` (line ~539)

**Find this line:**
```javascript
const QUIZ_SCENARIOS = {
```

**Replace everything from `const QUIZ_SCENARIOS = {` to the closing `};` with the new structure.**

---

## That's It

**No other changes. Just replace the question data. The existing display code will handle the rest.**

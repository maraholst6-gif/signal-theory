# Quick Fixes - Signal Theory App

**File:** `app/index.html`

---

## Fix 1: Review Button Goes to Question 1 (Should Show Results)

**Problem:** After completing a quiz, clicking "Review" button goes back to Question 1 instead of showing results.

**Fix:** Update the review button logic to either:
- Show the results screen again, OR
- Disable/hide the review button after quiz completion

**Code location:** Search for "Review" button and check its onclick handler.

---

## Fix 2: Pro Quiz Lock Not Working

**Problem:** Clicking "Intermediate" or "Advanced" quiz buttons shows Question 1 instead of "Upgrade to Pro" paywall.

**Current behavior:** User sees Question 1
**Expected behavior:** Show modal/message saying "Upgrade to Pro to access Intermediate and Advanced quizzes"

**Fix:** Add check in quiz start function:
```javascript
function startQuiz(level) {
  if ((level === 'intermediate' || level === 'advanced') && !userIsPro) {
    showUpgradePrompt();
    return;
  }
  // ... rest of quiz start logic
}
```

---

## Fix 3: Analyzer "input_text is required" Error

**Problem:** Submitting text in analyzer gives error "Error: input_text is required" even though text was entered.

**Root cause:** Form submission isn't properly sending the textarea value.

**Fix:** Check the analyzer submit function - likely using wrong field name or not reading textarea value correctly.

**Code location:** Search for analyzer submit/analyze function and check how it reads the input.

---

## Fix 4: Shuffle Quiz Question Order

**Problem:** Questions are grouped by signal state (all Interest together, then Uncertainty, etc.). Makes patterns too obvious.

**Fix:** Shuffle the questions array when starting a quiz:

```javascript
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// In startQuiz function:
quizState.scenarios = shuffleArray(QUIZ_SCENARIOS[level]);
```

**Code location:** In the `startQuiz` function where it loads scenarios.

---

## Testing Checklist

After fixes:
- [ ] Complete a beginner quiz, click "Review" button - should NOT go to Question 1
- [ ] Click "Intermediate" quiz button - should show "Upgrade to Pro" message
- [ ] Click "Advanced" quiz button - should show "Upgrade to Pro" message
- [ ] Submit text in Analyzer - should work without "input_text required" error
- [ ] Start a quiz - questions should be in random order (not grouped by state)

---

**Priority:** All 4 fixes are quick and important for UX.

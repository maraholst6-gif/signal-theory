# Signal Theory App - Critical Fixes

## Issues to Fix

### 1. "Welcome back" for new users
**Problem:** Dashboard shows "Welcome back!" even for brand new accounts  
**Fix:** Change header subtitle to just "Welcome!" or detect if it's first login

**Location:** `index.html` - line with `<p id="header-subtitle">AI Dating Coach</p>`  
**Change to:** Check if user has any quiz history. If none, show "Welcome!" instead of "Welcome back!"

---

### 2. Verify all 30 scenarios are loaded
**Problem:** User reports only 3 questions in Beginner quiz, should be 10  
**Expected:** 30 total scenarios (10 beginner / 10 intermediate / 10 advanced)

**Check:** Look for `const QUIZ_SCENARIOS` object in `index.html`  
**Verify:**
- `QUIZ_SCENARIOS.beginner` has 10 items
- `QUIZ_SCENARIOS.intermediate` has 10 items  
- `QUIZ_SCENARIOS.advanced` has 10 items

**If missing:** The recent Claude Code build should have added them all. If not present, they need to be added from the spec.

---

### 5. Analyze placeholder text issue
**Problem:** Textarea starts with invisible spaces. Sample placeholder text only appears after deleting the spaces.

**Location:** `index.html` - textarea with id `analyze-input`  
**Current:** Might have whitespace in the HTML between tags  
**Fix:** Ensure textarea is completely empty (no whitespace between tags):
```html
<textarea id="analyze-input" placeholder="..."></textarea>
```
NOT:
```html
<textarea id="analyze-input" placeholder="...">
                    </textarea>
```

---

### 6. Analyze returns 502 error
**Problem:** When clicking "Analyze with AI", backend returns 502 Bad Gateway error

**Possible causes:**
1. Backend is cold-starting (Render free tier spins down)
2. Claude API rate limit
3. Token issue (though this was supposedly fixed)

**Fixes to implement:**
1. **Add retry logic** with exponential backoff
2. **Better error messages:** Instead of generic "Analysis failed", show:
   - "Backend is starting up, please wait 30 seconds and try again" (for 502/503)
   - "Rate limit reached, please try again in a few minutes" (for 429)
   - Actual error message from backend (for 4xx errors)
3. **Loading state:** Show "Analyzing..." spinner while waiting
4. **Timeout:** Show message if it takes >30 seconds

**Code changes needed:**
```javascript
async function analyze() {
  const input = document.getElementById('analyze-input').value.trim();
  if (!input) {
    alert('Please enter a situation to analyze');
    return;
  }
  
  // Show loading state
  const btn = document.querySelector('#analyze-view button.btn-primary');
  const originalText = btn.textContent;
  btn.textContent = 'Analyzing...';
  btn.disabled = true;
  
  try {
    const result = await apiPost('/api/analyze', { input_text: input });
    
    // Display results (existing code)
    const contentDiv = document.getElementById('analyze-content');
    contentDiv.innerHTML = `...`; // existing
    document.getElementById('analyze-result').style.display = 'block';
    
    // Track usage
    await apiPost('/api/usage/track', {type: 'analysis'});
    await loadDashboard(); // Refresh usage counter
  } catch (err) {
    // Better error handling
    let errorMessage = 'Analysis failed: ';
    if (err.message.includes('502') || err.message.includes('503')) {
      errorMessage = 'Backend is starting up. Please wait 30 seconds and try again.';
    } else if (err.message.includes('429')) {
      errorMessage = 'Rate limit reached. Please try again in a few minutes.';
    } else if (err.message.includes('Session expired')) {
      errorMessage = 'Session expired. Please log in again.';
    } else {
      errorMessage += err.message;
    }
    alert(errorMessage);
  } finally {
    // Restore button state
    btn.textContent = originalText;
    btn.disabled = false;
  }
}
```

---

## Additional Context

### Color Scheme (DO NOT CHANGE YET)
**Current:** Purple gradient (`#667eea` to `#764ba2`)  
**Planned:** Switch to match dating quiz colors (orange `#FF6B35` + dark gray theme)  
**Status:** Will be done separately after Signal Theory book review

### Do NOT fix these (will be done later):
- **#3:** Show correct answer when user gets it wrong (needs Signal Theory validation first)
- **#4:** Scroll position on quiz feedback (will fix after book review)
- **#7:** Auth UX improvements (larger project)
- **#8:** Interactive scenarios (not built yet)

---

## Testing After Fixes

1. **Sign up with fresh account** - should say "Welcome!" not "Welcome back!"
2. **Start Beginner quiz** - should have 10 questions, not 3
3. **Check Intermediate/Advanced** - should each have 10 questions (locked behind Pro)
4. **Test Analyze** - should work or show helpful error message if backend is cold
5. **Check Analyze textarea** - should be empty with visible placeholder

---

## Success Criteria

✅ New users see appropriate welcome message  
✅ All 30 quiz scenarios present (10 per tier)  
✅ Analyze textarea has no invisible whitespace  
✅ Analyze error messages are helpful and specific  
✅ Analyze shows loading state during API call

**Working directory:** `C:\Users\jeffr\.openclaw\workspace\signal-theory`  
**Main file:** `index.html` (single-file app for now)  
**Test URL:** https://maraholst6-gif.github.io/signal-theory/

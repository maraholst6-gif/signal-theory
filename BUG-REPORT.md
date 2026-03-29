# Signal Theory Demo - Bug Report & Enhancement Plan

## Critical Bugs Found

### 1. Token Not Saving (BLOCKING)
**Location:** `index.html` line 208
**Bug:** `localStorage.setItem('signal_theory_token', token);` saves OLD token instead of NEW token
**Fix:** Should be `localStorage.setItem('signal_theory_token', newToken);`
**Impact:** Users can login but analyze always fails with "Invalid token"

### 2. Missing Features (UX)
**Current state:** Single text box + "Analyze with AI" button
**Problem:** Feels like a cheap ChatGPT clone, not a dating coach app
**User expectation:** Professional coaching tool with structure and guidance

## Enhancement Requirements (From Jeff)

### Core Features Needed:
1. **Scenario Library**
   - Pre-built common dating scenarios users can select
   - Categories: First date, texting, mixed signals, breakups, etc.
   - "Or describe your own situation" option

2. **Multiple Choice Quiz**
   - Help users understand their patterns
   - Show results: "This indicates [pattern/behavior]"
   - Educational + engaging

3. **Random Scenario Generator**
   - "Not sure what to analyze? Try this scenario..."
   - Helps users explore different situations
   - Makes the tool more interactive

### Original Spec Reference
Jeff mentioned "three separate modules" - need to review:
- `specs/mvp-spec.md`
- `specs/mvp-spec-v2.md`
- `specs/mvp-spec-final.md`

## Fix Priority

**Phase 1 - Critical (Do Now):**
- Fix token saving bug
- Add basic scenario selection (5-10 common scenarios)
- Better UI for results (formatted advice cards, not plain text)

**Phase 2 - Enhanced UX (Next):**
- Quiz/assessment module
- Random scenario generator
- User profile/history

**Phase 3 - Polish (Later):**
- Better mobile UI
- More scenarios
- Results sharing
- Analytics

## Technical Notes

**Working:**
- ✅ Backend API functional
- ✅ User auth works
- ✅ Database connected
- ✅ Claude AI integration works
- ✅ Login/signup flow clean

**Broken/Incomplete:**
- ❌ Token persistence (critical bug)
- ❌ No scenario selection (feels bare-bones)
- ❌ No quiz module (missing feature)
- ❌ Plain text output (not engaging)

## Next Steps

1. Fix token bug immediately
2. Review original specs to see what modules were planned
3. Build scenario library UI
4. Enhance results presentation
5. Add quiz module

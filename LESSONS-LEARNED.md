# Signal Theory App - Lessons Learned

## Mobile Button Visibility Issue (2026-03-29)

### Problem
Button at bottom of quiz questions was cut off on mobile, requiring scrolling to see it. Took 6+ iterations to fix.

### Root Causes
1. **Tested on desktop first** - Desktop has more vertical space, hid the issue
2. **Used incremental padding adjustments** - Tried reducing spacing by 4px, 8px, 12px instead of fixing the architecture
3. **No mobile viewport testing** - Assumed desktop behavior would match mobile

### What Didn't Work
- Reducing `py-6` → `py-3` → `py-2` (padding adjustments)
- Reducing `mb-8` → `mb-4` → `mb-3` (margin tweaks)
- Making text smaller (`text-xl` → `text-lg`)
- Using `flex-1` with sticky footer (not truly fixed)

### What Actually Worked
```jsx
// Footer needs position: fixed, not flex or sticky
<footer className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-bg border-t border-border/20 z-50">
  {/* Navigation buttons */}
</footer>

// Main content needs bottom padding to not be hidden behind footer
<main className="flex-1 flex flex-col items-center px-4 pb-24 overflow-y-auto">
  {/* Content */}
</main>
```

### Lesson: Mobile-First Testing
**When building mobile-first designs:**
1. **Test mobile viewport FIRST** (Chrome DevTools mobile view, or actual device)
2. **Use architectural fixes over incremental tweaks** (position:fixed > padding adjustments)
3. **Have local preview** to test before each deploy (avoid GitHub Pages 60-second delay)

### Standard Mobile Pattern
For any footer that must always be visible:
- Footer: `position: fixed` + `bottom-0` + `z-50`
- Content: `overflow-y-auto` + bottom padding equal to footer height
- Don't use flexbox sticky patterns for critical navigation

---

## GitHub Pages SPA Routing Issue (2026-03-29)

### Problem
Refreshing quiz during questions (`/questions`) returned 404 error.

### Root Cause
React uses client-side routing (`BrowserRouter`), but GitHub Pages serves static files. When you refresh `/questions`, GitHub Pages looks for a `/questions/index.html` file that doesn't exist.

### What Didn't Work
- Adding `404.html` redirect (too complex for subdirectory deployment)
- Trying to configure GitHub Pages routing rules (not possible)

### What Worked
Switch from `BrowserRouter` to `HashRouter`:

```jsx
// Before (breaks on refresh)
import { BrowserRouter } from 'react-router-dom'
<BrowserRouter><App /></BrowserRouter>

// After (works on refresh)
import { HashRouter } from 'react-router-dom'
<HashRouter><App /></HashRouter>
```

**Result:** URLs become `/#/questions` instead of `/questions`. The `#` tells browser it's a client-side route, so GitHub Pages always serves `index.html`.

### Lesson: Static Host Requirements
**When deploying React apps to static hosts (GitHub Pages, Netlify, etc.):**
- Use `HashRouter` by default for simplicity
- Only use `BrowserRouter` if you can configure server-side redirects
- Test refresh behavior before considering it "deployed"

---

## Vite Base Path Configuration (2026-03-29)

### Problem
Quiz deployed to `/signal-theory/quiz/` returned blank page with 404 errors for assets.

### Root Cause
Vite default build creates absolute paths (`/assets/...`), which work at root but break in subdirectories.

### Solution
Add `base` to `vite.config.js`:

```javascript
export default defineConfig({
  base: '/signal-theory/quiz/', // Path where app will be deployed
  plugins: [tailwindcss(), react()],
})
```

### Lesson: Know Your Deployment Path
**Before building any Vite app:**
1. Know the exact deployment path (root vs subdirectory)
2. Set `base` in config BEFORE first build
3. Use relative paths (`./`) in HTML if base path unknown

---

## Iterative Deployment Pain Points

### Problem
Each fix required:
1. Edit code locally
2. `npm run build` (~20-30 seconds)
3. Copy to `/quiz` folder
4. `git commit + push`
5. Wait 60-90 seconds for GitHub Pages
6. Hard refresh browser to bypass cache
7. Test, discover issue, repeat

**Result:** 6 iterations × 2-3 minutes each = 15+ minutes for simple button fix

### Better Approach (For Next Time)
1. **Run dev server locally** (`npm run dev`) and test there first
2. **Use browser DevTools mobile view** to catch mobile issues
3. **Only deploy when confirmed working locally**
4. **Batch multiple fixes** into one deploy

### Commands for Local Testing
```bash
cd signal-theory/quiz-app
npm run dev
# Opens http://localhost:5173
# Test mobile viewport in Chrome DevTools (Cmd+Opt+M)
# Make changes, see instant reload
# Only build/deploy when working
```

---

## GitHub Pages Caching Gotchas

### Issue
Even after pushing new code, old version still loads in browser.

### Causes
1. **Browser cache** - Browser keeps old HTML/CSS/JS
2. **CDN propagation** - GitHub Pages CDN takes 30-90 seconds to update
3. **Service workers** - Some apps cache aggressively

### Solutions
- **Hard refresh:** Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- **Incognito/Private window:** Bypasses all caching
- **Clear site data:** DevTools → Application → Clear Storage
- **Wait 90 seconds:** Let CDN fully propagate before testing

### Lesson
Don't assume "deployed = live immediately". Always wait 60-90 seconds and hard refresh before declaring something "still broken".

---

## Process Improvements for Next Build

### Before Starting
- [ ] Set up local dev environment (`npm run dev`)
- [ ] Test in mobile viewport (DevTools or real device)
- [ ] Confirm base path in Vite config
- [ ] Choose HashRouter vs BrowserRouter based on host

### During Development
- [ ] Make changes in local dev server
- [ ] Test mobile + desktop viewports
- [ ] Confirm all fixes work locally
- [ ] **Then** build and deploy

### After Deploying
- [ ] Wait 90 seconds for CDN propagation
- [ ] Hard refresh (Cmd+Shift+R)
- [ ] Test in incognito window
- [ ] Verify mobile viewport specifically

### Avoid
- ❌ Deploying untested changes
- ❌ Testing only on desktop
- ❌ Incremental tweaks without understanding root cause
- ❌ Assuming GitHub Pages is instant
- ❌ Making changes without local dev server

---

**Summary:** Test locally in mobile viewport before deploying. Use architectural fixes (position:fixed) over incremental padding tweaks. Wait 90 seconds + hard refresh after each GitHub Pages deploy.

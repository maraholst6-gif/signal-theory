# Signal Theory Quiz - Build Specification

**Project:** Dating Readiness Profile Quiz  
**Purpose:** Lead magnet to capture emails and create desire for the app  
**Timeline:** 20 minutes from spec to live

---

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (grayscale + orange accent per brand)
- React Router (for multi-page navigation)

**Backend:**
- Supabase (database + email storage)
- Edge function for scoring logic (optional - can be client-side)

**Deployment:**
- Vercel (auto-deploy from GitHub)

**Domain:**
- SignalTheoryApp.com/quiz (or subdomain: quiz.signaltheoryapp.com)

---

## Pages & Flow

### Page 1: Landing Page (`/quiz`)

**Header:**
```
Your Dating Readiness Profile
Discover your blind spots in 4 minutes
```

**Subheader:**
```
15 real scenarios. Instant personalized results.
Find out where you're stuck and how to fix it.
```

**CTA Button:** "Start Quiz" → navigates to /quiz/questions

**Visual:**
- Clean, minimal design
- Grayscale background (dark charcoal #1a1a1a)
- Orange CTA button (#FF6B35)
- Simple graphic/icon representing assessment

**Footer:**
- "Based on Signal Theory framework by Jeffrey Holst"
- Link to book (optional)

---

### Page 2: Quiz Questions (`/quiz/questions`)

**Layout:**
- Progress bar at top (Question X of 15)
- Question text (large, readable)
- 4 answer options (radio buttons or clickable cards)
- "Next" button (enabled after selection)
- "Back" button (to previous question)

**Behavior:**
- Single question displayed at a time
- Stores answers in local state
- On completion (question 15), calculate score and navigate to results

**Questions:**
- Use the 15 questions from `DATING-READINESS-QUIZ.md`
- Each question has 4 answer options (A, B, C, D)
- Answers map to scoring dimensions (see scoring matrix below)

**Visual:**
- Clean, readable typography
- Clickable answer cards with hover states
- Orange highlight on selected answer
- Smooth transitions between questions

---

### Page 3: Results Page (`/quiz/results`)

**Dynamic based on profile type (8 possible profiles)**

**Layout:**
- Profile name as header (e.g., "The Rusty Romantic")
- 3 score badges (Signal Reading, Emotional Readiness, Strategy)
- Profile description (from RESULTS-PAGES.md)
- "Your Biggest Blind Spots" section (3 bullets)
- "How the App Helps" section
- Email capture form with CTA
- Social share buttons

**Email Capture Form:**
```
Ready to level up?
Get early access when the app launches.

[Email input field]
[Submit button: "Get Early Access"]

Launching [Month]. Be the first to know.
```

**After email submission:**
- Show confirmation message
- Store email + profile type + timestamp in Supabase
- Optional: Redirect to confirmation page

**Visual:**
- Profile-specific color coding (optional)
- Score badges with icons (checkmark, warning, X)
- Orange CTA button
- Clean, scannable layout

---

## Scoring Logic

### Dimensions

1. **Signal Reading** (Questions 1-5)
   - STRONG: 4-5 good answers
   - DEVELOPING: 2-3 good answers
   - WEAK: 0-1 good answers

2. **Emotional Readiness** (Questions 6-10)
   - READY: 4-5 high answers
   - IN TRANSITION: 2-3 high answers
   - NOT READY: 0-1 high answers

3. **Dating Strategy** (Questions 11-15)
   - CALIBRATED: 4-5 good answers
   - LEARNING: 2-3 good answers
   - MISALIGNED: 0-1 good answers

### Profile Mapping

| Signal Reading | Readiness | Strategy | Profile |
|----------------|-----------|----------|---------|
| STRONG | READY | CALIBRATED | The Ready Navigator |
| WEAK | READY | CALIBRATED | The Rusty Romantic |
| DEVELOPING | NOT READY | TOO ACTIVE | The Eager Rebuilder |
| STRONG | READY | PASSIVE | The Cautious Observer |
| WEAK (anxious) | IN TRANSITION | ANXIOUS | The Wounded Analyst |
| DEVELOPING | NOT READY | OUTCOME-FOCUSED | The Pattern Repeater |
| DEVELOPING | READY | INCONSISTENT | The Inconsistent Dater |
| DEVELOPING | IN TRANSITION | LEARNING | The Self-Aware Learner |

### Scoring Key per Question

**See `DATING-READINESS-QUIZ.md` for full answer scoring.**

Example:
- Q1: A = GOOD, B = CAUTIOUS, C = POOR, D = PASSIVE
- Q6: A = LOW, B = HIGH, C = LOW, D = LOW
- etc.

---

## Database Schema (Supabase)

**Table: `quiz_submissions`**

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | text | User email |
| name | text | Optional user name |
| profile_type | text | One of 8 profile types |
| scores | jsonb | {signal: X, readiness: Y, strategy: Z} |
| answers | jsonb | Array of 15 answer choices (for analysis) |
| created_at | timestamp | Submission time |

---

## Content Files Needed

**All content is ready in workspace:**
- Questions: `signal-theory/quiz/DATING-READINESS-QUIZ.md`
- Results pages: `signal-theory/quiz/RESULTS-PAGES.md`

**Implementation notes:**
- Hardcode questions and results in React components OR
- Load from JSON files for easier updates

---

## MVP Features (Build First)

✅ Landing page with start button  
✅ 15-question quiz with progress tracking  
✅ Scoring logic (client-side is fine for MVP)  
✅ 8 results pages with profile-specific copy  
✅ Email capture + Supabase storage  
✅ Mobile responsive  

## Phase 2 Features (Add Later)

⏳ Social share (Twitter, Facebook, copy link)  
⏳ Email confirmation page  
⏳ Admin dashboard to view submissions  
⏳ Email automation (send results via email)  
⏳ Analytics (track completion rate, profile distribution)  

---

## Design Guidelines

**Colors:**
- Background: Dark charcoal (#1a1a1a)
- Text: White/light gray (#f5f5f5)
- Accent: Orange (#FF6B35)
- Secondary: Medium gray (#4a4a4a)

**Typography:**
- Headings: Bold, large (2rem+)
- Body: Readable, 1rem-1.125rem
- Line height: 1.6 for readability

**Spacing:**
- Generous whitespace
- Cards/sections with clear separation
- Mobile-first responsive design

**Tone:**
- Direct, not fluffy
- Honest, not judgmental
- Insightful, not preachy

---

## Deployment

1. Build with Vite (React)
2. Push to GitHub repo (signal-theory-quiz)
3. Connect Vercel to repo
4. Deploy to signaltheoryapp.com/quiz OR quiz.signaltheoryapp.com
5. Set up Supabase project and add connection details as env variables

**Environment Variables:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## Testing Checklist

Before going live:
- [ ] All 15 questions display correctly
- [ ] Answer selection works smoothly
- [ ] Progress bar updates
- [ ] Back button works
- [ ] All 8 profile types render correctly
- [ ] Email submission saves to Supabase
- [ ] Mobile responsive (test on phone)
- [ ] Loading states for async operations
- [ ] Error handling (network failures, etc.)

---

## Next Steps

1. Create Supabase project + database table
2. Spawn Claude Code with this spec
3. Build in 3-5 minutes
4. Deploy to Vercel
5. Test end-to-end
6. Share link with beta testers

---

## Success Metrics (Post-Launch)

Track:
- Quiz starts
- Quiz completions (completion rate)
- Email submissions (conversion rate)
- Profile distribution (which types are most common)
- Shares/referrals (viral coefficient)

Target:
- 60%+ completion rate
- 40%+ email capture rate
- Profile diversity (no single type dominates)

---

## Future Enhancements

Once quiz is live and working:
- A/B test question order
- Add "share your results" feature
- Create profile-specific email sequences
- Build admin dashboard
- Add waitlist counter ("2,847 people waiting")
- Create retargeting pixel for ads later

---

Ready to build. All content is written, spec is complete. Just needs code.

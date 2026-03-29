# Signal Theory - Key Decisions Log

**Last Updated:** 2026-03-24

---

## Content Additions

### Add "Processing Loss / Getting Over Ex" Content (2026-03-24)

**Decision:** Add section/module on processing loss and moving on from ex before diving into active dating scenarios

**Rationale:**
- Target market (35-55, post-divorce) often still attached to ex
- Can't read signals clearly when emotionally unavailable or projecting past patterns
- Many chase unavailable people because familiar (ex-marriage dynamic)
- Need to address "readiness to date" before teaching signal recognition

**Implementation:**

**For Book:**
- Add early chapter (Ch 2-3): "Processing Loss Before Reading Signals"
- Topics:
  - Why attachment to ex distorts signal reading
  - Recognizing projection vs. genuine connection
  - Markers of emotional readiness
  - When you're using dating to avoid processing grief

**For App:**
- Add "Moving On" scenario category
- Scenarios about:
  - Ex reaching out (breadcrumbing, nostalgia, reconciliation attempts)
  - Comparing new people to ex
  - Recognizing when you're chasing unavailable people (familiar pattern)
  - Self-assessment: "Am I ready to date?"
- Potential feature: Diagnostic quiz before main scenarios

**Status:** ✅ COMPLETED (2026-03-24)
- 10 "Moving On" scenarios written and added to SCENARIOS.md
- Scenarios cover: ex contact, comparing to ex, chasing unavailable, using dating to avoid grief, rebound patterns, still wearing ring, idealization, fear of vulnerability
- Next: Add corresponding chapter to book during editing phase

---

## Quiz A/B Test Plan (2026-03-28)

**Decision:** Test 15-question vs 21-question quiz to resolve debate between completion rates (favor 15) and perceived credibility/buyer qualification (favor 21).

### Test Setup

**Variants:**
- **Variant A:** 15 questions (5 per dimension)
- **Variant B:** 21 questions (7 per dimension)

**Traffic Split:** 50/50 random assignment via URL routing (`/quiz-15` or `/quiz-21`)

**Same across both variants:**
- Landing page copy
- Profile types and scoring logic
- Results page design
- Email capture flow
- Give-Gate-Bridge conversion strategy

### Metrics to Track

**Primary Metrics:**
1. **Completion rate** (% who finish quiz)
2. **Email capture rate** (% who give email for action plan)
3. **Time-to-complete** (avg minutes)
4. **Conversion to paid** (book/app purchases per cohort)

**Secondary Metrics:**
5. **Email open rates** (nurture sequence engagement)
6. **Retake rate** (% who return after 30 days)
7. **Share rate** (social sharing of results)
8. **Drop-off points** (which question # causes abandonment)

### Success Criteria

**Test duration:** 4-6 weeks or until statistical significance  
**Sample size needed:** 400 completions (200 per variant) for completion rate  
**Conversion sample:** 100 conversions (50 per variant) for purchase behavior

**Decision thresholds:**
- If 21-question completion rate >80% AND conversion rate >1.3x of 15-question → Use 21
- If 15-question completion rate >85% AND conversion rate ≥21-question → Use 15
- If completion rates similar (±5%) → Choose based on conversion rate
- If conversion rates similar (±10%) → Choose based on completion rate

### Implementation Notes

**15-question variant:** Current working quiz (recently revised for quality)

**21-question variant:** To be built by:
- Adding 2 more questions per dimension
- Following debate-validated templates (Templates 2, 3, 4, 6, 7, 1)
- Maintaining same quality bar as revised 15-question version
- Adding progress indicators and section breaks ("Question X of 21")

**Analytics setup:** Tag cohorts in Supabase, track full funnel per variant

**Launch timing:** Deploy A/B test with quiz launch (don't wait for 21-question build)

### Expected Outcome

**Hypothesis:** 15-question will have higher completion (75-85%) but 21-question will have higher buyer conversion among completers (theatrical legitimacy effect).

**Backup plan:** If neither variant performs well (<60% completion or <20% email capture), revisit quiz quality and landing page copy before testing further variants.

### Next Steps

1. ✅ Document A/B test plan
2. ⏳ Build 21-question variant (add 6 questions)
3. ⏳ Set up analytics tracking (cohort tagging)
4. ⏳ Implement traffic routing (50/50 split)
5. ⏳ Launch both variants simultaneously
6. ⏳ Monitor weekly, decide at 4-6 weeks

---

## Pending Final Decisions

### 1. Brand Name
**Options:**
- Signal Theory (matches book, SEO benefit)
- Calibrate (fresh, captures core concept)
- Clear Signal
- Signal Check
- Read Signal
- Signal Lab
- True Signal
- Signal Coach
- The Signal App
- SignalMind

**Decision:** TBD

---

### 2. Color Scheme
**Options:**
- A: Professional Blue (deep blue + teal)
- B: Minimal Grayscale (charcoal + warm orange) - RECOMMENDED
- C: Earth Tones (forest green + warm brown)

**Decision:** TBD

---

### 3. App Store Name
- Matches brand name + descriptor for search
- Example: "Signal Theory - Dating Coach"
- Subtitle: "Read signals clearly, date confidently"

**Decision:** TBD (follows brand name decision)

---

### 4. Free Tier Structure
**Current Plan:** 3 free analyses, then paywall

**Alternate Options:**
- A: Feature-gated (1/day free, limited features)
- B: Training modules (Module 1 free, rest paid)
- C: Freemium + ads (unlimited with ads, paid = ad-free + features)
- D: Scenario library free, custom analyses paid (RECOMMENDED)

**Decision:** TBD

---

### 5. Pricing
**Current:**
- Monthly: $29/mo
- Annual: $299/yr (saves $49)

**Considerations:**
- Add bonuses to annual tier (bonus scenarios, advanced modules, case studies)
- Test different price points
- A/B test messaging

**Decision:** Start with $29/$299, iterate based on data

---

## Decisions Made

### Tech Stack (2026-03-24)
- **Frontend:** React Native + Expo
- **Backend:** Supabase (auth, database)
- **AI:** OpenAI GPT-4
- **Payments:** RevenueCat + Stripe
- **Hosting:** Expo (app), Supabase (backend)

**Rationale:** Standard stack, fast development, Claude Code can build it, scalable

---

### Timeline (2026-03-24)
- **MVP Development:** 1.5 hours (90 minutes)
- **Breakdown:**
  - Mara content: 10 min
  - Claude Code build: 60 min (app + landing page in parallel)
  - Jeff testing: 15 min
  - Bug fixes: 15 min

**Rationale:** AI timelines, not human timelines. Parallel execution. No padding.

---

### Scenario Count (2026-03-24)
- **MVP:** 30 scenarios
- **Categories:** 
  - Text/App-Based (10)
  - In-Person (10)
  - Post-Relationship/Ambiguous (10)
  - **NEW:** Moving On / Ex Processing (TBD count)

**Status:** 30 written, "Moving On" category to be added

---

### Customer Acquisition Strategy (2026-03-24)
- **Phase 1:** Organic (book funnel, Reddit, Medium) - CAC $0-10
- **Phase 2:** Affiliates (divorce coaches, therapists) - CAC $10-30
- **Phase 3:** Paid ads (only after proving organic) - CAC $20-40 max

**Target blended CAC:** $15-30

**Rationale:** Prove product-market fit with free traffic before spending on ads

---

## Next Actions

1. Finalize 5 pending decisions (brand, colors, free tier, etc.)
2. Add "Processing Loss" section to book
3. Write "Moving On" scenarios for app
4. 10-minute planning call to lock everything
5. Execute 90-minute build sprint
6. Launch

# Signal Theory - TODO List

**Last updated:** April 2, 2026

---

## 🔴 Blockers (Can't Launch Without These)

### 1. **OpenAI Credits ($5-10)**
**Status:** Blocked - account needs funding  
**Impact:** Analyzer feature non-functional  
**Action:** Top up OpenAI account  
**Owner:** Jeff (requires payment method)

---

## 🟡 High Priority (Core Features)

### 2. **Book Revision Pass (15-25 hours)**
**Status:** Humanizing pass complete, ready for Jeff's review  
**Location:** Google Doc: https://docs.google.com/document/d/1VeZ0XbB3ORMeejnMRN0l7L3YEme8eXh481HV-BCrlq8/edit  
**Assessment:** `signal-theory/book/PUBLICATION-READINESS-ASSESSMENT.md`  
**Score:** 6.5/10 — 70-75% done  
**Critical fixes needed:**
1. Condense Chapters 9-12 (mid-book sag) → 2 chapters
2. Add first-person stories and concrete examples (biggest gap)
3. Fix repetitive prose patterns (three-line staccato, negation-correction)
4. Add age-specific practical content (app profiles, age gaps, physical confidence)
5. Apply Chapter 13 energy to rest of book
**Next:** Jeff reads full book + assessment, adds personal stories/voice, then formatting + PDF export

### 3. **Scenarios Tab - AI Generation**
**Status:** Placeholder content only  
**Requirements:**
- Build AI scenario generator (relationship situations)
- Create database table for scenarios
- API endpoint for fetching scenarios
- Frontend UI for browsing/filtering
**Questions:**
- Should Jeff review/approve scenarios before they go live?
- Do scenarios get personalized by quiz profile?
- Static library vs. dynamic generation per user?

### 3. **Premium Upgrade Flow (Stripe)**
**Status:** Not started  
**Requirements:**
- Stripe account setup
- Payment processing integration
- Premium user flag in database
- Gated content logic (free vs. premium)
- Pricing page/checkout flow
**Questions:**
- Pricing model? (One-time, subscription, tiered?)
- What features are premium-only?
- Free trial period?

### 4. **Onboarding/Training Module**
**Status:** Not started  
**Requirements:**
- Explainer for 8 relationship profiles
- "How to interpret your results" guide
- Profile comparison tool
- Interactive training flow
**Questions:**
- Before or after first quiz?
- Required vs. skippable?
- Text-heavy vs. video/interactive?

---

## 🟢 Medium Priority (Polish & Growth)

### 5. **Landing Page Rewrite**
**Status:** Minimal placeholder  
**Requirements:**
- Compelling copy (problem → solution → CTA)
- Social proof (testimonials, case studies)
- Clear value proposition
- Mobile-responsive design
**Questions:**
- Who writes the copy? (Jeff vs. Mara draft)
- Do we need professional design, or keep it minimal?

### 6. **Email Segmentation by Profile**
**Status:** Not started  
**Requirements:**
- Profile-specific email sequences
- Dynamic content based on quiz results
- Personalized follow-up recommendations
**Complexity:** Medium (email CRM already working)

### 7. **Analytics & Tracking**
**Status:** Basic usage tracking only  
**Requirements:**
- Email open/click tracking
- Funnel analysis (signup → quiz → analyzer → premium)
- A/B testing framework
- User engagement metrics
**Tools:** Could use PostHog, Mixpanel, or custom

---

## 🔵 Low Priority (Nice-to-Have)

### 8. **In-App Email Preferences**
**Status:** Not started  
**Requirements:**
- User dashboard for email frequency
- Topic preferences
- Pause/resume emails (not full unsubscribe)

### 9. **Re-Engagement Campaigns**
**Status:** Not started  
**Requirements:**
- Detect inactive users
- Automated win-back emails
- Special offers for churned users

### 10. **Mobile App (React Native)**
**Status:** Not started  
**Requirements:**
- Port web app to React Native
- Push notifications
- Offline quiz capability
**Note:** Probably not needed for MVP launch

---

## 📋 Process Improvements (Meta)

### 11. **Build Process Documentation**
**Status:** In progress  
**Action:** Create "How This Build Worked" retrospective  
**Purpose:** Make future builds faster/smoother

### 12. **Deployment Checklist**
**Status:** Not documented  
**Action:** Write step-by-step deployment guide  
**Purpose:** Reproducible launch process

---

## 🟡 Content (Ready to Publish)

### 13. **Blog Posts (8 Articles Written)**
**Status:** ✅ Drafted, ready for review/publish  
**Location:** `signal-theory/blog/BLOG-POSTS.md`  
**Posts:**
1. How to Tell If She's Interested or Just Being Polite
2. 5 Dating Signals Men Over 40 Almost Always Misread
3. Why You Keep Getting Ghosted (And How to Stop)
4. The Biggest Mistake Divorced Men Make When They Start Dating Again
5. She Said "Let's Just Be Friends" — Here's What Actually Happened
6. How to Read Texting Patterns (Without Overthinking)
7. The 4 Signal States Every Man Should Know Before His Next Date
8. "She Canceled Plans Again." How to Know When to Walk Away

**Recommended publish order:** 6, 3, 2, 1, 7, 4, 8, 5, 9, 10, 11, 12 (highest SEO potential first)  
**Posts 9-12:** Male Signaling series (repurposed from Google Doc, Signal Theory voice, no red pill)  
**Needs:** Individual post URLs for posts 2-12, schema markup  
**Blog section:** ✅ Built (`/blog/`), first post live  

---

## ✅ Completed

- [x] Authentication system (signup/login/password reset)
- [x] Quiz system (3 levels, 8 profiles, backend storage)
- [x] Email CRM (custom-built, Microsoft Graph API)
- [x] Training dashboard (progress tracking, accuracy stats)
- [x] Database schema (7 tables, 5 migrations)
- [x] Auto-deploy pipeline (GitHub → Render/Pages)
- [x] Email auto-subscribe on signup
- [x] 3-email drip sequence
- [x] Password visibility toggle
- [x] "Account exists" error handling
- [x] Session persistence across devices
- [x] Email queue processor (Render cron)
- [x] Landing page (live at learnsignaltheory.com)
- [x] Landing page conversion fixes (chat bubbles, quiz CTA placement, progressive CTAs, cost of inaction, what happens next)
- [x] Build process retrospective documented
- [x] Business strategy documented
- [x] 8 blog posts drafted
- [x] 7-email sequence written (expanded from 3)
- [x] 4 male signaling blog posts written (Posts 9-12)
- [x] Male signaling source notes saved for future Pro module

---

## Decision Log

**Decisions that need to be made:**

1. **Scenarios approval workflow** - Auto-publish vs. manual review?
2. **Premium pricing model** - One-time, subscription, tiered?
3. **Landing page copy** - Jeff writes vs. Mara drafts?
4. **Onboarding timing** - Before quiz, after quiz, or optional?
5. **Analytics tool** - Custom vs. third-party (PostHog, Mixpanel)?
6. **Stripe account owner** - Personal vs. business entity?

---

## Notes

- OpenAI analyzer uses `gpt-4o-mini` (~$0.0006 per analysis)
- Email CRM sends from `contact@learnsignaltheory.com`
- Deployment is auto (just push to GitHub)
- Backend sleeps on free tier (cold starts ~10-15 sec)

**Next review:** After OpenAI credits are added

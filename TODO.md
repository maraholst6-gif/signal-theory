# Signal Theory - TODO List

**Last updated:** April 1, 2026

---

## 🔴 Blockers (Can't Launch Without These)

### 1. **OpenAI Credits ($5-10)**
**Status:** Blocked - account needs funding  
**Impact:** Analyzer feature non-functional  
**Action:** Top up OpenAI account  
**Owner:** Jeff (requires payment method)

---

## 🟡 High Priority (Core Features)

### 2. **Scenarios Tab - AI Generation**
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

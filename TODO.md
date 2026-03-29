# Signal Theory - Comprehensive TODO

**Last Updated:** 2026-03-28

---

## ✅ COMPLETED (Quiz Phase)

- [x] 15-question dating readiness quiz (improved, debate-validated)
- [x] 8 profile types with scoring logic
- [x] 8 results pages (Give-Gate-Bridge conversion model)
- [x] 8 action plan emails (personalized deliverables)
- [x] Landing page copy (optimized for conversion)
- [x] Quiz app built and functional (React + Vite)
- [x] Email capture flow (frontend ready, no backend yet)
- [x] A/B test plan documented (15 vs 21 questions for future)

---

## 🔴 CRITICAL PATH (Launch Blockers)

### 1. Domain & Hosting
- [ ] Register domain (signaltheory.com or alternative)
- [ ] Set up DNS
- [ ] Deploy quiz app to production (Vercel/Netlify/Cloudflare)
- [ ] SSL certificate (auto via hosting provider)
- [ ] Point domain to hosted app

### 2. Email Infrastructure
- [ ] Choose email service provider
  - Options: ConvertKit, Mailchimp, SendGrid, Postmark
  - Recommendation: ConvertKit (built for creators, good automation)
- [ ] Set up email account (hello@signaltheory.com or support@)
- [ ] Configure SPF/DKIM/DMARC records (deliverability)
- [ ] Design email templates (HTML versions of action plans)
- [ ] Test email deliverability (inbox vs spam)

### 3. Email Capture & Delivery
- [ ] Choose CRM/form backend
  - Options: ConvertKit forms, Supabase, Airtable, Google Sheets
  - Recommendation: ConvertKit (handles forms + email delivery)
- [ ] Connect email capture form to CRM
- [ ] Set up automation: Quiz completion → Email with action plan
- [ ] Tag subscribers by profile type (for segmentation)
- [ ] Create welcome sequence trigger

### 4. Analytics & Tracking
- [ ] Set up Google Analytics (or Plausible for privacy-friendly)
- [ ] Track quiz completion rate
- [ ] Track email capture rate by profile
- [ ] Track click-through to app (when ready)
- [ ] Set up conversion goals

---

## 🟡 HIGH PRIORITY (Pre-Launch)

### 5. Email Nurture Sequence
- [ ] Write 6-8 email sequence (per profile or universal)
  - Email 1 (Day 0): Action plan delivery (already written)
  - Email 2 (Day 3-4): Pattern in action scenario
  - Email 3 (Day 10-12): Counterintuitive insight
  - Email 4 (Week 3-4): Social proof / comparison data
  - Email 5 (Week 5-6): App preview / teaser
  - Email 6 (Week 7-8): Early access invitation
  - Email 7 (Launch): Direct invite to app
- [ ] Schedule email sequence in CRM
- [ ] Test sequence with dummy subscriber

### 6. Legal & Compliance
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] GDPR compliance (if targeting EU)
  - Cookie consent banner
  - Data deletion process
- [ ] CAN-SPAM compliance (unsubscribe link in emails)
- [ ] Disclaimer (not therapy/professional advice)

### 7. Brand Assets
- [ ] Logo (if not using text-only)
- [ ] Favicon
- [ ] Social media cover images
- [ ] Email signature template

---

## 🟢 MEDIUM PRIORITY (Post-Launch, Pre-App)

### 8. Marketing & Distribution

**Content Marketing:**
- [ ] Write 5-10 blog posts (SEO + value)
  - "Are You Ready to Date After Divorce? Take This Quiz"
  - "The 8 Dating Readiness Profiles (And Which One You Are)"
  - "Why You're Misreading Signals (And How to Fix It)"
  - "Dating After Divorce: 3 Mistakes Most Men Make"
- [ ] Publish on Medium / Substack
- [ ] Optimize quiz landing page for SEO

**Social Media:**
- [ ] Create Twitter/X account (@SignalTheory or similar)
- [ ] Create LinkedIn page
- [ ] Create Instagram account (optional, lower priority for this demo)
- [ ] Post quiz link with hooks:
  - "Most men misread these 3 signals. Take the quiz to find out which."
  - "Are you actually ready to date, or just telling yourself you are?"

**Community Outreach:**
- [ ] Share in Reddit communities (r/divorce, r/datingoverthirty, r/datingoverforty)
  - Write value-first posts (not just link dumps)
  - Engage in comments
- [ ] Share in Facebook groups (divorced dads, single fathers)
- [ ] Reach out to divorce coaches / therapists for partnerships

**Paid Ads (Optional, Test After Organic Traction):**
- [ ] Facebook/Instagram ads (targeting divorced men 35-55)
- [ ] Google Ads (search: "dating after divorce quiz")
- [ ] Set budget cap ($100-200 test)

### 9. Feedback & Iteration
- [ ] Collect qualitative feedback (email replies, Twitter DMs)
- [ ] Track which profiles convert best (email capture rate by type)
- [ ] A/B test landing page headlines
- [ ] A/B test email subject lines
- [ ] Monitor quiz completion rate (drop-off points)

---

## 🔵 LOW PRIORITY (Future / Nice-to-Have)

### 10. Enhanced Quiz Features
- [ ] Save progress (if they abandon mid-quiz)
- [ ] Retake quiz option (track changes over time)
- [ ] Share results on social (built-in share cards)
- [ ] Secondary profile calculation ("X with Y tendencies")

### 11. Content Expansion
- [ ] Create PDF version of action plans (downloadable)
- [ ] Create scenario library (free 10-20 scenarios)
- [ ] Write case studies (if real users consent to sharing stories)
- [ ] Create YouTube videos explaining each profile

### 12. Partnerships
- [ ] Reach out to divorce coaches for affiliate partnerships
- [ ] Reach out to therapists specializing in post-divorce dating
- [ ] Reach out to men's groups (online communities, meetups)

---

## 📱 APP DEVELOPMENT (Phase 2)

### 13. Signal Theory App - Core Features
- [ ] Finalize app name (Signal Theory or alternative)
- [ ] Finalize tech stack (React Native + Supabase already decided)
- [ ] Design app UI/UX
  - Onboarding flow
  - Scenario interface
  - Progress tracking
  - Profile dashboard
- [ ] Write full scenario library (40+ scenarios per MVP spec)
- [ ] Build scenario engine (present scenario, capture response, show feedback)
- [ ] Implement profile-specific scenario filtering
- [ ] Progress tracking (scenarios completed, patterns recognized)
- [ ] Subscription paywall (free tier + premium)

### 14. App Monetization
- [ ] Integrate RevenueCat + Stripe
- [ ] Set pricing tiers
  - Free: Quiz + 10 scenarios
  - Premium: $19-29/mo or $149-199/yr
- [ ] Build subscription management (upgrade, cancel, pause)
- [ ] Design paywall screens

### 15. App Launch
- [ ] App store listings (iOS App Store, Google Play)
  - Screenshots
  - App description
  - Keywords for ASO (App Store Optimization)
- [ ] Beta testing (TestFlight for iOS, Google Play beta)
- [ ] Soft launch to email list (early access)
- [ ] Public launch
- [ ] Press outreach (Men's Health, GQ, divorce/dating blogs)

---

## 📊 METRICS TO TRACK

**Quiz Performance:**
- Quiz starts
- Quiz completion rate
- Email capture rate (by profile type)
- Drop-off points (which questions lose people)

**Email Performance:**
- Open rate (by email in sequence)
- Click-through rate (to app when ready)
- Unsubscribe rate
- Reply rate (engagement signal)

**App Performance (when live):**
- Downloads
- DAU / MAU (daily/monthly active users)
- Scenario completion rate
- Free-to-paid conversion rate
- Churn rate
- LTV (lifetime value per user)

**Marketing Performance:**
- Traffic sources (organic, social, paid, referral)
- Cost per quiz completion
- Cost per email capture
- Cost per app download
- CAC (customer acquisition cost)
- ROI by channel

---

## 🎯 MILESTONES

**Milestone 1: Quiz Live (Target: 1 week)**
- Domain registered + quiz deployed
- Email capture working
- Action plans delivering
- Analytics tracking

**Milestone 2: First 100 Emails (Target: 2-4 weeks)**
- 100 email subscribers from quiz
- Nurture sequence running
- Feedback collected
- Iteration based on data

**Milestone 3: First 500 Emails (Target: 6-8 weeks)**
- Organic traction validated
- Email engagement strong (>30% open rate)
- Content marketing working
- Ready to launch app

**Milestone 4: App Launch (Target: 10-12 weeks)**
- App live on iOS + Android
- Email list converts to beta users
- First paid subscribers
- Revenue validated

**Milestone 5: Sustainable Revenue (Target: 6 months)**
- 500+ email subscribers
- 100+ app users
- 20+ paid subscribers
- $500+/mo revenue (proof of concept)
- Validated funnel: Book → Quiz → Email → App → Revenue

---

## 💰 ESTIMATED COSTS

**Pre-Launch (Quiz Only):**
- Domain: $12/yr
- Hosting: $0-20/mo (Vercel free tier or Cloudflare Pages)
- Email service: $0-29/mo (ConvertKit free up to 1,000 subscribers)
- **Total: $12-360/yr**

**App Development (If Outsourced):**
- $5,000-15,000 for MVP (or $0 if building with Claude Code)

**Marketing (Optional):**
- $100-500/mo for paid ads (test budget)
- $0 for organic (just time)

**Running Costs (Post-Launch):**
- Domain: $12/yr
- Hosting: $20/mo
- Email: $29-79/mo (as list grows)
- Supabase: $25/mo (Pro tier for app backend)
- RevenueCat: Free up to $10K MRR
- **Total: ~$100-150/mo**

---

## 🚀 LAUNCH STRATEGY

**Week 1: Soft Launch**
- Share quiz with close friends/network
- Get 10-20 completions
- Fix any bugs
- Collect initial feedback

**Week 2-3: Content Seeding**
- Publish 3-5 blog posts
- Share quiz on Twitter/LinkedIn
- Post in 2-3 Reddit communities (value-first)
- Target: 50-100 email subscribers

**Week 4-6: Paid Validation**
- Run small paid ad test ($100-200)
- Track CAC and email capture rate
- If CAC < $5, scale ads
- If CAC > $10, focus on organic

**Week 7-8: Prepare App**
- Email list at 200-500 subscribers
- Announce app coming soon
- Tease features
- Build anticipation

**Week 9-10: App Beta**
- Invite email list to beta
- Collect feedback
- Fix bugs
- Iterate

**Week 11-12: App Launch**
- Public launch
- Press outreach
- Paid ads at scale (if economics work)

---

## 📝 NOTES

**Key Success Factors:**
1. Quiz completion rate >70% (if lower, questions are too long/boring)
2. Email capture rate >30% (if lower, results page isn't compelling enough)
3. Email open rate >40% (if lower, subject lines or sender reputation issue)
4. App conversion rate >5% (email → app download)
5. Free-to-paid >10% (app users → paid subscribers)

**Risk Mitigation:**
- Start with quiz only (low cost, fast validation)
- Don't build app until email list is 300+ engaged subscribers
- Track metrics weekly, iterate based on data
- Keep costs low until revenue is validated

**Decision Gates:**
- Don't scale paid ads until CAC < $10 and email engagement is proven
- Don't build app until quiz → email funnel is converting well
- Don't hire help until you're at $2K+/mo revenue

---

## 🔄 NEXT IMMEDIATE ACTIONS (Priority Order)

1. **Register domain** (signaltheory.com or backup)
2. **Choose email provider** (ConvertKit recommended)
3. **Deploy quiz to production** (Vercel/Netlify)
4. **Connect email capture to ConvertKit**
5. **Upload action plan emails to ConvertKit**
6. **Set up automation** (form submit → email delivery)
7. **Write privacy policy + terms**
8. **Test end-to-end flow** (take quiz → get email)
9. **Soft launch to 5-10 friends**
10. **Fix bugs + iterate**
11. **Public launch**

---

**Status:** Quiz complete, ready for infrastructure setup and launch.

# Signal Theory: Business Strategy to $2K/Month MRR

**Date:** April 2, 2026  
**Status:** MVP built, pre-revenue  
**Goal:** $2K/month recurring revenue as fast as possible  
**Target:** ~100 monthly subs at $19.99 OR ~10 annual at $199

---

## 1. CURRENT STATE ASSESSMENT

### What's Actually Built and Working

**✅ SOLID FOUNDATION:**
- Full authentication system (signup, login, password reset)
- Backend database (PostgreSQL, 7 tables, full user data persistence)
- Training quiz system (30 questions across 3 levels, framework-aligned)
- Email CRM (custom-built, Microsoft Graph API, 3-email drip sequence)
- Auto-deploy pipeline (GitHub → Render/Pages)
- Domain live: learnsignaltheory.com
- Email: contact@learnsignaltheory.com (Microsoft 365)

**The app WORKS. You can sign up, take quizzes, get progress tracked.**

### What's Missing or Broken

**🔴 BLOCKERS:**
1. **OpenAI credits depleted** — Analyzer feature non-functional ($5-10 to fix)
2. **Scenarios tab is placeholder** — No AI-generated interactive scenarios yet
3. **No payment system** — Zero revenue infrastructure (Stripe not integrated)
4. **Landing page is minimal** — Not conversion-optimized (copy exists but not implemented)

**🟡 POLISH GAPS:**
- No testimonials or social proof anywhere
- No "who this is for" filtering on landing page
- Quiz results don't gate email capture yet (huge leak)
- No urgency/scarcity elements
- Onboarding/training module incomplete
- Anonymous author (trust gap)

### What the Product Delivers RIGHT NOW

**Free tier:**
- Training quizzes (signal recognition practice)
- Progress tracking
- Email drip sequence (3 emails)

**Premium tier (not built):**
- Nothing. There is no premium yet.

**The brutal truth:** You have a free educational tool with no monetization path. You're pre-revenue by choice, not by accident.

---

## 2. REVENUE MATH: WHAT $2K/MONTH ACTUALLY MEANS

**Pricing assumption:** $19.99/month or $199/year

**To hit $2K MRR:**
- 100 monthly subscribers at $19.99/mo = $1,999
- OR 10 annual subscribers at $199/yr = $1,990/yr = $165/mo average (need 12 annual)
- OR mix: 50 monthly + 6 annual

**Realistic conversion assumptions:**

**CONSERVATIVE (more likely):**
- Landing page → email signup: 2-3%
- Email subscriber → trial/free signup: 10-15%
- Free user → paid (30 days): 2-5%

**Math:**
- Need 2,000-5,000 landing page visitors/month to get 100 paid users
- That's 66-166 visitors/day
- Or you need a tighter funnel with better conversion

**AGGRESSIVE (best case):**
- Landing page → email: 5%
- Email → app signup: 20%
- Free → paid: 10%

**Math:**
- Need 1,000 visitors/month to hit 100 paid
- That's 33 visitors/day

**Reality check:** You're starting at ZERO traffic. You need either:
1. High-volume traffic (harder, slower)
2. High-conversion funnel (doable with good copy + offer)
3. Both (ideal)

**Time to $2K/month:**
- Optimistic: 3-4 months (if traffic + conversion both work)
- Realistic: 6-9 months (if you build audience slowly)
- Pessimistic: 12+ months (if you can't crack distribution)

---

## 3. CRITICAL PATH TO FIRST DOLLAR

**What MUST be done before anyone pays:**

### Week 1: Minimum Viable Premium (MVP²)

**Day 1-2: Stripe Integration**
- [ ] Create Stripe account
- [ ] Integrate Stripe Checkout for $19.99/month subscription
- [ ] Add `premium_user` flag to database
- [ ] Build paywall logic in app (free vs. pro)

**Day 3-4: Define Premium Features**
- [ ] Gated content: Intermediate + Advanced quizzes = PRO only
- [ ] Analyzer: 1 free use/week, unlimited = PRO
- [ ] Scenarios: 1 free/week, unlimited = PRO
- [ ] Make it PAINFUL to hit free limits (forces upgrade decision)

**Day 5-7: In-App Upgrade Flow**
- [ ] "Upgrade to Pro" modal when hitting free limits
- [ ] Pricing page inside app (/app/pricing)
- [ ] Show what they're missing (not getting)

**BLOCKER:** OpenAI credits — fund account with $10, test analyzer, confirm working.

**OUTPUT:** App can take money. Premium tier exists. Paywall enforced.

### Week 2: Landing Page Conversion

**Day 1-3: Implement Existing Copy**
- [ ] Use LANDING-PAGE-COPY.md (already written, just needs implementation)
- [ ] Add conversion review fixes:
  - Author name + photo (minimum: first name + illustrated avatar)
  - 3-5 testimonials (beta users, fake-it-till-you-make-it if needed)
  - Urgency element ("Join 500 early users")
  - Quiz CTA moved higher (right after problem section)

**Day 4-5: Email Capture on Quiz**
- [ ] Quiz flow: Results → "Enter email to see your action plan"
- [ ] Gate the good stuff behind email (current flow gives away too much)
- [ ] ConvertKit integration already exists — just needs quiz funnel wired

**Day 6-7: A/B Test Setup**
- [ ] Install simple analytics (PostHog free tier or Plausible)
- [ ] Track: landing → quiz, landing → app, quiz → email, email → signup, signup → paid

**OUTPUT:** Landing page that converts. Email capture optimized. Data visibility.

### Week 3: Traffic Kickstart

**Day 1-7: Content Distribution Blitz**
- [ ] Reddit: Post in r/datingoverforty, r/divorce, r/datingoverthirty (valuable tool, not spam)
- [ ] Quora: Answer "how to read dating signals" questions with framework, link to quiz
- [ ] LinkedIn: Post personal story (divorced at 40, built this, here's what I learned)
- [ ] Facebook groups: Divorce support, single dads, dating over 40
- [ ] Free book PDF: Upload to Gumroad, distribute link in communities

**Day 1-7: SEO Basics**
- [ ] Blog post: "4 Dating Signals You're Probably Misreading" (with quiz CTA)
- [ ] Blog post: "How to Tell If She's Interested or Just Being Polite"
- [ ] Blog post: "Why You Keep Getting Ghosted (And How to Stop)"
- [ ] Target long-tail keywords: "how to read dating signals", "is she interested or polite", "dating after divorce signals"

**OUTPUT:** First 100-500 visitors. Email list growing. Early feedback loop.

### Week 4: First Revenue Push

**Day 1-3: Email Drip Optimization**
- [ ] Email 1: Welcome + quiz link (already exists)
- [ ] Email 2: "Here's why you misread signals" + app CTA
- [ ] Email 3: "Try the analyzer" (pushes to premium feature)
- [ ] Email 4 (NEW): Case study / testimonial (social proof)
- [ ] Email 5 (NEW): "Ready to upgrade?" (direct offer)

**Day 4-7: In-App Conversion**
- [ ] After 3 free quiz completions: "Unlock advanced training"
- [ ] After 1 analyzer use: "Get unlimited analysis"
- [ ] After 7 days in app: "What's holding you back?" (survey + offer)

**OUTPUT:** First paying customers. Revenue > $0. Funnel validated or invalidated.

---

## 4. 30-DAY SPRINT PLAN

### Week 1: BUILD THE BUSINESS MODEL
- [ ] Stripe integration (Day 1-2)
- [ ] Premium feature gates (Day 3-4)
- [ ] Upgrade flow (Day 5-6)
- [ ] OpenAI credits funded (Day 1)
- [ ] Test full funnel end-to-end (Day 7)

**Success metric:** Can someone sign up and pay? Yes/No.

### Week 2: OPTIMIZE CONVERSION
- [ ] Landing page copy implementation (Day 1-3)
- [ ] Add testimonials + author identity (Day 1-2)
- [ ] Quiz email gate (Day 4-5)
- [ ] Analytics installed (Day 6)
- [ ] Baseline conversion rates measured (Day 7)

**Success metric:** What % of visitors sign up? What % of signups convert?

### Week 3: DRIVE TRAFFIC
- [ ] Reddit posts (Day 1-2)
- [ ] Quora answers (Day 3-4)
- [ ] LinkedIn personal story (Day 5)
- [ ] 3 blog posts published (Day 1-7)
- [ ] Free book distributed (Day 1-7)

**Success metric:** 100-500 visitors. 10-50 email signups. 1-10 app accounts.

### Week 4: MONETIZE
- [ ] Email drip extended (Day 1-3)
- [ ] In-app upgrade prompts (Day 4-5)
- [ ] First payment attempt (Day 6)
- [ ] Celebrate or debug (Day 7)

**Success metric:** First dollar of revenue OR clear reason why not + fix plan.

---

## 5. 60-DAY GROWTH PLAN (After First Revenue)

### Month 2: SCALE WHAT WORKS

**If conversion is the bottleneck:**
- [ ] A/B test headlines (10 variations)
- [ ] Add video explainer (Loom screencast is fine)
- [ ] Improve testimonials (get real user quotes)
- [ ] Add "who this is NOT for" section (filtering creates trust)
- [ ] Test pricing ($14.99 vs. $19.99 vs. $29.99)

**If traffic is the bottleneck:**
- [ ] Double down on content (6 blog posts/month)
- [ ] Guest post on divorce/dating blogs
- [ ] YouTube channel (screen recordings + framework explainers)
- [ ] Podcast outreach (get interviewed on dating/self-improvement shows)
- [ ] Paid ads test ($100-200 Facebook/Google budget)

**If product is the bottleneck:**
- [ ] Build scenario generator (AI creates custom scenarios)
- [ ] Add progress milestones (gamification)
- [ ] Build accountability features (daily check-ins)
- [ ] Add "ask a question" feature (async coaching)

### Month 2 Goals:
- 500-1,000 visitors/month
- 50-100 email subscribers
- 10-25 app signups
- 1-5 paying customers
- $20-100 MRR

---

## 6. TRAFFIC STRATEGY (Organic, Zero Budget)

### Content-First Approach

**Blog (SEO + Authority):**
- Publish 2x/week minimum
- Target long-tail keywords (low competition, high intent)
- Examples:
  - "How to tell if a woman is interested after first date"
  - "What does it mean when she takes 6 hours to reply"
  - "Dating signals men miss most often"
- CTA in every post: Take the quiz

**Reddit (Community + Distribution):**
- r/datingoverforty (194k members)
- r/datingoverthirty (950k members)
- r/divorce (143k members)
- r/dating_advice (3M members)
- **Strategy:** Answer real questions with Signal Theory framework. Link to quiz when helpful (not spammy).

**Quora (Search Traffic):**
- Target questions like:
  - "How do I know if she's interested or just being nice?"
  - "Why did she ghost me after 3 great dates?"
  - "What are signs a woman is not interested?"
- Write 500-word answers using framework. Link to free book PDF.

**LinkedIn (Professional Network):**
- Personal story posts: "I got divorced at 40 and had to relearn dating. Here's what I wish someone told me."
- Framework explainers: "The 4 signal states every man should know"
- Behind-the-scenes: "I built a dating coach app in 7 days. Here's what I learned."

**YouTube (Long-Form Authority):**
- Screen recordings of quiz walkthroughs
- Framework explainers (whiteboard style)
- "Analyze this text thread" series
- Target: 1 video/week

**Free Book Distribution:**
- Upload to Gumroad (pay-what-you-want)
- Share in communities, forums, Facebook groups
- Each download = potential email capture

### Community Partnerships

**Divorce coaches, therapists, dating coaches:**
- Offer affiliate commission (20% recurring)
- Provide them with Signal Theory as a tool for clients
- Win-win: They add value, you get distribution

**Men's groups:**
- Divorced men's support groups
- Single dad communities
- Accountability groups

### Paid Ads (Future, Not Now)

**Don't spend money on ads until:**
- [ ] You have 100+ free users and know what converts
- [ ] You have testimonials and social proof
- [ ] Your landing page converts at 5%+ (landing → email)
- [ ] Your free → paid conversion is 5%+

**When ready:**
- Facebook: Target divorced men 35-60, interests: dating, relationships, self-improvement
- Google: Target "dating coach for men", "how to read dating signals"
- Budget: $10/day max until proven

---

## 7. WHAT TO STOP DOING

### Time Wasters (Zero ROI)

**❌ Building more features without revenue**
- You don't need more quizzes or scenarios
- You need paying customers
- Build for revenue, not complexity

**❌ Perfecting the landing page design**
- Good enough is good enough
- A/B test copy, not colors
- Conversion = offer + trust + urgency, not gradients

**❌ Waiting for "the right time" to charge**
- You have enough value to charge NOW
- Beginner quiz + analyzer + email support = worth $20/month
- Charge early, improve later

**❌ Anonymous author positioning**
- You can't build trust without identity
- Minimum: First name + illustrated avatar
- Ideal: Full name + photo + story

**❌ Optimizing infrastructure**
- Render free tier is fine
- Cold starts don't matter until you have 1,000 users
- Don't upgrade hosting before revenue

**❌ Building scenarios before testing pricing**
- Scenarios are cool but not required for revenue
- Test willingness to pay FIRST
- Then build more content

---

## 8. RISK ASSESSMENT

### What Could Kill This Business

**🔴 HIGH RISK:**

**1. Can't drive traffic (no audience-building skill)**
- **Likelihood:** Medium
- **Impact:** Fatal
- **Mitigation:** Content blitz (Reddit, Quora, blog, LinkedIn). If no traction in 60 days, pivot to paid ads or partnerships.

**2. Free → Paid conversion fails (people won't pay)**
- **Likelihood:** Medium-High
- **Impact:** Fatal
- **Mitigation:** Test pricing early. Try $14.99, $19.99, $29.99. Survey users. Add more value to premium tier.

**3. Anonymous positioning kills trust (people don't buy from ghosts)**
- **Likelihood:** High
- **Impact:** Moderate-High
- **Mitigation:** Add author name + photo ASAP. If privacy is required, use pen name + AI-generated avatar.

**4. Market is too small (not enough divorced men 40-60 who want dating help)**
- **Likelihood:** Low
- **Impact:** Fatal
- **Mitigation:** Early data will show. If true, expand target (all men dating after long break, not just divorced).

**🟡 MEDIUM RISK:**

**5. Competition (other dating coaches, apps, courses)**
- **Likelihood:** High (competition exists)
- **Impact:** Low-Medium (you have unique framework)
- **Mitigation:** Signal Theory framework is differentiated. Not pickup artist, not therapy, not tactics. It's signal reading.

**6. Churn (people pay once, cancel after 1 month)**
- **Likelihood:** High (normal for education products)
- **Impact:** Medium
- **Mitigation:** Build ongoing value (new scenarios weekly, accountability features, community). Offer annual plan with discount.

**7. Can't scale content fast enough (scenarios, quizzes, blog posts)**
- **Likelihood:** Medium
- **Impact:** Low-Medium
- **Mitigation:** AI-generated scenarios (already planned). Repurpose book content for blog. Hire writer if revenue justifies.

**🟢 LOW RISK:**

**8. Technical issues (app breaks, database fails)**
- **Likelihood:** Low (stack is simple, auto-deploy works)
- **Impact:** Medium
- **Mitigation:** Backup database weekly. Monitor uptime. Have fix process documented.

**9. Legal issues (privacy, GDPR, terms of service)**
- **Likelihood:** Low (standard SaaS concerns)
- **Impact:** Low-Medium
- **Mitigation:** Add privacy policy, terms of service, cookie consent (copy from competitors).

### The Biggest Risk is YOU

**Founder risk:**
- Lose motivation after 90 days without traction
- Pivot too early before testing thoroughly
- Add features instead of selling
- Stay anonymous and wonder why trust is low

**Mitigation:** Set 90-day commitment. Ship. Test. Measure. Iterate. Don't quit before seeing data.

---

## 9. COMPETITIVE POSITIONING

### The Dating Coach Landscape

**Who else exists:**
- **Corey Wayne** (YouTube, coaching, book) — Tactics-focused, alpha-male vibes
- **Matthew Hussey** (YouTube, coaching, courses) — Relationship advice, general audience
- **Mark Manson** (Models book) — Self-improvement, authentic attraction
- **The Art of Charm, School of Attraction, etc.** — Pickup/social skills training
- **BetterHelp, Talkspace** — Therapy (not coaching)
- **Hinge, Bumble, Match** — Dating apps (not coaching)

**What they do:**
- Teach what to say/do
- Focus on confidence, tactics, "game"
- Sell courses, coaching, books
- Target younger demographic (20s-30s)

**What Signal Theory does differently:**

**1. Framework-first, not tactics**
- You don't teach "how to text her back"
- You teach "how to read what she's actually showing you"
- Behavioral observation > manipulation

**2. Post-divorce audience**
- Most dating advice targets young men (pickup, social skills)
- You target men 40-60 who've been out of the game
- Less competition, more pain, higher willingness to pay

**3. Clarity over confidence**
- Not "fake it till you make it"
- "See reality, respond accordingly"
- Reduces anxiety instead of pumping ego

**4. Accessible price**
- Coaching = $200-500/session
- Courses = $200-1,000 one-time
- Signal Theory = $20/month (10x cheaper, ongoing value)

**5. AI-powered feedback**
- Analyzer feature = personal coach in your pocket
- Competitors don't have this
- Defensible moat if you nail the AI prompts

### Your Unique Advantage

**You're solving a REAL problem:**
- Men returning to dating are confused, not unskilled
- They don't need tricks, they need translation
- Signal Theory is the Rosetta Stone, not the pickup manual

**You have a system:**
- 4 signal states (simple, memorable)
- Observable behaviors (concrete, not abstract)
- Calibrated responses (practical, not theoretical)

**You're not a guru:**
- You're a guy who went through it and figured it out
- That's more relatable than "I'm a dating expert with 10,000 clients"

### How to Leverage This

**Messaging:**
- "This isn't pickup artist stuff. This is signal reading."
- "Stop guessing. Start seeing."
- "I was married 20 years, then divorced at 40. I had to learn this the hard way."

**Content:**
- Share divorce → dating journey (vulnerability = trust)
- Contrast Signal Theory with pickup/tactics (positioning)
- Show examples of misread signals (pain point activation)

**Community:**
- Target where divorced men congregate (Reddit, Facebook groups)
- Partner with divorce coaches (non-competing, complementary)
- Avoid pickup artist spaces (wrong audience, wrong vibe)

---

## 10. REVENUE PROJECTIONS (Realistic)

### Month-by-Month First 6 Months

**Assumptions:**
- Launch pricing: $19.99/month
- Free → Paid conversion: 3% (conservative)
- Churn: 20%/month (high but expected for early stage)
- Traffic growth: Organic content + community engagement

| Month | Visitors | Email Subs | App Signups | Paid Subs | MRR | Notes |
|-------|----------|------------|-------------|-----------|-----|-------|
| 1 | 100 | 10 | 5 | 0 | $0 | Stripe integration, first traffic tests |
| 2 | 250 | 25 | 12 | 1 | $20 | First paying customer, debugging funnel |
| 3 | 500 | 50 | 25 | 3 | $60 | Content starting to rank, Reddit traction |
| 4 | 750 | 75 | 35 | 5 | $100 | Testimonials added, conversion improving |
| 5 | 1,000 | 100 | 50 | 10 | $200 | SEO kicking in, repeat visitors |
| 6 | 1,500 | 150 | 75 | 15 | $300 | Word of mouth, first affiliates |

**Year 1 Goal:** $500-1,000 MRR (25-50 paying customers)  
**Time to $2K MRR:** 12-18 months at this pace

### Acceleration Scenarios

**If content goes viral (Reddit post, blog hits #1 Google):**
- Month 3-4 could jump to 5,000 visitors
- Could hit 20-30 paid subs faster
- MRR could reach $400-600 by Month 4

**If you add affiliates/partnerships early:**
- Divorce coaches send referrals
- 10 affiliates sending 5 sign-ups/month each = 50 extra signups
- Could accelerate to $500 MRR by Month 4

**If you nail pricing/conversion:**
- $29.99/month instead of $19.99 = +50% revenue from same users
- Annual plans ($199/year) = lower churn, better cash flow

### Path to $2K/Month

**Conservative (18 months):**
- Slow organic growth
- 3-5% conversion
- Steady content production
- No viral moments, just grinding

**Aggressive (6-9 months):**
- One piece of content goes viral (Reddit, blog, video)
- Strong conversion (5-7%)
- Partnerships/affiliates activated
- Paid ads if needed (after validation)

**Most Likely (12 months):**
- Mix of slow growth + occasional wins
- Conversion improves over time (testing)
- Content compounds (SEO takes 6-12 months)
- Community trust builds (testimonials, word of mouth)

---

## FINAL RECOMMENDATIONS

### Do This Week (Priority 1)

1. **Fund OpenAI account ($10)** — Analyzer needs to work
2. **Integrate Stripe** — Can't make money without payment system
3. **Define premium tier** — What's free vs. paid
4. **Add author name + photo to landing page** — Trust gap is KILLING you
5. **Implement landing page copy** — It's already written, just deploy it

### Do This Month (Priority 2)

6. **Get 3-5 testimonials** — Beta users, friends, fake if needed (fix later)
7. **Wire quiz email capture** — You're leaking conversions
8. **Write 4 blog posts** — SEO takes time, start now
9. **Post in 3 Reddit communities** — First traffic source
10. **Install analytics** — Can't improve what you don't measure

### Do This Quarter (Priority 3)

11. **Build scenario generator** — Premium value add
12. **Launch affiliate program** — Distribution through partners
13. **Create YouTube channel** — Long-form authority
14. **Test paid ads ($100 budget)** — If organic proves model
15. **Double down on what works** — Measure, learn, iterate

### Don't Do (Avoid These)

- ❌ Build more features before revenue
- ❌ Stay anonymous (kills trust)
- ❌ Wait for perfect design
- ❌ Over-optimize infrastructure
- ❌ Pivot before 90 days of data

---

## THE HONEST TRUTH

**You have a good product.** The framework is solid. The app works. The content exists.

**You don't have a business yet.** Zero revenue = hobby, not business.

**What's missing:**
1. Payment system (Stripe)
2. Traffic (content + community)
3. Trust (testimonials + identity)
4. Conversion optimization (urgency + social proof)

**Time to $2K/month:** 6-18 months depending on execution.

**Fastest path:** Build premium tier (Week 1), optimize landing page (Week 2), drive traffic (Week 3-4), get first paying customer (Week 4), scale what works (Month 2-6).

**Biggest risk:** Staying anonymous. Men 40-60 won't pay for dating advice from a ghost.

**Biggest opportunity:** You're solving a real problem with a unique framework for an underserved audience. If you show up, ship fast, and charge early, this can work.

---

**Now go build the damn business.**

Revenue first. Features later. Ship fast. Charge early. Test everything.

You're 30 days from first dollar if you execute this plan.

Good luck.

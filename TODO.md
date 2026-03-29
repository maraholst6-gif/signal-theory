# Signal Theory - Production TODO

## Critical Fixes

- [ ] **Password reset with 2FA** - Email verification flow before password change
- [ ] **Add remaining 27 quiz scenarios** - Currently only 3 beginner scenarios (need all 30)
- [ ] **Build interactive scenario engine** - 5-turn AI conversation with dynamic responses
- [ ] **Deploy backend migration** - Run `002_features.sql` on production database

## Infrastructure

- [ ] **Email capture system integration** - Connect web quiz signups to email list
- [ ] **Email automation** - Welcome sequences, drip campaigns
- [ ] **Host web quiz separately** - Marketing funnel landing page (separate from app)
- [ ] **Connect quiz → app** - Link quiz completions to app accounts
- [ ] **Backend usage tracking endpoint** - `/api/usage/track` for scenarios/analyses

## Features to Build

- [ ] **Interactive scenario categories** - Bar/Social, Texting, First Dates, Mixed Signals
- [ ] **Create Your Own Scenario** (Pro feature)
- [ ] **Admin panel UI** - Frontend for `/api/admin/*` endpoints
- [ ] **AI coaching prompt editor** - Visual interface for updating scenario coach logic
- [ ] **Stripe integration** - Payment processing for Pro tier ($19/mo)
- [ ] **Usage reset cron job** - Weekly reset (Monday 00:00)

## Polish / UX

- [ ] **Loading states** - Show spinners during API calls
- [ ] **Error handling** - Better user-facing error messages
- [ ] **Quiz review mode** - Review past quiz answers
- [ ] **Progress charts** - Visual dashboard for training progress
- [ ] **Mobile optimization** - Test on actual devices
- [ ] **Onboarding flow** - First-time user tutorial

## Marketing / Growth

- [ ] **Landing page** - Public marketing site (separate from app)
- [ ] **SEO optimization** - Meta tags, descriptions
- [ ] **Social sharing** - Share results on social media
- [ ] **Referral system** - Invite friends for bonus scenarios
- [ ] **Analytics** - Track user behavior, conversion funnels

## Backend Architecture

- [ ] **Rate limiting** - Prevent API abuse
- [ ] **Logging** - Better error tracking
- [ ] **Database backups** - Automated backup strategy
- [ ] **Monitoring** - Uptime alerts, error notifications

---

**Priority Order:**
1. Add all 30 scenarios (needed for complete product)
2. Deploy backend migration (needed for quiz/admin features)
3. Interactive scenario engine (core differentiator)
4. Email integration (marketing funnel)
5. Stripe (revenue)
6. Everything else

**Last updated:** 2026-03-29

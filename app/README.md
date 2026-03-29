# Signal Theory App

Dating practice app for divorced men 35–55. Train your signal reading, readiness, and strategy through AI-powered scenario practice and real-world interaction analysis.

---

## What is Signal Theory App

The app is the mobile practice layer of Signal Theory — a coaching system built around four signal states (POSITIVE, NEUTRAL, NEGATIVE, AMBIGUOUS) and three personal dimensions (Signal Reading, Readiness, Strategy).

**Features:**
- **Scenario Practice** — 15+ curated scenarios covering texting, in-person, and app-based dating situations. Four options, reveal correct answer with explanation.
- **Situation Analysis** — Paste a conversation or describe what happened. Get a structured AI read: signal state, behaviors, interpretation, recommended move, and profile-specific blind spot note.
- **Progress Tracking** (Pro) — Accuracy over time, dimension improvement bars, weekly patterns.
- **Profile Dashboard** — Your Signal Theory profile, scores, blind spots, action plan.
- **Free Tier** — 5 scenarios/week, 1 analysis/week. Resets every Monday.
- **Signal Pro** — Unlimited everything via RevenueCat subscription.

---

## Quick Start

```bash
cd signal-theory/app
npm install
cp .env.example .env
# Fill in .env values (see Environment Variables section)
npx expo start
```

---

## Environment Variables

Create a `.env` file (copy from `.env.example`):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**OpenAI key is never in the app.** It lives in Supabase secrets only:
```bash
supabase secrets set OPENAI_API_KEY=sk-...
```

---

## Supabase Setup

### 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the schema
In the Supabase SQL editor, paste and run the contents of `supabase/schema.sql`.

### 3. Deploy the Edge Function
```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy analyze-situation
supabase secrets set OPENAI_API_KEY=sk-...
```

### 4. (Optional) Seed scenarios
The app uses local seed data (`src/data/scenarios.ts`) with Supabase fallback. To populate the database with seed scenarios, write a seed script or paste the scenario data via the Supabase dashboard.

---

## RevenueCat Setup

1. Create an account at [revenuecat.com](https://revenuecat.com)
2. Create a new app for iOS and/or Android
3. Create entitlements: `signal_pro`
4. Create products in App Store Connect / Google Play:
   - Monthly: `signal_pro_monthly` at $19/month
   - Annual: `signal_pro_annual` at $149/year
5. Create an Offering with these packages
6. Copy your API keys to `.env`

---

## How to Run Locally

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# iOS (requires Mac + Xcode)
npx expo start --ios

# Android (requires Android Studio or connected device)
npx expo start --android

# Type checking
npm run type-check
```

---

## Project Structure

```
src/
├── navigation/        # AppNavigator (auth/onboarding/tabs routing)
├── screens/
│   ├── auth/          # Welcome, SignIn, SignUp
│   ├── onboarding/    # Onboarding + MiniQuiz
│   ├── main/          # Practice, Analyze, Progress, Profile tabs
│   ├── scenario/      # ScenarioScreen, ScenarioResultScreen
│   ├── analysis/      # AnalysisHistoryScreen
│   └── paywall/       # PaywallScreen
├── components/        # Reusable UI components
├── hooks/             # useAuth, useProfile, useUsageTracking
├── lib/               # supabase, revenuecat, openai clients
├── types/             # TypeScript types + navigation params
├── constants/         # theme (colors, spacing, typography)
└── data/              # scenarios.ts (local seed data)

supabase/
├── schema.sql         # Full database schema + RLS policies
└── functions/
    └── analyze-situation/
        └── index.ts   # Edge function calling OpenAI GPT-4
```

---

## Free Tier Enforcement

Usage limits are tracked in the `users` table (`scenarios_used_week`, `analyses_used_week`) and reset every Monday. Enforcement happens:

1. **Client side** — `useUsageTracking` checks limits before allowing access
2. **Server side** — Supabase RLS policies ensure users can only write their own rows
3. **Entitlements** — RevenueCat `checkProEntitlement()` is called on every usage check

Free limits:
- 5 scenarios per week
- 1 analysis per week

---

## Deploying to App Store / Google Play

### EAS Build (recommended)

```bash
npm install -g eas-cli
eas login
eas build:configure

# iOS
eas build --platform ios

# Android
eas build --platform android

# Submit
eas submit --platform ios
eas submit --platform android
```

### app.json configuration

Update `app.json` before building:
- Set your real `bundleIdentifier` (iOS) and `package` (Android)
- Update the `eas.projectId` with your EAS project ID
- Add your app icon at `./assets/icon.png` (1024x1024)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React Native + Expo SDK 51 |
| Navigation | React Navigation 6 (bottom tabs + native stack) |
| Auth + Database | Supabase |
| AI | OpenAI GPT-4 via Supabase Edge Function |
| Payments | RevenueCat |
| Language | TypeScript |
| Theme | Dark mode default |

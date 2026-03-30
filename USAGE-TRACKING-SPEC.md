# Usage Tracking Backend - Quick Build

**Goal:** Track quiz/analyzer usage per user account (not per device) to enable freemium limits.

---

## Database Migration

**File:** `backend/migrations/003_usage_tracking.sql`

```sql
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  quizzes_completed INT DEFAULT 0,
  scenarios_completed INT DEFAULT 0,
  analyzer_uses INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

CREATE INDEX idx_user_usage_user_week ON user_usage(user_id, week_start);
```

---

## Backend Routes

**File:** `backend/src/routes/usage.ts`

```typescript
import { Router } from 'express';
import { pool } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get current week's usage for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const weekStart = getWeekStart();

    const result = await pool.query(
      `SELECT quizzes_completed, scenarios_completed, analyzer_uses 
       FROM user_usage 
       WHERE user_id = $1 AND week_start = $2`,
      [userId, weekStart]
    );

    const usage = result.rows[0] || {
      quizzes_completed: 0,
      scenarios_completed: 0,
      analyzer_uses: 0
    };

    res.json(usage);
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({ error: 'Failed to fetch usage' });
  }
});

// Track usage (increment counter)
router.post('/track', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.body; // 'quiz' | 'scenario' | 'analyzer'
    const weekStart = getWeekStart();

    const column = type === 'quiz' ? 'quizzes_completed' 
                 : type === 'scenario' ? 'scenarios_completed'
                 : 'analyzer_uses';

    await pool.query(
      `INSERT INTO user_usage (user_id, week_start, ${column})
       VALUES ($1, $2, 1)
       ON CONFLICT (user_id, week_start)
       DO UPDATE SET ${column} = user_usage.${column} + 1, updated_at = NOW()`,
      [userId, weekStart]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking usage:', error);
    res.status(500).json({ error: 'Failed to track usage' });
  }
});

// Helper: Get Monday of current week (UTC)
function getWeekStart(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday = start of week
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0]; // YYYY-MM-DD
}

export default router;
```

---

## Register Route

**File:** `backend/src/index.ts`

Add after other route imports:

```typescript
import usageRoutes from './routes/usage';

// ... existing routes ...

app.use('/api/usage', usageRoutes);
```

---

## Frontend Integration

**File:** `app/index.html` (add these functions)

```javascript
// Check usage limits before allowing quiz/scenario/analyzer
async function checkUsage(type) {
  try {
    const res = await fetch(API_BASE + '/api/usage', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const usage = await res.json();

    // Free tier limits
    const limits = {
      quiz: 3,      // 3 quizzes per week
      scenario: 1,  // 1 scenario per week
      analyzer: 5   // 5 analyzer uses per week
    };

    const field = type === 'quiz' ? 'quizzes_completed'
                : type === 'scenario' ? 'scenarios_completed'
                : 'analyzer_uses';

    if (usage[field] >= limits[type]) {
      alert('Weekly limit reached! Upgrade to Pro for unlimited access.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Usage check failed:', error);
    return true; // Allow on error (fail open)
  }
}

// Track usage after completion
async function trackUsage(type) {
  try {
    await fetch(API_BASE + '/api/usage/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ type })
    });
  } catch (error) {
    console.error('Usage tracking failed:', error);
  }
}

// Call before starting quiz
async function startQuiz(level) {
  const allowed = await checkUsage('quiz');
  if (!allowed) return;
  
  // ... existing quiz start logic ...
}

// Call after quiz completion
async function completeQuiz() {
  // ... existing completion logic ...
  await trackUsage('quiz');
}
```

---

## Deployment

1. Run migration: `npx knex migrate:latest`
2. Deploy backend to Render
3. Test with curl:

```bash
# Get usage
curl -H "Authorization: Bearer <token>" https://signal-theory-backend.onrender.com/api/usage

# Track usage
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"type":"quiz"}' https://signal-theory-backend.onrender.com/api/usage/track
```

---

**That's it! Simple backend + frontend integration.**

# Signal Theory Frontend - Complete Rebuild Spec

## Context
Backend is complete and working. We need to rebuild `index.html` to match the new 4-module product structure.

**Backend API endpoints ready:**
- ✅ `/api/auth/signup`, `/api/auth/login`
- ✅ `/api/usage` (GET - returns scenarios_used_week, analyses_used_week, subscription_status)
- ✅ `/api/quizzes/complete` (POST - save quiz result)
- ✅ `/api/quizzes/history` (GET - user's quiz history + best scores)
- ✅ `/api/analyze` (POST - AI analysis of real situations)
- ✅ `/api/admin/*` (stats, prompt management)
- ✅ `/api/prompts/scenario-coach` (GET - active coaching prompt)

**Database schema complete:**
- users table has: scenarios_used_week, analyses_used_week, week_reset_at, subscription_status, is_admin
- quiz_results table
- interactive_sessions table
- ai_prompts table (seeded with initial coaching prompt)

---

## Product Structure

### 4-Module Navigation

**Bottom tab bar (mobile-first):**
```
🏠 Dashboard | 📚 Training | 🎭 Scenarios | 🔍 Analyze
```

**Replace the old 3-tab nav** (Scenarios/Analyze/Profile) with this new structure.

---

## Module 1: Dashboard (Home/Landing)

**Purpose:** Progress overview + navigation hub

**Layout:**
```html
<div id="dashboard-view" class="module-view">
  <!-- Header -->
  <div class="dashboard-header">
    <h1>🔥 Signal Theory</h1>
    <p class="subtitle">Welcome back, [User Name]</p>
  </div>

  <!-- Progress Card -->
  <div class="card progress-card">
    <h2>📊 Your Progress</h2>
    <div class="stat-row">
      <span>Training:</span>
      <span class="stat-value">40% (12/30)</span>
    </div>
    <div class="stat-row">
      <span>Scenarios:</span>
      <span class="stat-value">1 free remaining</span>
    </div>
    <div class="stat-row">
      <span>Accuracy:</span>
      <span class="stat-value">75%</span>
    </div>
  </div>

  <!-- Module Cards -->
  <div class="card module-card" onclick="showModule('training')">
    <div class="module-icon">📚</div>
    <h3>Training Quizzes</h3>
    <p>Test your signal recognition through structured scenarios</p>
    <div class="module-meta">
      <span>✅ Beginner - FREE</span>
      <span>🔒 Intermediate - PRO</span>
      <span>🔒 Advanced - PRO</span>
    </div>
    <button class="btn-primary">Start Training →</button>
  </div>

  <div class="card module-card" onclick="showModule('scenarios')">
    <div class="module-icon">🎭</div>
    <h3>Interactive Scenarios</h3>
    <p>Practice live conversations with AI feedback</p>
    <div class="module-meta">
      <span>Free: 1/week</span>
      <span>Pro: Unlimited</span>
    </div>
    <button class="btn-primary">Browse Scenarios →</button>
  </div>

  <div class="card module-card" onclick="showModule('analyze')">
    <div class="module-icon">🔍</div>
    <h3>Analyze Real Situations</h3>
    <p>Get expert analysis of your actual dates and texts</p>
    <div class="module-meta">
      <span>1 of 2 free this week</span>
    </div>
    <button class="btn-primary">Analyze Now →</button>
  </div>
</div>
```

**Data to load on dashboard:**
```javascript
// Fetch from API
const usage = await apiGet('/api/usage');
// Returns: {scenarios_used_week, analyses_used_week, subscription_status}

const quizHistory = await apiGet('/api/quizzes/history');
// Returns: {history: [...], best: {beginner: {...}, intermediate: {...}, advanced: {...}}}

// Calculate:
- Training progress: count completed quizzes / 30 total questions
- Accuracy: from quiz_results best scores
- Scenarios remaining: (subscription_status === 'free' ? 1 : 'unlimited') - scenarios_used_week
- Analyses remaining: (subscription_status === 'free' ? 2 : 'unlimited') - analyses_used_week
```

---

## Module 2: Training Quizzes

**Purpose:** Structured quiz (multiple choice) using the 30 existing scenarios

**Data Source:** Parse `scenarios/SCENARIOS.md` and categorize into:
- **Beginner** (10 easiest scenarios) - FREE
- **Intermediate** (10 medium scenarios) - PRO
- **Advanced** (10 hardest scenarios) - PRO

### Quiz Selection View
```html
<div id="training-view" class="module-view">
  <h1>📚 Training Quizzes</h1>
  <p class="subtitle">Master signal recognition through progressive challenges</p>

  <!-- Beginner Quiz Card -->
  <div class="card quiz-card">
    <div class="quiz-header">
      <h3>✅ Beginner Level</h3>
      <span class="badge badge-free">FREE</span>
    </div>
    <p>10 fundamental scenarios</p>
    <div class="quiz-stats">
      <span>Your best: 8/10 (80%)</span>
      <span>Last: 2 days ago</span>
    </div>
    <button class="btn-primary" onclick="startQuiz('beginner')">Start Quiz →</button>
    <button class="btn-secondary" onclick="reviewQuiz('beginner')">Review Answers</button>
  </div>

  <!-- Intermediate Quiz Card -->
  <div class="card quiz-card locked">
    <div class="quiz-header">
      <h3>🔒 Intermediate Level</h3>
      <span class="badge badge-pro">PRO</span>
    </div>
    <p>10 nuanced scenarios</p>
    <button class="btn-primary" onclick="showUpgrade()">Unlock with Pro →</button>
  </div>

  <!-- Advanced Quiz Card -->
  <div class="card quiz-card locked">
    <div class="quiz-header">
      <h3>🔒 Advanced Level</h3>
      <span class="badge badge-pro">PRO</span>
    </div>
    <p>10 subtle, ambiguous scenarios</p>
    <button class="btn-primary" onclick="showUpgrade()">Unlock with Pro →</button>
  </div>
</div>
```

### Quiz Question View
```html
<div id="quiz-question-view" class="module-view">
  <div class="quiz-progress">
    <span>Beginner Quiz</span>
    <span class="progress-indicator">Question 3 of 10</span>
  </div>

  <div class="card question-card">
    <h3>[Scenario Title]</h3>
    <p class="scenario-text">[Scenario description from SCENARIOS.md]</p>

    <div class="question-prompt">
      <strong>What does this signal?</strong>
    </div>

    <div class="options">
      <label class="option">
        <input type="radio" name="answer" value="a">
        <span>[Option A text]</span>
      </label>
      <label class="option">
        <input type="radio" name="answer" value="b">
        <span>[Option B text]</span>
      </label>
      <label class="option">
        <input type="radio" name="answer" value="c">
        <span>[Option C text]</span>
      </label>
      <label class="option">
        <input type="radio" name="answer" value="d">
        <span>[Option D text]</span>
      </label>
    </div>

    <button class="btn-primary" onclick="submitQuizAnswer()">Submit Answer →</button>
  </div>

  <button class="btn-back" onclick="showModule('training')">← Back to Quizzes</button>
</div>
```

### Quiz Answer Feedback (Immediate)
```html
<div id="quiz-feedback-view" class="module-view">
  <div class="quiz-progress">
    <span>Beginner Quiz</span>
    <span class="progress-indicator">Question 3 of 10</span>
  </div>

  <div class="card feedback-card correct"> <!-- or class="incorrect" -->
    <div class="feedback-header">
      <span class="feedback-icon">✅</span> <!-- or ❌ -->
      <h2>Correct!</h2> <!-- or "Incorrect" -->
    </div>

    <div class="feedback-section">
      <h4>Signal State</h4>
      <span class="signal-badge negative">NEGATIVE</span>
    </div>

    <div class="feedback-section">
      <h4>Observable Behaviors</h4>
      <ul>
        <li>Response time increased from 1hr to 6-8hrs</li>
        <li>Message length decreased</li>
        <li>Pattern shifted from engaged to minimal</li>
      </ul>
    </div>

    <div class="feedback-section">
      <h4>Analysis</h4>
      <p>[Explanation from SCENARIOS.md]</p>
    </div>

    <div class="feedback-section">
      <h4>Framework Principle</h4>
      <p class="principle">Disengagement is directional. Don't chase shrinking energy.</p>
    </div>

    <button class="btn-primary" onclick="nextQuizQuestion()">Next Question →</button>
  </div>
</div>
```

### Quiz Final Results
```html
<div id="quiz-results-view" class="module-view">
  <div class="card results-card">
    <h1>📊 Quiz Complete!</h1>
    
    <div class="score-display">
      <div class="score-circle">
        <span class="score-number">8</span>
        <span class="score-total">/10</span>
      </div>
      <p class="score-percentage">80%</p>
    </div>

    <div class="breakdown-section">
      <h3>Breakdown by Signal Type</h3>
      <div class="signal-breakdown">
        <div class="signal-stat positive">
          <span>Positive:</span>
          <span>3/3 ✅</span>
        </div>
        <div class="signal-stat neutral">
          <span>Neutral:</span>
          <span>2/4 ⚠️</span>
        </div>
        <div class="signal-stat negative">
          <span>Negative:</span>
          <span>3/3 ✅</span>
        </div>
      </div>
    </div>

    <div class="feedback-section">
      <h3>Areas to Improve</h3>
      <p><strong>Neutral Signals:</strong> You over-interpreted neutral situations as positive. Remember: absence of forward movement IS information.</p>
    </div>

    <div class="quiz-actions">
      <button class="btn-primary" onclick="startQuiz('[level]')">Retake Quiz</button>
      <button class="btn-secondary" onclick="reviewQuiz('[level]')">Review Answers</button>
      <button class="btn-secondary" onclick="showModule('dashboard')">Back to Dashboard</button>
    </div>
  </div>
</div>
```

**Quiz Logic:**
```javascript
const quizState = {
  level: 'beginner', // or 'intermediate', 'advanced'
  currentQuestion: 0,
  answers: [], // [{scenarioId, selected, correct, signalState}]
  scenarios: [] // loaded from embedded JSON
};

function startQuiz(level) {
  if (level !== 'beginner' && user.subscription_status === 'free') {
    showUpgrade();
    return;
  }
  
  quizState.level = level;
  quizState.currentQuestion = 0;
  quizState.answers = [];
  quizState.scenarios = getQuizScenarios(level); // 10 scenarios for this level
  
  showQuizQuestion();
}

function submitQuizAnswer() {
  const selected = document.querySelector('input[name="answer"]:checked').value;
  const scenario = quizState.scenarios[quizState.currentQuestion];
  const correct = selected === scenario.correctAnswer;
  
  quizState.answers.push({
    scenarioId: scenario.id,
    selected,
    correct,
    signalState: scenario.signalState
  });
  
  showQuizFeedback(scenario, selected, correct);
}

function nextQuizQuestion() {
  quizState.currentQuestion++;
  
  if (quizState.currentQuestion >= quizState.scenarios.length) {
    // Quiz complete - save and show results
    saveQuizResults();
    showQuizResults();
  } else {
    showQuizQuestion();
  }
}

async function saveQuizResults() {
  const score = quizState.answers.filter(a => a.correct).length;
  const total = quizState.answers.length;
  
  await apiPost('/api/quizzes/complete', {
    level: quizState.level,
    score,
    total,
    answers: quizState.answers
  });
}
```

---

## Module 3: Interactive Scenarios (Role-Play)

**Purpose:** AI-powered conversation practice with dynamic responses

**For MVP:** Build the UI structure + scenario selection, but use **placeholder static responses** for now. The AI conversation engine will be refined later after we analyze the Signal Theory book.

### Scenario Selection View
```html
<div id="scenarios-view" class="module-view">
  <h1>🎭 Interactive Scenarios</h1>
  <p class="subtitle">Practice live conversations with AI feedback</p>

  <div class="usage-banner">
    <span>Free: 1 scenario per week</span>
    <span class="usage-count">0 used this week</span>
  </div>

  <button class="btn-featured" onclick="startRandomScenario()">
    🎲 Random Scenario
  </button>

  <h3>Or choose by category:</h3>

  <div class="scenario-categories">
    <div class="category-card" onclick="browseCategory('bar')">
      <div class="category-icon">🍷</div>
      <h4>Bar / Social</h4>
      <p>4 scenarios</p>
    </div>

    <div class="category-card" onclick="browseCategory('texting')">
      <div class="category-icon">📱</div>
      <h4>Texting</h4>
      <p>5 scenarios</p>
    </div>

    <div class="category-card" onclick="browseCategory('first-date')">
      <div class="category-icon">☕</div>
      <h4>First Dates</h4>
      <p>4 scenarios</p>
    </div>

    <div class="category-card" onclick="browseCategory('mixed-signals')">
      <div class="category-icon">💬</div>
      <h4>Mixed Signals</h4>
      <p>3 scenarios</p>
    </div>
  </div>

  <!-- Pro Feature -->
  <div class="card pro-feature locked">
    <h3>🎨 Create Your Own Scenario</h3>
    <p>Design custom practice situations</p>
    <button class="btn-primary" onclick="showUpgrade()">Unlock with Pro →</button>
  </div>
</div>
```

### Category Browse View
```html
<div id="scenario-list-view" class="module-view">
  <button class="btn-back" onclick="showModule('scenarios')">← Back</button>

  <h2>🍷 Bar / Social Scenarios</h2>

  <div class="scenario-card" onclick="startInteractiveScenario('hotel-bar')">
    <h3>Hotel Bar Encounter</h3>
    <p>Practice approaching someone in a social setting</p>
    <div class="scenario-meta">
      <span class="difficulty intermediate">Intermediate</span>
      <span class="turns">~5 turns</span>
    </div>
  </div>

  <!-- More scenario cards... -->
</div>
```

### Interactive Scenario - Turn View
```html
<div id="interactive-turn-view" class="module-view">
  <div class="scenario-header">
    <h2>Hotel Bar Encounter</h2>
    <span class="turn-counter">Turn 1 of 5</span>
  </div>

  <div class="card turn-card">
    <!-- Situation description -->
    <div class="situation">
      <p>You're sitting at a hotel bar. An attractive woman sits down by herself two seats away from you.</p>
    </div>

    <!-- What do you do? -->
    <div class="turn-prompt">
      <strong>What do you do?</strong>
    </div>

    <!-- Options -->
    <div class="turn-options">
      <label class="turn-option">
        <input type="radio" name="turn-action" value="a">
        <span>A) Look over casually, try to meet her eye</span>
      </label>

      <label class="turn-option">
        <input type="radio" name="turn-action" value="b">
        <span>B) Tell the bartender her drink is on you</span>
      </label>

      <label class="turn-option">
        <input type="radio" name="turn-action" value="c">
        <span>C) Pat the stool next to you and say "You're welcome to join me"</span>
      </label>

      <label class="turn-option custom">
        <input type="radio" name="turn-action" value="custom">
        <span>D) Something else:</span>
        <textarea id="custom-response" placeholder="Type your response..."></textarea>
      </label>
    </div>

    <button class="btn-primary" onclick="submitTurnAction()">Submit →</button>
  </div>

  <button class="btn-back" onclick="exitScenario()">← Exit Scenario</button>
</div>
```

### Interactive Scenario - Response View (After Each Turn)
```html
<div id="interactive-response-view" class="module-view">
  <div class="scenario-header">
    <h2>Hotel Bar Encounter</h2>
    <span class="turn-counter">Turn 2 of 5</span>
  </div>

  <div class="card turn-card">
    <!-- What user did -->
    <div class="user-action">
      <strong>You:</strong>
      <p>"You're welcome to join me" (patting the bar stool)</p>
    </div>

    <!-- AI/Scenario response -->
    <div class="scenario-response">
      <strong>Her Response:</strong>
      <p>She rolls her eyes and says "No thank you," then turns her body away from you toward the bartender.</p>
    </div>

    <!-- Next prompt -->
    <div class="turn-prompt">
      <strong>What do you do next?</strong>
    </div>

    <!-- New options for turn 2... -->
    <div class="turn-options">
      <!-- Same structure as above -->
    </div>

    <button class="btn-primary" onclick="submitTurnAction()">Submit →</button>
  </div>
</div>
```

### Interactive Scenario - Final Analysis
```html
<div id="scenario-analysis-view" class="module-view">
  <div class="card analysis-card">
    <h1>📊 Scenario Complete</h1>

    <div class="signal-state-badge negative">
      <span>Signal State: NEGATIVE</span>
    </div>

    <div class="analysis-section">
      <h3>What I Saw</h3>
      <ul>
        <li><strong>Turn 1:</strong> You escalated too quickly (invited without rapport)</li>
        <li><strong>Her reaction:</strong> Eye roll + body turn (clear negative)</li>
        <li><strong>Turn 2:</strong> You backed off gracefully (good recovery)</li>
        <li><strong>Turns 3-5:</strong> Neutral conversation, she stayed disengaged</li>
      </ul>
    </div>

    <div class="analysis-section">
      <h3>Analysis</h3>
      <p>You skipped observational steps. Option A (casual eye contact) would have let you gauge interest before escalating. Patting the stool assumes interest that wasn't demonstrated.</p>
    </div>

    <div class="analysis-section">
      <h3>Better Approach</h3>
      <p>Start subtle → observe response → escalate only if signals are positive</p>
    </div>

    <div class="analysis-section principle">
      <h3>Signal Theory Principle</h3>
      <p>Don't create resistance by assuming interest. Let behavior show you the answer first.</p>
    </div>

    <div class="scenario-actions">
      <button class="btn-primary" onclick="showModule('scenarios')">Try Another Scenario</button>
      <button class="btn-secondary" onclick="showModule('dashboard')">Back to Dashboard</button>
    </div>
  </div>
</div>
```

**Interactive Scenario Logic (Placeholder for now):**
```javascript
const interactiveState = {
  scenarioId: '',
  turn: 1,
  maxTurns: 5,
  history: [], // [{turn, userAction, aiResponse}]
  scenario: null
};

async function startInteractiveScenario(scenarioId) {
  // Check usage limits
  const usage = await apiGet('/api/usage');
  if (usage.subscription_status === 'free' && usage.scenarios_used_week >= 1) {
    showUpgrade();
    return;
  }

  // Load scenario
  interactiveState.scenarioId = scenarioId;
  interactiveState.turn = 1;
  interactiveState.history = [];
  interactiveState.scenario = INTERACTIVE_SCENARIOS.find(s => s.id === scenarioId);

  showInteractiveTurn();
}

async function submitTurnAction() {
  const selected = document.querySelector('input[name="turn-action"]:checked');
  const action = selected.value === 'custom' 
    ? document.getElementById('custom-response').value
    : selected.parentElement.textContent;

  // For now: use placeholder responses
  // Later: Call /api/scenarios/interactive with coaching prompt
  
  const aiResponse = getPlaceholderResponse(interactiveState.turn, action);
  
  interactiveState.history.push({
    turn: interactiveState.turn,
    userAction: action,
    aiResponse
  });

  interactiveState.turn++;

  if (interactiveState.turn > interactiveState.maxTurns) {
    // Scenario complete - show analysis
    const analysis = await generateScenarioAnalysis(); // Uses /api/prompts/scenario-coach + Claude
    showScenarioAnalysis(analysis);
    
    // Track usage
    await apiPost('/api/usage/track', {type: 'scenario'});
  } else {
    // Show next turn
    showInteractiveResponseTurn();
  }
}
```

**Note:** The AI conversation engine will be refined after analyzing Signal Theory book. For now, build the structure with placeholder responses.

---

## Module 4: Analyze (Keep Existing, Fix Token)

**Current module is good - just needs:**

### Critical Fix: Add Authorization Header
```javascript
// Current analyze() function - FIX THIS:
async function analyze() {
  const input = document.getElementById('analyze-input').value;
  const token = localStorage.getItem('signal_theory_token');
  
  if (!token) {
    alert('Please log in first');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // ← ADD THIS LINE
      },
      body: JSON.stringify({ input_text: input })
    });

    const data = await res.json();
    displayAnalysisResult(data);
    
    // Track usage
    await apiPost('/api/usage/track', {type: 'analysis'});
  } catch (err) {
    console.error('Analysis error:', err);
    alert('Analysis failed');
  }
}
```

**Keep everything else the same** - the results display is already good.

---

## Data: 30 Scenarios from SCENARIOS.md

**Location:** `scenarios/SCENARIOS.md`

**Task:** Parse all 30 scenarios and embed them as JSON in index.html

**Structure:**
```javascript
const QUIZ_SCENARIOS = {
  beginner: [
    {
      id: 'delayed-response',
      title: 'Delayed Response Pattern',
      situation: '[Scenario text from SCENARIOS.md]',
      question: 'What does this signal?',
      options: [
        {id: 'a', text: '[Option A]'},
        {id: 'b', text: '[Option B]'},
        {id: 'c', text: '[Option C]'},
        {id: 'd', text: '[Option D]'}
      ],
      correctAnswer: 'b',
      signalState: 'NEGATIVE',
      explanation: '[Explanation from SCENARIOS.md]',
      principle: '[Framework principle]'
    },
    // ... 9 more
  ],
  intermediate: [
    // ... 10 scenarios
  ],
  advanced: [
    // ... 10 scenarios
  ]
};

const INTERACTIVE_SCENARIOS = [
  {
    id: 'hotel-bar',
    category: 'bar',
    title: 'Hotel Bar Encounter',
    description: 'Practice approaching someone in a social setting',
    difficulty: 'intermediate',
    initialSituation: 'You\'re sitting at a hotel bar...',
    // Placeholder responses for now - will be AI-generated later
  },
  // ... more scenarios
];
```

**Categorization guide:**
- **Beginner:** Clear, obvious signals (e.g., ghosting, enthusiastic response)
- **Intermediate:** Moderate ambiguity (e.g., delayed responses, mixed signals)
- **Advanced:** Subtle, requires careful analysis (e.g., neutral situations)

---

## Styling Requirements

**Keep current theme:**
- Purple gradient background (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`)
- White cards with shadow
- Mobile-first (max-width: 600px centered)
- Current button styles

**New elements:**
```css
/* Module cards on dashboard */
.module-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
  cursor: pointer;
  transition: transform 0.2s;
}

.module-card:hover {
  transform: translateY(-2px);
}

/* Quiz cards */
.quiz-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
}

.quiz-card.locked {
  opacity: 0.7;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.badge-free {
  background: #10b981;
  color: white;
}

.badge-pro {
  background: #8b5cf6;
  color: white;
}

/* Signal state badges */
.signal-badge {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  display: inline-block;
}

.signal-badge.positive { background: #10b981; color: white; }
.signal-badge.neutral { background: #f59e0b; color: white; }
.signal-badge.negative { background: #ef4444; color: white; }
.signal-badge.ambiguous { background: #6b7280; color: white; }

/* Score display */
.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem auto;
}

.score-number {
  font-size: 3rem;
  font-weight: bold;
}

.score-total {
  font-size: 1.5rem;
}
```

---

## Auth & API Helper Functions

**Keep existing auth code, just ensure all API calls include token:**

```javascript
// Helper for authenticated API calls
async function apiGet(endpoint) {
  const token = localStorage.getItem('signal_theory_token');
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

async function apiPost(endpoint, body) {
  const token = localStorage.getItem('signal_theory_token');
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  return res.json();
}
```

**Use these helpers everywhere** to avoid repeating the token bug.

---

## Implementation Checklist

### Phase 1: Structure (5 min)
- [ ] Update navigation (4 tabs: Dashboard/Training/Scenarios/Analyze)
- [ ] Create skeleton views for all 4 modules
- [ ] Wire up showModule() navigation

### Phase 2: Dashboard (10 min)
- [ ] Progress card (load from /api/usage + /api/quizzes/history)
- [ ] 3 module cards with descriptions
- [ ] Calculate stats (training %, scenarios remaining, accuracy)

### Phase 3: Training Quizzes (20 min)
- [ ] Parse all 30 scenarios from SCENARIOS.md
- [ ] Categorize into beginner/intermediate/advanced
- [ ] Quiz selection view
- [ ] Question view with options
- [ ] Answer feedback view (immediate after each question)
- [ ] Final results view
- [ ] Quiz state management
- [ ] Save results to /api/quizzes/complete

### Phase 4: Interactive Scenarios (15 min)
- [ ] Scenario selection view
- [ ] Category browse view
- [ ] Turn-based conversation UI
- [ ] Placeholder response logic (for now)
- [ ] Final analysis view
- [ ] Usage tracking

### Phase 5: Analyze (5 min)
- [ ] Fix token bug (add Authorization header)
- [ ] Track usage after analysis
- [ ] Keep everything else as-is

### Phase 6: Polish (10 min)
- [ ] Upgrade modal
- [ ] Loading states
- [ ] Error handling
- [ ] Mobile testing

---

## Expected Output

**File:** `index.html` (updated)
**Size:** ~100-150 KB (much larger than current 67KB)
**Contents:**
- All 30 scenarios embedded as JSON
- 4 complete module views
- Navigation system
- Auth (keep existing)
- All styling inline

**Testing after build:**
1. Login works
2. Dashboard loads with stats
3. Can start Beginner quiz, see questions, submit answers, see results
4. Intermediate/Advanced show upgrade modal
5. Scenarios module shows categories
6. Analyze works with token fix
7. Usage tracking updates after actions

---

## Success Criteria

✅ Multi-device usage tracking (backend)
✅ 4-module navigation works
✅ Dashboard shows progress
✅ Training quiz flow complete
✅ Interactive scenario structure ready
✅ Analyze token bug fixed
✅ All API calls authenticated
✅ Mobile-friendly

**Build this now. Backend is ready - just need the frontend to match!**

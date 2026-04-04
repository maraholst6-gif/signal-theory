import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import Anthropic from '@anthropic-ai/sdk';
import pool from '../db/pool';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface TurnRecord {
  turn: number;
  situation: string;
  user_response: string;
  her_response: string;
}

interface ScenarioSession {
  session_id: string;
  user_id: string;
  scenario_id: string | null;
  scenario_title: string;
  scenario_setup: string;
  custom_setup: string | null;
  initial_state: string;
  current_state: string;
  turn: number;
  history: TurnRecord[];
  current_situation: string;
  created_at: Date;
}

// ─────────────────────────────────────────────
// In-memory session store (short-lived, 5-turn max)
// ─────────────────────────────────────────────

const sessions = new Map<string, ScenarioSession>();

// Clean up sessions older than 2 hours every 30 minutes
setInterval(() => {
  const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);
  for (const [id, session] of sessions) {
    if (session.created_at < cutoff) sessions.delete(id);
  }
}, 30 * 60 * 1000);

// ─────────────────────────────────────────────
// State helpers
// ─────────────────────────────────────────────

const STATE_LABELS: Record<string, string> = {
  interested_engaged: 'Clearly Interested',
  neutral_open: 'Warm/Open',
  neutral_curious: 'Neutral/Curious',
  guarded_hesitant: 'Guarded',
  disengaged_polite: 'Pulling Back',
  disengaged_clear: 'Disengaged',
};

function randomizeInitialState(): string {
  const roll = Math.random();
  if (roll < 0.70) return 'neutral_curious';
  if (roll < 0.85) return 'interested_open'; // treated as neutral_open in later turns
  return 'guarded_hesitant';
}

function determineOutcome(session: ScenarioSession, endReason: string): string {
  if (endReason === 'user_disengaged') return 'user_disengaged';
  const s = session.current_state;
  if (s === 'interested_engaged') return 'interest_built';
  if (s === 'disengaged_clear' || s === 'disengaged_polite') return 'interest_lost';
  if (session.history.length >= 5) return 'successful_engagement';
  return 'mutual_disengagement';
}

// ─────────────────────────────────────────────
// Claude helpers
// ─────────────────────────────────────────────

async function generateFirstSituation(
  setup: string,
  initial_state: string
): Promise<{ situation: string; suggested_responses: string[] }> {
  const stateDescriptions: Record<string, string> = {
    neutral_curious: 'She is neutral but slightly curious — open to conversation if approached well, not actively seeking it.',
    interested_open: 'She is mildly interested and open — there is subtle warmth in her demeanor that rewards a confident, calibrated approach.',
    guarded_hesitant: 'She is a bit guarded — perhaps she has been burned before or is unsure about the setting. She will take more reading before opening up.',
  };

  const stateDesc = stateDescriptions[initial_state] ?? stateDescriptions['neutral_curious'];

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    temperature: 0.85,
    messages: [
      {
        role: 'user',
        content: `You are setting up a Signal Theory dating scenario for a practice exercise.

SCENARIO SETUP:
${setup}

HER STARTING STATE: ${stateDesc}

Generate an opening situation (2-3 sentences describing the moment and her current observable behavior) and exactly 3 response options for the user. Options should cover different calibration levels: one well-calibrated, one slightly over-invested, one too passive. Keep each option under 15 words.

Return ONLY valid JSON with this exact structure:
{
  "situation": "...",
  "suggested_responses": ["...", "...", "..."]
}`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Claude returned invalid JSON for first situation');
  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.situation || !Array.isArray(parsed.suggested_responses)) {
    throw new Error('Claude response missing required fields');
  }
  return parsed;
}

async function processTurn(
  session: ScenarioSession,
  user_response: string
): Promise<{
  her_response: string;
  her_new_state: string;
  situation: string;
  suggested_responses: string[];
  scenario_should_end: boolean;
}> {
  const historyText =
    session.history.length > 0
      ? session.history
          .map(
            (h) =>
              `Turn ${h.turn}:\n  Situation: ${h.situation}\n  User said: "${h.user_response}"\n  Her response: ${h.her_response}`
          )
          .join('\n\n')
      : '(This is the first turn.)';

  const systemPrompt = `You are the "other person" in a Signal Theory dating practice scenario. Respond realistically based on your current emotional state and the user's action.

## Your Current Emotional State
${STATE_LABELS[session.current_state] ?? session.current_state}

## Signal Theory Principles
- Behavior is the signal, not words alone
- Investment must be mutual to create momentum
- Disengagement has degrees — slight pullback vs. clear exit
- Recovery is possible if the user reads signals and adjusts

## Your Behavior Rules
1. Respond naturally as a woman in this real-life situation would
2. Your state shifts based on what the user does:
   - Calibrated, confident, reads the room → move toward interest
   - Over-invested, needy, or misses cues → move toward disengagement
   - Genuinely poor calibration sustained → clear disengagement
3. Show state through observable behavior, not narration:
   - interested_engaged: asks questions back, extends conversation, hints at future
   - neutral_open: polite and responsive, not initiating
   - neutral_curious: brief engagement, still observing
   - guarded_hesitant: short answers, doesn't volunteer much
   - disengaged_polite: very short answers, looks away, mentions leaving soon
   - disengaged_clear: gives clear exit signal, wraps conversation
4. Be realistic — not too easy, not too punishing
5. After turn 5, or if the user is clearly out, set scenario_should_end to true

## Scenario Context
${session.scenario_setup}

## Conversation History
${historyText}

## Current Situation
${session.current_situation}`;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 768,
    temperature: 0.75,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `The user responds: "${user_response}"

Evaluate their response through the Signal Theory lens and generate her realistic reaction.

Return ONLY valid JSON:
{
  "her_response": "Her dialogue, with brief behavioral note in parentheses",
  "her_new_state": "one of: interested_engaged, neutral_open, neutral_curious, guarded_hesitant, disengaged_polite, disengaged_clear",
  "situation": "2-3 sentence description of the new moment and her observable behavior",
  "suggested_responses": ["well-calibrated option", "slightly over-invested option", "too passive option"],
  "scenario_should_end": false
}`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Claude returned invalid JSON for turn');
  const parsed = JSON.parse(jsonMatch[0]);
  return parsed;
}

async function generateAnalysis(session: ScenarioSession): Promise<{
  summary: string;
  signals_observed: string[];
  what_you_did_well: string[];
  what_to_improve: string[];
}> {
  const historyText = session.history
    .map(
      (h) =>
        `Turn ${h.turn}:\n  Situation: ${h.situation}\n  User: "${h.user_response}"\n  Her: ${h.her_response}`
    )
    .join('\n\n');

  const finalStateLabel = STATE_LABELS[session.current_state] ?? session.current_state;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    temperature: 0.4,
    messages: [
      {
        role: 'user',
        content: `You are a Signal Theory coach. Analyze this completed practice scenario.

## Scenario
${session.scenario_setup}

## Full Conversation
${historyText || '(No turns completed — user ended immediately.)'}

## Final State
Her emotional state ended at: ${finalStateLabel}

## Your Task
Provide a Signal Theory breakdown. Be specific and honest. Reference actual moments from the conversation. Keep feedback actionable.

Return ONLY valid JSON:
{
  "summary": "2-3 sentence summary of what happened and overall trajectory",
  "signals_observed": ["specific signal 1", "specific signal 2", "specific signal 3"],
  "what_you_did_well": ["specific strength 1", "specific strength 2"],
  "what_to_improve": ["specific improvement 1", "specific improvement 2"]
}`,
      },
    ],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Claude returned invalid JSON for analysis');
  return JSON.parse(jsonMatch[0]);
}

// ─────────────────────────────────────────────
// GET /api/scenario-play/
// List all scenario templates
// ─────────────────────────────────────────────

router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { category, difficulty } = req.query as {
    category?: string;
    difficulty?: string;
  };

  try {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (category) {
      conditions.push(`category = $${idx++}`);
      values.push(category);
    }
    if (difficulty) {
      conditions.push(`difficulty = $${idx++}`);
      values.push(difficulty);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT id, title, category, setup, difficulty, is_premium
       FROM scenario_templates
       ${where}
       ORDER BY is_premium ASC, created_at ASC`,
      values
    );

    res.json({ scenarios: result.rows });
  } catch (err) {
    console.error('[scenario-play/list]', err);
    res.status(500).json({ error: 'Failed to fetch scenarios.' });
  }
});

// ─────────────────────────────────────────────
// GET /api/scenario-play/usage
// Check weekly usage for current user
// ─────────────────────────────────────────────

router.get('/usage', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    const [userResult, countResult] = await Promise.all([
      pool.query('SELECT tier FROM users WHERE id = $1', [userId]),
      pool.query(
        `SELECT COUNT(*) AS count FROM scenario_completions
         WHERE user_id = $1 AND completed_at > NOW() - INTERVAL '7 days'`,
        [userId]
      ),
    ]);

    const tier: string = userResult.rows[0]?.tier ?? 'free';
    const completions = parseInt(countResult.rows[0]?.count ?? '0', 10);

    const FREE_LIMIT = 3;
    const limit = tier === 'free' ? FREE_LIMIT : -1;
    const remaining = tier === 'free' ? Math.max(0, FREE_LIMIT - completions) : -1;

    // Reset at next Sunday midnight
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
    const resetsAt = new Date(now);
    resetsAt.setDate(now.getDate() + daysUntilSunday);
    resetsAt.setHours(0, 0, 0, 0);

    res.json({
      tier,
      completions_this_week: completions,
      limit,
      remaining,
      resets_at: resetsAt.toISOString(),
    });
  } catch (err) {
    console.error('[scenario-play/usage]', err);
    res.status(500).json({ error: 'Failed to check usage.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/scenario-play/start
// ─────────────────────────────────────────────

router.post('/start', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { scenario_id, custom_setup } = req.body as {
    scenario_id?: string;
    custom_setup?: string;
  };

  if (!scenario_id && !custom_setup?.trim()) {
    res.status(400).json({ error: 'scenario_id or custom_setup is required.' });
    return;
  }

  try {
    // Check tier + weekly usage
    const userResult = await pool.query('SELECT tier FROM users WHERE id = $1', [userId]);
    const tier: string = userResult.rows[0]?.tier ?? 'free';

    if (tier === 'free') {
      const countResult = await pool.query(
        `SELECT COUNT(*) AS count FROM scenario_completions
         WHERE user_id = $1 AND completed_at > NOW() - INTERVAL '7 days'`,
        [userId]
      );
      const completions = parseInt(countResult.rows[0]?.count ?? '0', 10);
      if (completions >= 3) {
        res.status(403).json({
          error: 'Weekly limit reached.',
          code: 'LIMIT_REACHED',
          message: 'Free tier allows 3 scenarios per week. Upgrade for unlimited access.',
        });
        return;
      }
    }

    // Custom scenario requires premium
    if (!scenario_id && custom_setup?.trim() && tier === 'free') {
      res.status(403).json({
        error: 'Premium required.',
        code: 'PREMIUM_REQUIRED',
        message: 'Building custom scenarios requires a premium account.',
      });
      return;
    }

    // Resolve scenario setup
    let scenarioTitle = 'Custom Scenario';
    let scenarioSetup = custom_setup?.trim() ?? '';
    let resolvedScenarioId: string | null = null;

    if (scenario_id) {
      const scenarioResult = await pool.query(
        'SELECT id, title, setup, is_premium FROM scenario_templates WHERE id = $1',
        [scenario_id]
      );

      if (scenarioResult.rows.length === 0) {
        res.status(404).json({ error: 'Scenario not found.' });
        return;
      }

      const template = scenarioResult.rows[0];

      if (template.is_premium && tier === 'free') {
        res.status(403).json({
          error: 'Premium required.',
          code: 'PREMIUM_REQUIRED',
          message: 'This scenario requires a premium account.',
        });
        return;
      }

      scenarioTitle = template.title;
      scenarioSetup = template.setup;
      resolvedScenarioId = template.id;
    }

    // Randomize initial state (Neutral 70%, Interested 15%, Guarded 15%)
    const initial_state = randomizeInitialState();

    // Generate first situation via Claude
    const { situation, suggested_responses } = await generateFirstSituation(
      scenarioSetup,
      initial_state
    );

    // Create session
    const session_id = randomUUID();
    const session: ScenarioSession = {
      session_id,
      user_id: userId,
      scenario_id: resolvedScenarioId,
      scenario_title: scenarioTitle,
      scenario_setup: scenarioSetup,
      custom_setup: custom_setup?.trim() ?? null,
      initial_state,
      current_state: initial_state,
      turn: 1,
      history: [],
      current_situation: situation,
      created_at: new Date(),
    };

    sessions.set(session_id, session);

    res.json({
      session_id,
      scenario: {
        title: scenarioTitle,
        setup: scenarioSetup,
        initial_state,
      },
      turn: 1,
      situation,
      suggested_responses,
    });
  } catch (err) {
    console.error('[scenario-play/start]', err);
    res.status(500).json({ error: 'Failed to start scenario.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/scenario-play/turn
// ─────────────────────────────────────────────

router.post('/turn', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { session_id, user_response } = req.body as {
    session_id?: string;
    user_response?: string;
  };

  if (!session_id || !user_response?.trim()) {
    res.status(400).json({ error: 'session_id and user_response are required.' });
    return;
  }

  const session = sessions.get(session_id);
  if (!session) {
    res.status(404).json({ error: 'Session not found or expired. Please start a new scenario.' });
    return;
  }
  if (session.user_id !== userId) {
    res.status(403).json({ error: 'Unauthorized.' });
    return;
  }

  try {
    const result = await processTurn(session, user_response.trim());

    // Record turn in history
    session.history.push({
      turn: session.turn,
      situation: session.current_situation,
      user_response: user_response.trim(),
      her_response: result.her_response,
    });

    // Advance session state
    session.current_state = result.her_new_state ?? session.current_state;
    session.turn += 1;
    session.current_situation = result.situation;

    const scenarioComplete = result.scenario_should_end === true || session.turn > 5;

    res.json({
      turn: session.turn,
      her_response: result.her_response,
      situation: result.situation,
      suggested_responses: result.suggested_responses ?? [],
      scenario_complete: scenarioComplete,
    });
  } catch (err) {
    console.error('[scenario-play/turn]', err);
    res.status(500).json({ error: 'Failed to process turn.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/scenario-play/end
// ─────────────────────────────────────────────

router.post('/end', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { session_id, reason = 'turns_completed' } = req.body as {
    session_id?: string;
    reason?: string;
  };

  if (!session_id) {
    res.status(400).json({ error: 'session_id is required.' });
    return;
  }

  const session = sessions.get(session_id);
  if (!session) {
    res.status(404).json({ error: 'Session not found or expired.' });
    return;
  }
  if (session.user_id !== userId) {
    res.status(403).json({ error: 'Unauthorized.' });
    return;
  }

  try {
    const [analysis] = await Promise.all([generateAnalysis(session)]);

    const outcome = determineOutcome(session, reason);

    // Save completion record
    await pool.query(
      `INSERT INTO scenario_completions (user_id, scenario_id, custom_setup, outcome, turns_taken)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        session.scenario_id,
        session.custom_setup,
        outcome,
        session.history.length,
      ]
    );

    sessions.delete(session_id);

    res.json({
      outcome,
      turns_taken: session.history.length,
      scenario_title: session.scenario_title,
      analysis,
    });
  } catch (err) {
    console.error('[scenario-play/end]', err);
    res.status(500).json({ error: 'Failed to generate analysis.' });
  }
});

// ─────────────────────────────────────────────
// POST /api/scenario-play/seed
// Admin endpoint — scenarios are seeded via migration, this just reports status
// ─────────────────────────────────────────────

router.post('/seed', async (req: Request, res: Response) => {
  const adminSecret = req.headers['x-admin-secret'];
  if (!adminSecret || adminSecret !== (process.env.ADMIN_SECRET ?? 'signal-theory-admin')) {
    res.status(403).json({ error: 'Unauthorized.' });
    return;
  }

  try {
    const result = await pool.query(
      'SELECT COUNT(*) AS total, SUM(CASE WHEN is_premium THEN 1 ELSE 0 END) AS premium FROM scenario_templates'
    );
    const { total, premium } = result.rows[0];
    res.json({
      message: 'Scenarios are seeded via migration 009_scenario_system.sql',
      total_scenarios: parseInt(total, 10),
      free_scenarios: parseInt(total, 10) - parseInt(premium ?? '0', 10),
      premium_scenarios: parseInt(premium ?? '0', 10),
    });
  } catch (err) {
    console.error('[scenario-play/seed]', err);
    res.status(500).json({ error: 'Failed to query scenarios.' });
  }
});

export default router;

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface AnalysisPayload {
  input_text: string;
  profile_type: string;
  signal_score: number;
  readiness_score: number;
  strategy_score: number;
  blind_spots: string[];
}

export interface AnalysisResult {
  signal_state: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'AMBIGUOUS';
  what_i_see: string;
  what_it_means: string;
  your_move: string;
  watch_for: string;
}

// ─────────────────────────────────────────────
// Build system prompt
// ─────────────────────────────────────────────

function buildSystemPrompt(payload: AnalysisPayload): string {
  const blindSpotsText =
    payload.blind_spots.length > 0
      ? payload.blind_spots.join(', ')
      : 'None identified yet';

  return `You are a Signal Theory coach helping a user analyze a dating interaction.

USER CONTEXT:
- Profile type: ${payload.profile_type}
- Signal reading: ${payload.signal_score}/10
- Readiness: ${payload.readiness_score}/10
- Strategy: ${payload.strategy_score}/10
- Blind spots: ${blindSpotsText}

SIGNAL STATES:
1. POSITIVE: Observable behavior showing clear interest (initiating, investing time/energy, making plans, physical warmth)
2. NEUTRAL: Interaction exists but clear interest is not demonstrated
3. NEGATIVE: Behavior indicating disinterest, de-escalation, or withdrawal
4. AMBIGUOUS: Mixed signals or insufficient data to read clearly

RULES:
- Base analysis ONLY on observable behavior described by the user
- Cite specific actions, not assumptions
- Recommend proportional responses — no chasing, no overreacting
- Include a pattern note specific to their profile type and blind spots
- Direct, not preachy. User is 35-55, divorced, has a BS detector.
- Do not moralize or add unsolicited relationship advice
- Keep each section concise: 1-3 sentences max

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS (these exact labels, no extra headers):
**Signal State:** [POSITIVE | NEUTRAL | NEGATIVE | AMBIGUOUS]
**What I See:** [2-3 specific observable behaviors from the description]
**What It Means:** [1-2 sentences on what this pattern typically indicates]
**Your Move:** [Calibrated, specific recommendation]
**Watch For:** [Profile-specific blind spot note — 1 sentence]`;
}

// ─────────────────────────────────────────────
// Parse structured response
// ─────────────────────────────────────────────

function parseResponse(text: string): AnalysisResult {
  const extract = (label: string): string => {
    const pattern = new RegExp(
      `\\*\\*${label}:\\*\\*\\s*(.+?)(?=\\*\\*|$)`,
      'is'
    );
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  };

  const signalStateRaw = extract('Signal State').toUpperCase();
  const validStates = ['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'AMBIGUOUS'] as const;
  const signal_state =
    validStates.find((s) => signalStateRaw.includes(s)) ?? 'NEUTRAL';

  return {
    signal_state,
    what_i_see:
      extract('What I See') || 'Unable to parse observable behaviors.',
    what_it_means:
      extract('What It Means') || 'Unable to parse interpretation.',
    your_move: extract('Your Move') || 'Unable to parse recommendation.',
    watch_for: extract('Watch For') || 'Unable to parse pattern note.',
  };
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────

export async function analyzeWithClaude(
  payload: AnalysisPayload
): Promise<AnalysisResult> {
  const systemPrompt = buildSystemPrompt(payload);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    temperature: 0.3,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: payload.input_text,
      },
    ],
  });

  const rawContent =
    message.content[0].type === 'text' ? message.content[0].text : '';

  if (!rawContent) {
    throw new Error('No response from Claude.');
  }

  return parseResponse(rawContent);
}

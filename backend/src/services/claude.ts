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
  signal_state: 'INTEREST' | 'UNCERTAINTY' | 'COMFORT' | 'DISENGAGEMENT';
  the_signal: string;
  the_story: string;
  whats_happening: string;
  your_move: string;
  blind_spot: string;
}

// ─────────────────────────────────────────────
// Build system prompt
// ─────────────────────────────────────────────

function buildSystemPrompt(payload: AnalysisPayload): string {
  const blindSpotsText =
    payload.blind_spots.length > 0
      ? payload.blind_spots.join(', ')
      : 'None identified yet';

  return `You are a Signal Theory coach. You help men 35-55 read dating situations accurately by separating observable signals from the stories they tell themselves.

USER CONTEXT:
- Profile type: ${payload.profile_type}
- Signal reading: ${payload.signal_score}/10
- Readiness: ${payload.readiness_score}/10
- Strategy: ${payload.strategy_score}/10
- Blind spots: ${blindSpotsText}

THE FOUR SIGNAL STATES (use these exact terms):
1. INTEREST: Moving toward you with tangible investment — initiates, makes time despite inconvenience, plans materialize, energy feels easy. Risk: over-accelerating and seeking reassurance.
2. UNCERTAINTY: Evaluating, hasn't decided direction — inconsistent initiation, warm in-person then distant, engagement is situational. Risk: treating it like hidden interest and adding pressure.
3. COMFORT: Safe and familiar but not romantically pulled — easy conversation, emotional access, but no escalation or urgency. Risk: mistaking access for attraction and lingering indefinitely.
4. DISENGAGEMENT: Moving away, reducing investment — slower responses, plans fall through without rescheduling, polite but transactional. Risk: fighting the signal and trying to reverse it.

Only ONE state dominates at any time. Don't hedge with "mixed signals" — identify the dominant direction.

CORE PRINCIPLES (weave these into your analysis naturally):
- Signals vs. Stories: Signals are observable, repeatable behavior. Stories are interpretations that fill ambiguity gaps. If your explanation is longer than your observation, you're in a story.
- Calibration over technique: Success isn't about what to say. It's about being accurately calibrated with reality.
- Pacing: Over-investment early kills momentum. What feels sincere to you can feel like pressure to someone still deciding. Investment should match clarity.
- Interface awareness: Texting strips tone, timing, and presence. Read receipts create narratives where there's just information. Don't read signal strength through a bad medium.
- Behavior reveals priorities. Words manage feelings.

VOICE:
- Direct and specific. This man has built an adult life, survived a divorce, and has zero patience for vague advice.
- Name the pattern, explain why it matters, give a concrete move.
- No moralizing. No "you should be open to..." No therapy-speak.
- Honest about hard truths — don't soften disengagement into "maybe she's busy."
- When you teach, teach with a framework: "Here's the pattern, here's what it means, here's why men misread it."

FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS (these exact labels, no extra headers):
**Signal State:** [INTEREST | UNCERTAINTY | COMFORT | DISENGAGEMENT]
**The Signal:** [2-3 specific observable behaviors from their description. Quote actions, not assumptions. Name the directional pattern.]
**The Story You're Probably Telling Yourself:** [1-2 sentences — the hopeful or anxious narrative most men construct here. Call it out directly.]
**What's Actually Happening:** [2-3 sentences — what this behavioral pattern reliably indicates. Teach the principle behind it.]
**Your Move:** [Specific, proportional, calibrated action. Not "be yourself" — tell them exactly what to do and what NOT to do.]
**The Blind Spot:** [Profile-specific pattern this user tends to fall into. Make it personal based on their blind spots and profile type.]`;
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
  const validStates = ['INTEREST', 'UNCERTAINTY', 'COMFORT', 'DISENGAGEMENT'] as const;
  const signal_state =
    validStates.find((s) => signalStateRaw.includes(s)) ?? 'UNCERTAINTY';

  return {
    signal_state,
    the_signal:
      extract('The Signal') || 'Unable to parse observable behaviors.',
    the_story:
      extract("The Story You're Probably Telling Yourself") || extract('The Story') || '',
    whats_happening:
      extract("What's Actually Happening") || extract('What') || 'Unable to parse interpretation.',
    your_move: extract('Your Move') || 'Unable to parse recommendation.',
    blind_spot: extract('The Blind Spot') || extract('Blind Spot') || '',
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

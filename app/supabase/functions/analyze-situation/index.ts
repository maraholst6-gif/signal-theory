// ─────────────────────────────────────────────
// Signal Theory — Supabase Edge Function
// analyze-situation
//
// Deploy: supabase functions deploy analyze-situation
// Secret: supabase secrets set OPENAI_API_KEY=sk-...
// ─────────────────────────────────────────────

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface RequestPayload {
  input_text: string;
  profile_type: string;
  signal_score: number;
  readiness_score: number;
  strategy_score: number;
  blind_spots: string[];
}

interface AnalysisResult {
  signal_state: string;
  what_i_see: string;
  what_it_means: string;
  your_move: string;
  watch_for: string;
}

// ─────────────────────────────────────────────
// CORS headers
// ─────────────────────────────────────────────

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ─────────────────────────────────────────────
// Build system prompt
// ─────────────────────────────────────────────

function buildSystemPrompt(payload: RequestPayload): string {
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
// Parse OpenAI response into structured JSON
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
  const validStates = ['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'AMBIGUOUS'];
  const signal_state = validStates.find((s) => signalStateRaw.includes(s)) ?? 'NEUTRAL';

  return {
    signal_state,
    what_i_see: extract('What I See') || 'Unable to parse observable behaviors.',
    what_it_means: extract('What It Means') || 'Unable to parse interpretation.',
    your_move: extract('Your Move') || 'Unable to parse recommendation.',
    watch_for: extract('Watch For') || 'Unable to parse pattern note.',
  };
}

// ─────────────────────────────────────────────
// Main handler
// ─────────────────────────────────────────────

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload: RequestPayload = await req.json();

    // Validate required fields
    if (!payload.input_text?.trim()) {
      return new Response(
        JSON.stringify({ error: 'input_text is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Call OpenAI GPT-4
    const openaiResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: buildSystemPrompt(payload),
            },
            {
              role: 'user',
              content: payload.input_text,
            },
          ],
          max_tokens: 600,
          temperature: 0.3,
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('[analyze-situation] OpenAI error:', errorData);
      return new Response(
        JSON.stringify({ error: 'AI analysis failed. Please try again.' }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const openaiData = await openaiResponse.json();
    const rawContent: string =
      openaiData.choices?.[0]?.message?.content ?? '';

    if (!rawContent) {
      return new Response(
        JSON.stringify({ error: 'No response from AI. Please try again.' }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const result = parseResponse(rawContent);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[analyze-situation] Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

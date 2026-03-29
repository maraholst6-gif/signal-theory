import { callEdgeFunction } from './supabase';
import { AIAnalysisResponse } from '../types';

// ─────────────────────────────────────────────
// Analyze a dating situation via Supabase Edge Function
// OpenAI calls happen server-side only
// ─────────────────────────────────────────────

export interface AnalyzePayload {
  input_text: string;
  profile_type: string;
  signal_score: number;
  readiness_score: number;
  strategy_score: number;
  blind_spots: string[];
}

export async function analyzeSituation(
  payload: AnalyzePayload
): Promise<AIAnalysisResponse> {
  const result = await callEdgeFunction<AIAnalysisResponse>(
    'analyze-situation',
    payload
  );
  return result;
}

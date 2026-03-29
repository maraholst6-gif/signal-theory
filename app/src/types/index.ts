// ─────────────────────────────────────────────
// Core domain types for Signal Theory app
// ─────────────────────────────────────────────

export type SignalState = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'AMBIGUOUS';
export type SubscriptionStatus = 'free' | 'monthly' | 'annual';
export type ScenarioCategory = 'texting' | 'in-person' | 'app-based';
export type ScenarioDifficulty = 'basic' | 'intermediate' | 'advanced';

export type ProfileType =
  | 'ready-navigator'
  | 'rusty-romantic'
  | 'signal-blind'
  | 'over-analyst'
  | 'unknown';

// ─────────────────────────────────────────────
// User
// ─────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  display_name?: string;
  profile_type: ProfileType | string;
  subscription_status: SubscriptionStatus;
  scenarios_used_week: number;
  analyses_used_week: number;
  week_reset_at: string;
  quiz_profile_id?: string;
  created_at: string;
}

// ─────────────────────────────────────────────
// Quiz Profile (from web quiz)
// ─────────────────────────────────────────────

export interface QuizProfile {
  id: string;
  email: string;
  profile_type: string;
  signal_score: number;
  readiness_score: number;
  strategy_score: number;
  weak_questions: WeakQuestion[];
  action_plan_practices: string[];
  quiz_completed_at: string;
  app_linked_at?: string;
}

export interface WeakQuestion {
  question_id: number;
  question_text: string;
  user_answer: string;
  correct_answer: string;
}

// ─────────────────────────────────────────────
// Scenario
// ─────────────────────────────────────────────

export interface ScenarioOption {
  text: string;
  is_correct: boolean;
  explanation: string;
}

export interface Scenario {
  id: string;
  title: string;
  body: string;
  options: ScenarioOption[];
  correct_signal_state: SignalState;
  category: ScenarioCategory;
  difficulty: ScenarioDifficulty;
  target_dimensions: string[];
  target_profiles: string[];
  created_at?: string;
}

// ─────────────────────────────────────────────
// Scenario Result
// ─────────────────────────────────────────────

export interface ScenarioResult {
  id: string;
  user_id: string;
  scenario_id: string;
  selected_option: number;
  was_correct: boolean;
  created_at: string;
}

// ─────────────────────────────────────────────
// Analysis
// ─────────────────────────────────────────────

export interface AIAnalysisResponse {
  signal_state: SignalState;
  what_i_see: string;
  what_it_means: string;
  your_move: string;
  watch_for: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  input_text: string;
  signal_state: SignalState;
  ai_response: AIAnalysisResponse;
  created_at: string;
}

// ─────────────────────────────────────────────
// Mini Quiz
// ─────────────────────────────────────────────

export interface MiniQuizQuestion {
  id: number;
  text: string;
  answers: MiniQuizAnswer[];
}

export interface MiniQuizAnswer {
  label: string;
  text: string;
  profile_scores: Partial<Record<ProfileType, number>>;
}

// ─────────────────────────────────────────────
// Usage / Entitlements
// ─────────────────────────────────────────────

export interface UsageState {
  scenariosUsed: number;
  scenariosLimit: number;
  analysesUsed: number;
  analysesLimit: number;
  isPro: boolean;
  canUseScenario: boolean;
  canUseAnalysis: boolean;
}

// ─────────────────────────────────────────────
// Navigation param lists
// ─────────────────────────────────────────────

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type OnboardingStackParamList = {
  Onboarding: undefined;
  MiniQuiz: undefined;
};

export type PracticeStackParamList = {
  PracticeHome: undefined;
  Scenario: { scenarioId: string };
  ScenarioResult: {
    scenarioId: string;
    selectedOption: number;
    wasCorrect: boolean;
  };
};

export type AnalyzeStackParamList = {
  AnalyzeHome: undefined;
  AnalysisHistory: undefined;
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Paywall: { trigger: 'scenario' | 'analysis' | 'progress' | 'manual' };
};

export type MainTabParamList = {
  Practice: undefined;
  Analyze: undefined;
  Progress: undefined;
  Profile: undefined;
};

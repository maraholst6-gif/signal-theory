import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';
import { User, QuizProfile, ProfileType } from '../types';

// ─────────────────────────────────────────────
// useProfile hook
// Manages user profile data + quiz profile linkage
// ─────────────────────────────────────────────

interface ProfileState {
  user: User | null;
  quizProfile: QuizProfile | null;
  loading: boolean;
  error: string | null;
}

interface ProfileActions {
  updateProfileType: (profileType: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  setProfileFromQuiz: (answers: number[]) => Promise<string>;
}

export function useProfile(userId?: string): ProfileState & ProfileActions {
  const [user, setUser] = useState<User | null>(null);
  const [quizProfile, setQuizProfile] = useState<QuizProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (): Promise<void> => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await api.profile.get();

      if (result.error) {
        setError('Failed to load profile.');
        return;
      }

      if (result.data?.user) {
        setUser(result.data.user as User);
      }

      if (result.data?.quizProfile) {
        setQuizProfile(result.data.quizProfile as QuizProfile);
      }
    } catch (err: unknown) {
      setError('An unexpected error occurred loading your profile.');
      console.error('[useProfile] fetchProfile error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, fetchProfile]);

  // ── Update profile type ──
  const updateProfileType = useCallback(
    async (profileType: string): Promise<void> => {
      if (!userId) return;

      try {
        const result = await api.profile.update({ profile_type: profileType });

        if (result.error) {
          console.error('[useProfile] updateProfileType error:', result.error);
          return;
        }

        if (result.data?.user) {
          setUser(result.data.user as User);
        } else {
          setUser((prev) =>
            prev ? { ...prev, profile_type: profileType } : null
          );
        }
      } catch (err) {
        console.error('[useProfile] updateProfileType unexpected error:', err);
      }
    },
    [userId]
  );

  // ── Derive profile from mini-quiz answers ──
  const setProfileFromQuiz = useCallback(
    async (answers: number[]): Promise<string> => {
      const profileType = deriveProfileFromAnswers(answers);

      if (userId) {
        await updateProfileType(profileType);
      }

      return profileType;
    },
    [userId, updateProfileType]
  );

  return {
    user,
    quizProfile,
    loading,
    error,
    updateProfileType,
    refreshProfile: fetchProfile,
    setProfileFromQuiz,
  };
}

// ─────────────────────────────────────────────
// Derive profile type from mini-quiz answer indices
// 5 questions, answer index 0-3
// ─────────────────────────────────────────────

function deriveProfileFromAnswers(answers: number[]): ProfileType {
  const scores: Record<ProfileType, number> = {
    'ready-navigator': 0,
    'over-analyst': 0,
    'rusty-romantic': 0,
    'signal-blind': 0,
    unknown: 0,
  };

  // Q1: "She texts 'maybe' to your date invite."
  const q1Map: Partial<Record<number, ProfileType>> = {
    0: 'ready-navigator',
    1: 'over-analyst',
    2: 'over-analyst',
    3: 'rusty-romantic',
  };

  // Q2: "After 3 dates she's warm but slow to text back."
  const q2Map: Partial<Record<number, ProfileType>> = {
    0: 'over-analyst',
    1: 'ready-navigator',
    2: 'signal-blind',
    3: 'rusty-romantic',
  };

  // Q3: "Thinking about your ex during a new date."
  const q3Map: Partial<Record<number, ProfileType>> = {
    0: 'ready-navigator',
    1: 'signal-blind',
    2: 'over-analyst',
    3: 'rusty-romantic',
  };

  // Q4: "She suggests 'should grab dinner sometime.'"
  const q4Map: Partial<Record<number, ProfileType>> = {
    0: 'ready-navigator',
    1: 'rusty-romantic',
    2: 'over-analyst',
    3: 'ready-navigator',
  };

  // Q5: "Best move when interest drops: no more texts?"
  const q5Map: Partial<Record<number, ProfileType>> = {
    0: 'ready-navigator',
    1: 'over-analyst',
    2: 'rusty-romantic',
    3: 'signal-blind',
  };

  const maps = [q1Map, q2Map, q3Map, q4Map, q5Map];

  answers.forEach((answer, idx) => {
    const map = maps[idx];
    if (map) {
      const profile = map[answer];
      if (profile) scores[profile] += 1;
    }
  });

  let topProfile: ProfileType = 'ready-navigator';
  let topScore = 0;

  (Object.keys(scores) as ProfileType[]).forEach((key) => {
    if (key !== 'unknown' && scores[key] > topScore) {
      topScore = scores[key];
      topProfile = key;
    }
  });

  return topProfile;
}

// ─────────────────────────────────────────────
// Profile metadata helpers (unchanged)
// ─────────────────────────────────────────────

export interface ProfileMeta {
  title: string;
  description: string;
  blindSpots: string[];
  actionPlan: string[];
  signalScore: number;
  readinessScore: number;
  strategyScore: number;
}

export function getProfileMeta(profileType: string): ProfileMeta {
  const profiles: Record<string, ProfileMeta> = {
    'ready-navigator': {
      title: 'Ready Navigator',
      description:
        'You read situations accurately and move with intention. Your challenge is trusting your own reads without second-guessing.',
      blindSpots: [
        'Overthinking clear signals',
        'Hesitating when the answer is obvious',
      ],
      actionPlan: [
        'Act on POSITIVE signals within 24 hours',
        'Practice naming the signal state before deciding',
        'Trust first reads more often',
      ],
      signalScore: 8,
      readinessScore: 8,
      strategyScore: 7,
    },
    'over-analyst': {
      title: 'Over-Analyst',
      description:
        'You see the patterns, but you analyze so long that windows close. Your data is usually right — your timing is the problem.',
      blindSpots: [
        'Analysis paralysis on clear signals',
        'Waiting for certainty before acting',
        'Reading too much into neutral behavior',
      ],
      actionPlan: [
        'Set a 24-hour decision rule: if you know the signal, act',
        'Practice distinguishing NEUTRAL from NEGATIVE',
        'Stop seeking additional data when you already have enough',
      ],
      signalScore: 7,
      readinessScore: 6,
      strategyScore: 5,
    },
    'rusty-romantic': {
      title: 'Rusty Romantic',
      description:
        "Your instincts are good but they've been dormant. You sometimes over-invest emotionally before signals warrant it.",
      blindSpots: [
        "Projecting interest that isn't there",
        'Moving too fast emotionally',
        'Misreading warmth as commitment',
      ],
      actionPlan: [
        'Name the signal state before every action',
        'Practice matching energy instead of exceeding it',
        'Track patterns over time, not single moments',
      ],
      signalScore: 5,
      readinessScore: 7,
      strategyScore: 6,
    },
    'signal-blind': {
      title: 'Signal Blind',
      description:
        'You often miss or misread signals, especially negative ones. The good news: this is learnable, and recognizing it is the first step.',
      blindSpots: [
        'Missing de-escalation signals',
        'Interpreting silence as neutral',
        'Confusing politeness with interest',
      ],
      actionPlan: [
        'Learn the three NEGATIVE signal patterns first',
        "Practice the \"would she do this if she weren't interested?\" test",
        'Do one scenario practice session per day',
      ],
      signalScore: 4,
      readinessScore: 6,
      strategyScore: 5,
    },
    unknown: {
      title: 'Getting Started',
      description:
        'Complete the quiz to get your personalized Signal Theory profile.',
      blindSpots: [],
      actionPlan: [
        'Complete the profile quiz',
        'Try your first scenario',
        'Analyze a real situation',
      ],
      signalScore: 5,
      readinessScore: 5,
      strategyScore: 5,
    },
  };

  return profiles[profileType] ?? profiles['unknown'];
}

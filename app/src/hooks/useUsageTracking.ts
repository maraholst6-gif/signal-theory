import { useCallback } from 'react';
import api from '../lib/api';
import { checkProEntitlement } from '../lib/revenuecat';
import { User, UsageState } from '../types';

// ─────────────────────────────────────────────
// Free tier limits
// ─────────────────────────────────────────────

const FREE_SCENARIO_LIMIT = 5;
const FREE_ANALYSIS_LIMIT = 1;

// ─────────────────────────────────────────────
// useUsageTracking hook
// ─────────────────────────────────────────────

interface UsageTrackingActions {
  computeUsageState: (user: User) => Promise<UsageState>;
  recordScenarioUsed: (userId: string) => Promise<void>;
  recordAnalysisUsed: (userId: string) => Promise<void>;
}

export function useUsageTracking(): UsageTrackingActions {
  // ── Compute current usage state ──
  const computeUsageState = useCallback(
    async (_user: User): Promise<UsageState> => {
      // Fetch current usage from API first — DB tier is authoritative for test accounts
      const result = await api.usage.get();
      console.log('[useUsageTracking] /api/usage response:', result.data);

      const scenariosUsed = result.data?.scenarios_used_week ?? 0;
      const analysesUsed = result.data?.analyses_used_week ?? 0;

      // DB tier = 'premium' takes priority; skip RevenueCat entirely if already premium
      const dbPremium = result.data?.tier === 'premium';
      console.log('[useUsageTracking] dbPremium:', dbPremium, '| tier:', result.data?.tier);

      const rcPro = dbPremium ? false : await checkProEntitlement();
      console.log('[useUsageTracking] rcPro:', rcPro);

      const isPro = dbPremium || rcPro;
      console.log('[useUsageTracking] isPro:', isPro);

      if (isPro) {
        return {
          scenariosUsed,
          scenariosLimit: Infinity,
          analysesUsed,
          analysesLimit: Infinity,
          isPro: true,
          canUseScenario: true,
          canUseAnalysis: true,
        };
      }

      return {
        scenariosUsed,
        scenariosLimit: FREE_SCENARIO_LIMIT,
        analysesUsed,
        analysesLimit: FREE_ANALYSIS_LIMIT,
        isPro: false,
        canUseScenario: scenariosUsed < FREE_SCENARIO_LIMIT,
        canUseAnalysis: analysesUsed < FREE_ANALYSIS_LIMIT,
      };
    },
    []
  );

  // ── Record scenario used (incremented server-side on result submit) ──
  // This is a no-op here — the backend increments atomically in POST /scenarios/:id/result
  const recordScenarioUsed = useCallback(
    async (_userId: string): Promise<void> => {
      // Server-side increment happens in scenarios route
    },
    []
  );

  // ── Record analysis used (incremented server-side on analyze call) ──
  // This is a no-op here — the backend increments atomically in POST /analyze
  const recordAnalysisUsed = useCallback(
    async (_userId: string): Promise<void> => {
      // Server-side increment happens in analysis route
    },
    []
  );

  return {
    computeUsageState,
    recordScenarioUsed,
    recordAnalysisUsed,
  };
}

import { useState, useEffect, useCallback } from 'react';
import api, { tokenStorage } from '../lib/api';
import { identifyUser, resetRevenueCat } from '../lib/revenuecat';
import { User } from '../types';

// ─────────────────────────────────────────────
// useAuth hook
// Manages JWT session + app user profile
// ─────────────────────────────────────────────

interface AuthState {
  appUser: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): AuthState & AuthActions {
  const [appUser, setAppUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ── Fetch user profile from API ──
  const fetchUser = useCallback(async (): Promise<void> => {
    const result = await api.profile.get();

    if (result.data?.user) {
      setAppUser(result.data.user as User);
      setIsAuthenticated(true);
    } else {
      setAppUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // ── Initialize from stored token on mount ──
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const hasToken = await tokenStorage.getAccessToken();

        if (!mounted) return;

        if (hasToken) {
          await fetchUser();
        }
      } catch (err) {
        console.error('[useAuth] init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [fetchUser]);

  // ── Sign in ──
  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      setError(null);

      const result = await api.auth.login(
        email.trim().toLowerCase(),
        password
      );

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      if (result.data?.user) {
        setAppUser(result.data.user as User);
        setIsAuthenticated(true);
        await identifyUser((result.data.user as User).id);
      }

      return {};
    },
    []
  );

  // ── Sign up ──
  const signUp = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      setError(null);

      const result = await api.auth.signup(
        email.trim().toLowerCase(),
        password
      );

      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }

      if (result.data?.user) {
        setAppUser(result.data.user as User);
        setIsAuthenticated(true);
        await identifyUser((result.data.user as User).id);
      }

      return {};
    },
    []
  );

  // ── Sign out ──
  const signOut = useCallback(async (): Promise<void> => {
    try {
      await api.auth.logout();
      await resetRevenueCat();
      setAppUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('[useAuth] signOut error:', err);
    }
  }, []);

  // ── Refresh user data ──
  const refreshUser = useCallback(async (): Promise<void> => {
    await fetchUser();
  }, [fetchUser]);

  return {
    appUser,
    loading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };
}

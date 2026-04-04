import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────
// Signal Theory REST API client
// Replaces the Supabase client
// ─────────────────────────────────────────────

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  ''
);

const TOKEN_KEY = 'signal_theory_access_token';
const REFRESH_TOKEN_KEY = 'signal_theory_refresh_token';

// ─────────────────────────────────────────────
// Token storage
// ─────────────────────────────────────────────

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.multiSet([
      [TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken],
    ]);
  },
  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
  },
};

// ─────────────────────────────────────────────
// Core fetch wrapper — handles token refresh
// ─────────────────────────────────────────────

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function attemptTokenRefresh(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      await tokenStorage.clearTokens();
      refreshQueue.forEach((cb) => cb(null));
      refreshQueue = [];
      return null;
    }

    const data = await res.json();
    await tokenStorage.setTokens(data.accessToken, data.refreshToken);
    refreshQueue.forEach((cb) => cb(data.accessToken));
    refreshQueue = [];
    return data.accessToken;
  } catch {
    refreshQueue.forEach((cb) => cb(null));
    refreshQueue = [];
    return null;
  } finally {
    isRefreshing = false;
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retried = false
): Promise<ApiResponse<T>> {
  const accessToken = await tokenStorage.getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    if (res.status === 401 && !retried) {
      const body = await res.json().catch(() => ({}));

      if (body?.code === 'TOKEN_EXPIRED') {
        const newToken = await attemptTokenRefresh();
        if (newToken) {
          return apiFetch<T>(path, options, true);
        }
      }

      await tokenStorage.clearTokens();
      return { data: null, error: 'Session expired. Please sign in again.' };
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { data: null, error: body?.error ?? `Request failed (${res.status})` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'Network error. Check your connection.' };
  }
}

// ─────────────────────────────────────────────
// Auth API
// ─────────────────────────────────────────────

export const authApi = {
  async signup(email: string, password: string) {
    const result = await apiFetch<{
      user: Record<string, unknown>;
      accessToken: string;
      refreshToken: string;
    }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.data) {
      await tokenStorage.setTokens(
        result.data.accessToken,
        result.data.refreshToken
      );
    }

    return result;
  },

  async login(email: string, password: string) {
    const result = await apiFetch<{
      user: Record<string, unknown>;
      accessToken: string;
      refreshToken: string;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.data) {
      await tokenStorage.setTokens(
        result.data.accessToken,
        result.data.refreshToken
      );
    }

    return result;
  },

  async logout() {
    const refreshToken = await tokenStorage.getRefreshToken();
    await apiFetch('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    await tokenStorage.clearTokens();
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await tokenStorage.getAccessToken();
    return token !== null;
  },
};

// ─────────────────────────────────────────────
// Profile API
// ─────────────────────────────────────────────

export const profileApi = {
  async get() {
    return apiFetch<{ user: Record<string, unknown>; quizProfile: Record<string, unknown> | null }>(
      '/api/profile'
    );
  },

  async update(fields: { display_name?: string; profile_type?: string }) {
    return apiFetch<{ user: Record<string, unknown> }>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(fields),
    });
  },
};

// ─────────────────────────────────────────────
// Scenarios API
// ─────────────────────────────────────────────

export const scenariosApi = {
  async list(params?: {
    category?: string;
    difficulty?: string;
    limit?: number;
    exclude_completed?: boolean;
  }) {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.difficulty) qs.set('difficulty', params.difficulty);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.exclude_completed) qs.set('exclude_completed', 'true');

    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiFetch<{ scenarios: unknown[] }>(`/api/scenarios${query}`);
  },

  async get(id: string) {
    return apiFetch<{ scenario: unknown }>(`/api/scenarios/${id}`);
  },

  async submitResult(
    scenarioId: string,
    selectedOption: number,
    wasCorrect: boolean
  ) {
    return apiFetch<{ result: unknown }>(`/api/scenarios/${scenarioId}/result`, {
      method: 'POST',
      body: JSON.stringify({
        selected_option: selectedOption,
        was_correct: wasCorrect,
      }),
    });
  },
};

// ─────────────────────────────────────────────
// Analysis API
// ─────────────────────────────────────────────

export const analysisApi = {
  async analyze(inputText: string) {
    return apiFetch<{ analysis: unknown }>('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ input_text: inputText }),
    });
  },

  async history(limit = 20, offset = 0) {
    return apiFetch<{ analyses: unknown[]; total: number }>(
      `/api/analyze/history?limit=${limit}&offset=${offset}`
    );
  },
};

// ─────────────────────────────────────────────
// Usage API
// ─────────────────────────────────────────────

export const usageApi = {
  async get() {
    return apiFetch<{
      scenarios_used_week: number;
      analyses_used_week: number;
      week_reset_at: string;
      subscription_status: string;
      tier: string;
    }>('/api/usage');
  },
};

// ─────────────────────────────────────────────
// Default export — grouped client
// ─────────────────────────────────────────────

const api = {
  auth: authApi,
  profile: profileApi,
  scenarios: scenariosApi,
  analysis: analysisApi,
  usage: usageApi,
};

export default api;

// ─────────────────────────────────────────────
// Signal Theory — Dark Theme
// ─────────────────────────────────────────────

export const colors = {
  // Backgrounds
  background: '#0A0A0F',
  surface: '#13131A',
  surfaceElevated: '#1C1C26',

  // Borders
  border: '#2A2A38',

  // Brand
  primary: '#6C63FF',
  primaryDark: '#4B44CC',
  primaryLight: '#8B85FF',

  // Signal states
  positive: '#22C55E',
  neutral: '#F59E0B',
  negative: '#EF4444',
  ambiguous: '#8B5CF6',

  // Text
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textMuted: '#475569',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',

  // Overlays
  overlay: 'rgba(0,0,0,0.6)',
  overlayLight: 'rgba(255,255,255,0.05)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 36,

  // Line heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,

  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export default theme;

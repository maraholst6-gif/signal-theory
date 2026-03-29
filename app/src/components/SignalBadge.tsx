import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../constants/theme';
import { SignalState } from '../types';

interface Props {
  state: SignalState;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const SIGNAL_CONFIG: Record<
  SignalState,
  { color: string; label: string; emoji: string }
> = {
  POSITIVE: { color: colors.positive, label: 'POSITIVE', emoji: '↑' },
  NEUTRAL: { color: colors.neutral, label: 'NEUTRAL', emoji: '→' },
  NEGATIVE: { color: colors.negative, label: 'NEGATIVE', emoji: '↓' },
  AMBIGUOUS: { color: colors.ambiguous, label: 'AMBIGUOUS', emoji: '?' },
};

export function SignalBadge({ state, size = 'md', style }: Props): React.ReactElement {
  const config = SIGNAL_CONFIG[state];

  return (
    <View
      style={[
        styles.badge,
        styles[size],
        { borderColor: config.color, backgroundColor: `${config.color}18` },
        style,
      ]}
    >
      <Text style={[styles.emoji, styles[`emoji_${size}`]]}>{config.emoji}</Text>
      <Text style={[styles.label, styles[`label_${size}`], { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },

  // Sizes
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    gap: 4,
  },
  md: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: 6,
  },
  lg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: 8,
  },

  emoji: {
    fontWeight: '700',
  },
  emoji_sm: { fontSize: typography.xs },
  emoji_md: { fontSize: typography.sm },
  emoji_lg: { fontSize: typography.base },

  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  label_sm: { fontSize: typography.xs },
  label_md: { fontSize: typography.sm },
  label_lg: { fontSize: typography.base },
});

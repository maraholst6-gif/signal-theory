import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface Props {
  used: number;
  limit: number | typeof Infinity;
  label: string;        // e.g. "scenarios" | "analyses"
  style?: ViewStyle;
}

export function UsageCounter({ used, limit, label, style }: Props): React.ReactElement {
  const isPro = limit === Infinity;
  const remaining = isPro ? null : Math.max(0, (limit as number) - used);
  const isExhausted = !isPro && remaining === 0;

  const getColor = (): string => {
    if (isPro) return colors.primary;
    if (isExhausted) return colors.negative;
    if (remaining === 1) return colors.neutral;
    return colors.textSecondary;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.dot, { backgroundColor: getColor() }]} />
      <Text style={[styles.text, { color: getColor() }]}>
        {isPro
          ? `Unlimited ${label}`
          : isExhausted
          ? `No ${label} left this week`
          : `${remaining} of ${limit} ${label} remaining this week`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: typography.sm,
    fontWeight: '500',
  },
});

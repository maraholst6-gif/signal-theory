import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from '../constants/theme';
import { Scenario } from '../types';

interface Props {
  scenario: Scenario;
  onPress: () => void;
  isCompleted?: boolean;
  isLocked?: boolean;
  style?: ViewStyle;
}

const CATEGORY_COLORS: Record<string, string> = {
  texting: colors.primary,
  'in-person': colors.positive,
  'app-based': colors.ambiguous,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  basic: colors.positive,
  intermediate: colors.neutral,
  advanced: colors.negative,
};

export function ScenarioCard({
  scenario,
  onPress,
  isCompleted = false,
  isLocked = false,
  style,
}: Props): React.ReactElement {
  const categoryColor = CATEGORY_COLORS[scenario.category] ?? colors.primary;
  const difficultyColor = DIFFICULTY_COLORS[scenario.difficulty] ?? colors.neutral;

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.cardCompleted, isLocked && styles.cardLocked, style]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Completed indicator */}
      {isCompleted && <View style={styles.completedStripe} />}

      {/* Header badges */}
      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: `${categoryColor}20`, borderColor: categoryColor }]}>
          <Text style={[styles.badgeText, { color: categoryColor }]}>
            {scenario.category}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${difficultyColor}20`, borderColor: difficultyColor }]}>
          <Text style={[styles.badgeText, { color: difficultyColor }]}>
            {scenario.difficulty}
          </Text>
        </View>
        {isCompleted && (
          <View style={[styles.badge, { backgroundColor: `${colors.positive}20`, borderColor: colors.positive }]}>
            <Text style={[styles.badgeText, { color: colors.positive }]}>done</Text>
          </View>
        )}
        {isLocked && (
          <View style={[styles.badge, { backgroundColor: `${colors.ambiguous}20`, borderColor: colors.ambiguous }]}>
            <Text style={[styles.badgeText, { color: colors.ambiguous }]}>premium</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title}>{scenario.title}</Text>

      {/* Preview */}
      <Text style={styles.preview} numberOfLines={2}>
        {scenario.body}
      </Text>

      {/* Arrow or lock */}
      <Text style={styles.arrow}>{isLocked ? '🔒' : '→'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardCompleted: {
    opacity: 0.7,
  },
  cardLocked: {
    opacity: 0.6,
  },
  completedStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.positive,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  badge: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: typography.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  preview: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: typography.sm * typography.normal,
    marginBottom: spacing.sm,
  },
  arrow: {
    fontSize: typography.md,
    color: colors.primary,
    textAlign: 'right',
  },
});

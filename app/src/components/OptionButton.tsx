import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface Props {
  label: string;       // 'A' | 'B' | 'C' | 'D'
  text: string;
  onPress: () => void;
  selected?: boolean;
  revealed?: boolean;
  isCorrect?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function OptionButton({
  label,
  text,
  onPress,
  selected = false,
  revealed = false,
  isCorrect = false,
  disabled = false,
  style,
}: Props): React.ReactElement {
  const getBorderColor = (): string => {
    if (!revealed) {
      return selected ? colors.primary : colors.border;
    }
    if (isCorrect) return colors.positive;
    if (selected && !isCorrect) return colors.negative;
    return colors.border;
  };

  const getBgColor = (): string => {
    if (!revealed) {
      return selected ? `${colors.primary}20` : colors.surface;
    }
    if (isCorrect) return `${colors.positive}18`;
    if (selected && !isCorrect) return `${colors.negative}18`;
    return colors.surface;
  };

  const getLabelBg = (): string => {
    if (!revealed) {
      return selected ? colors.primary : colors.surfaceElevated;
    }
    if (isCorrect) return colors.positive;
    if (selected && !isCorrect) return colors.negative;
    return colors.surfaceElevated;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBgColor(),
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <View style={[styles.label, { backgroundColor: getLabelBg() }]}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
      {revealed && isCorrect && (
        <Text style={styles.checkmark}>✓</Text>
      )}
      {revealed && selected && !isCorrect && (
        <Text style={styles.cross}>✗</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  labelText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  text: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textPrimary,
    lineHeight: typography.base * 1.4,
  },
  checkmark: {
    fontSize: typography.md,
    color: colors.positive,
    fontWeight: '700',
  },
  cross: {
    fontSize: typography.md,
    color: colors.negative,
    fontWeight: '700',
  },
});

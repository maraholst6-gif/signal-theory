import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '../constants/theme';

interface Props {
  message?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  message,
  size = 'large',
  style,
  fullScreen = false,
}: Props): React.ReactElement {
  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, style]}>
        <ActivityIndicator size={size} color={colors.primary} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  message: {
    marginTop: spacing.sm,
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

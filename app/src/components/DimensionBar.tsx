import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../constants/theme';

interface Props {
  label: string;
  score: number;        // 1-10
  maxScore?: number;
  color?: string;
  style?: ViewStyle;
  animate?: boolean;
}

export function DimensionBar({
  label,
  score,
  maxScore = 10,
  color = colors.primary,
  style,
  animate = true,
}: Props): React.ReactElement {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100));

  useEffect(() => {
    if (animate) {
      Animated.timing(animatedWidth, {
        toValue: pct,
        duration: 800,
        delay: 200,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(pct);
    }
  }, [pct, animate, animatedWidth]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.score, { color }]}>
          {score}/{maxScore}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  score: {
    fontSize: typography.sm,
    fontWeight: '700',
  },
  track: {
    height: 6,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});

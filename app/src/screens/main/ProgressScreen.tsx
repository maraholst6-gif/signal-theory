import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { MainTabParamList, ProfileStackParamList } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useUsageTracking } from '../../hooks/useUsageTracking';
import { DimensionBar } from '../../components/DimensionBar';

type NavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Progress'>,
  NativeStackNavigationProp<ProfileStackParamList>
>;

interface Props {
  navigation: NavProp;
}

interface ProgressStats {
  totalScenarios: number;
  correctScenarios: number;
  accuracyPct: number;
  weeklyScenarios: number;
  weeklyCorrect: number;
  weeklyAccuracy: number;
  signalDimScore: number;
  readinessDimScore: number;
  strategyDimScore: number;
}

export function ProgressScreen({ navigation }: Props): React.ReactElement {
  const { appUser } = useAuth();
  const { computeUsageState } = useUsageTracking();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async (): Promise<void> => {
    if (!appUser) return;

    try {
      const usage = await computeUsageState(appUser);
      setIsPro(usage.isPro);

      if (!usage.isPro) {
        setLoading(false);
        return;
      }

      // Fetch all results for this user
      const { data: allResults } = await supabase
        .from('scenario_results')
        .select('was_correct, created_at')
        .eq('user_id', appUser.id);

      if (!allResults) {
        setLoading(false);
        return;
      }

      const total = allResults.length;
      const correct = allResults.filter((r) => r.was_correct).length;
      const accuracyPct = total > 0 ? Math.round((correct / total) * 100) : 0;

      // This week's stats
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const weeklyResults = allResults.filter((r) => r.created_at >= weekAgo);
      const weeklyScenarios = weeklyResults.length;
      const weeklyCorrect = weeklyResults.filter((r) => r.was_correct).length;
      const weeklyAccuracy =
        weeklyScenarios > 0
          ? Math.round((weeklyCorrect / weeklyScenarios) * 100)
          : 0;

      // Derive dimension scores from accuracy (rough estimate)
      // In production, this would be computed per scenario target_dimensions
      const baseScore = Math.max(1, Math.min(10, Math.round(accuracyPct / 10)));

      setStats({
        totalScenarios: total,
        correctScenarios: correct,
        accuracyPct,
        weeklyScenarios,
        weeklyCorrect,
        weeklyAccuracy,
        signalDimScore: baseScore,
        readinessDimScore: Math.max(1, baseScore - 1),
        strategyDimScore: Math.max(1, baseScore - 1),
      });
    } catch (err) {
      console.error('[ProgressScreen] loadStats error:', err);
    } finally {
      setLoading(false);
    }
  }, [appUser, computeUsageState]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Paywall gate ───────────────────────────
  if (!isPro) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.gateContent}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.gateTitle}>Progress Tracking</Text>
          <Text style={styles.gateSubtitle}>
            Signal Pro unlocks your full progress dashboard — accuracy trends, dimension scores, and weekly patterns.
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() =>
              navigation.navigate('Paywall', { trigger: 'progress' })
            }
            activeOpacity={0.85}
          >
            <Text style={styles.upgradeButtonText}>Upgrade to Signal Pro</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <Text style={styles.headerSubtitle}>Signal accuracy over time.</Text>
        </View>

        {stats ? (
          <>
            {/* Accuracy card */}
            <View style={styles.accuracyCard}>
              <View style={styles.accuracyStat}>
                <Text style={styles.accuracyNumber}>{stats.accuracyPct}%</Text>
                <Text style={styles.accuracyLabel}>Overall Accuracy</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.accuracyStat}>
                <Text style={styles.accuracyNumber}>{stats.totalScenarios}</Text>
                <Text style={styles.accuracyLabel}>Total Scenarios</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.accuracyStat}>
                <Text style={styles.accuracyNumber}>{stats.weeklyScenarios}</Text>
                <Text style={styles.accuracyLabel}>This Week</Text>
              </View>
            </View>

            {/* Weekly progress */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>This Week</Text>
              <View style={styles.weeklyCard}>
                <View style={styles.weeklyRow}>
                  <Text style={styles.weeklyLabel}>Scenarios</Text>
                  <Text style={styles.weeklyValue}>{stats.weeklyScenarios}</Text>
                </View>
                <View style={styles.weeklyRow}>
                  <Text style={styles.weeklyLabel}>Correct</Text>
                  <Text style={[styles.weeklyValue, { color: colors.positive }]}>
                    {stats.weeklyCorrect}
                  </Text>
                </View>
                <View style={styles.weeklyRow}>
                  <Text style={styles.weeklyLabel}>Accuracy</Text>
                  <Text
                    style={[
                      styles.weeklyValue,
                      {
                        color:
                          stats.weeklyAccuracy >= 70
                            ? colors.positive
                            : stats.weeklyAccuracy >= 50
                            ? colors.neutral
                            : colors.negative,
                      },
                    ]}
                  >
                    {stats.weeklyAccuracy}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Dimension scores */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dimension Improvement</Text>
              <View style={styles.dimensionCard}>
                <DimensionBar
                  label="Signal Reading"
                  score={stats.signalDimScore}
                  color={colors.primary}
                />
                <DimensionBar
                  label="Readiness"
                  score={stats.readinessDimScore}
                  color={colors.positive}
                />
                <DimensionBar
                  label="Strategy"
                  score={stats.strategyDimScore}
                  color={colors.neutral}
                />
              </View>
            </View>

            {stats.totalScenarios === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  Complete your first scenario to see your progress.
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.center}>
            <Text style={styles.emptyText}>No data yet. Start practicing!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  gateContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  lockIcon: {
    fontSize: 48,
  },
  gateTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  gateSubtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.base * 1.6,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.white,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  accuracyCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    justifyContent: 'space-around',
  },
  accuracyStat: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  accuracyNumber: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colors.primary,
  },
  accuracyLabel: {
    fontSize: typography.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    alignSelf: 'stretch',
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  weeklyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  weeklyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weeklyLabel: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  weeklyValue: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dimensionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  emptyState: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.base,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

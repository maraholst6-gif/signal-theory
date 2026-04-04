import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { Scenario, PracticeStackParamList, MainTabParamList, UsageState } from '../../types';
import { supabase } from '../../lib/supabase';
import { SCENARIOS } from '../../data/scenarios';
import { useAuth } from '../../hooks/useAuth';
import { useUsageTracking } from '../../hooks/useUsageTracking';
import { ScenarioCard } from '../../components/ScenarioCard';
import { UsageCounter } from '../../components/UsageCounter';

type NavProp = CompositeNavigationProp<
  NativeStackNavigationProp<PracticeStackParamList, 'PracticeHome'>,
  BottomTabNavigationProp<MainTabParamList>
>;

interface Props {
  navigation: NavProp;
}

export function PracticeScreen({ navigation }: Props): React.ReactElement {
  const { appUser } = useAuth();
  const { computeUsageState } = useUsageTracking();

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [usageState, setUsageState] = useState<UsageState | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (): Promise<void> => {
    if (!appUser) return;

    setError(null);

    try {
      // Load scenarios from Supabase, fallback to local seed
      // Load all difficulties — gating is enforced client-side
      let scenarioData: Scenario[] = [];
      const { data: remoteScenarios, error: dbErr } = await supabase
        .from('scenarios')
        .select('*')
        .order('created_at', { ascending: true });

      if (dbErr || !remoteScenarios || remoteScenarios.length === 0) {
        scenarioData = SCENARIOS;
      } else {
        scenarioData = remoteScenarios as Scenario[];
      }

      setScenarios(scenarioData);

      // Load this week's completed scenario IDs
      const { data: results } = await supabase
        .from('scenario_results')
        .select('scenario_id')
        .eq('user_id', appUser.id)
        .gte(
          'created_at',
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        );

      if (results) {
        setCompletedIds(new Set(results.map((r) => r.scenario_id)));
      }

      // Compute usage state
      const usage = await computeUsageState(appUser);
      setUsageState(usage);
    } catch (err: any) {
      console.error('[PracticeScreen] loadData error:', err);
      setError('Failed to load scenarios. Pull to refresh.');
      setScenarios(SCENARIOS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [appUser, computeUsageState]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback((): void => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const isPremium = appUser?.tier === 'premium' || usageState?.isPro;

  const handleScenarioPress = useCallback(
    (scenario: Scenario): void => {
      if (!usageState) return;

      // Locked = non-basic difficulty for free users
      const isLocked = scenario.difficulty !== 'basic' && !isPremium;
      if (isLocked) {
        navigation.navigate('Profile', {
          screen: 'Paywall',
          params: { trigger: 'scenario' },
        } as any);
        return;
      }

      if (!usageState.canUseScenario) {
        navigation.navigate('Profile', {
          screen: 'Paywall',
          params: { trigger: 'scenario' },
        } as any);
        return;
      }

      navigation.navigate('Scenario', { scenarioId: scenario.id });
    },
    [usageState, isPremium, navigation]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const ListHeader = (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Your Weekly Practice</Text>
      <Text style={styles.headerSubtitle}>
        Scenarios to sharpen your signal reading.
      </Text>

      {usageState && (
        <UsageCounter
          used={usageState.scenariosUsed}
          limit={usageState.scenariosLimit}
          label="scenarios"
          style={styles.counter}
        />
      )}

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={scenarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ScenarioCard
            scenario={item}
            onPress={() => handleScenarioPress(item)}
            isCompleted={completedIds.has(item.id)}
            isLocked={item.difficulty !== 'basic' && !isPremium}
            style={styles.card}
          />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No scenarios available.</Text>
          </View>
        }
      />

      {/* Locked overlay when limit hit */}
      {usageState && !usageState.canUseScenario && !usageState.isPro && (
        <View style={styles.limitBanner}>
          <Text style={styles.limitText}>
            You've used all 5 scenarios this week.
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Profile', {
                screen: 'Paywall',
                params: { trigger: 'scenario' },
              } as any)
            }
          >
            <Text style={styles.limitCta}>Upgrade for unlimited →</Text>
          </TouchableOpacity>
        </View>
      )}
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
  list: {
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
    marginBottom: spacing.sm,
  },
  counter: {
    marginTop: spacing.xs,
  },
  errorBox: {
    backgroundColor: `${colors.error}15`,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
    marginTop: spacing.sm,
  },
  errorText: {
    fontSize: typography.sm,
    color: colors.error,
  },
  card: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.base,
  },
  limitBanner: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  limitText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  limitCta: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: '700',
  },
});

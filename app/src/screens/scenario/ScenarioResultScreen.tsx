import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { PracticeStackParamList, Scenario } from '../../types';
import { supabase } from '../../lib/supabase';
import { SCENARIOS } from '../../data/scenarios';
import { SignalBadge } from '../../components/SignalBadge';

interface Props {
  navigation: NativeStackNavigationProp<PracticeStackParamList, 'ScenarioResult'>;
  route: RouteProp<PracticeStackParamList, 'ScenarioResult'>;
}

export function ScenarioResultScreen({ navigation, route }: Props): React.ReactElement {
  const { scenarioId, selectedOption, wasCorrect } = route.params;
  const [scenario, setScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('scenarios')
        .select('*')
        .eq('id', scenarioId)
        .single();

      if (data) {
        setScenario(data as Scenario);
      } else {
        const local = SCENARIOS.find((s) => s.id === scenarioId);
        setScenario(local ?? null);
      }
    };
    load();
  }, [scenarioId]);

  const handleNextScenario = () => {
    navigation.navigate('PracticeHome');
  };

  const resultColor = wasCorrect ? colors.positive : colors.negative;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Result hero */}
        <View style={styles.hero}>
          <View
            style={[
              styles.resultIcon,
              { backgroundColor: `${resultColor}20`, borderColor: resultColor },
            ]}
          >
            <Text style={[styles.resultSymbol, { color: resultColor }]}>
              {wasCorrect ? '✓' : '✗'}
            </Text>
          </View>
          <Text style={styles.resultTitle}>
            {wasCorrect ? 'Correct read.' : 'Not quite.'}
          </Text>
          <Text style={styles.resultSubtitle}>
            {wasCorrect
              ? 'You identified the signal accurately.'
              : 'Here\'s what the signal was actually saying.'}
          </Text>

          {scenario && (
            <SignalBadge state={scenario.correct_signal_state} size="lg" />
          )}
        </View>

        {/* Signal details */}
        {scenario && (
          <View style={styles.detailSection}>
            <Text style={styles.scenarioTitle}>{scenario.title}</Text>

            <View style={styles.selectedAnswer}>
              <Text style={styles.selectedLabel}>You chose</Text>
              <Text style={styles.selectedText}>
                {scenario.options[selectedOption]?.text ?? 'Unknown option'}
              </Text>
            </View>

            <View style={styles.explanationBox}>
              <Text style={styles.explanationLabel}>Analysis</Text>
              <Text style={styles.explanation}>
                {scenario.options[selectedOption]?.explanation ?? ''}
              </Text>
            </View>

            {!wasCorrect && (
              <View style={styles.correctBox}>
                <Text style={styles.correctLabel}>Best approach</Text>
                <Text style={styles.correctText}>
                  {scenario.options.find((o) => o.is_correct)?.text ?? ''}
                </Text>
                <Text style={styles.correctExplanation}>
                  {scenario.options.find((o) => o.is_correct)?.explanation ?? ''}
                </Text>
              </View>
            )}

            {/* Key insight */}
            <View style={styles.insightBox}>
              <Text style={styles.insightLabel}>Key Insight</Text>
              <Text style={styles.insightText}>
                Signal: <Text style={styles.signalWord}>{scenario.correct_signal_state}</Text> —{' '}
                {getSignalInsight(scenario.correct_signal_state, scenario.category)}
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNextScenario}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryButtonText}>Next Scenario</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('PracticeHome')}
            activeOpacity={0.75}
          >
            <Text style={styles.secondaryButtonText}>Back to Practice</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getSignalInsight(state: string, category: string): string {
  const insights: Record<string, string> = {
    POSITIVE: `Observable behaviors show genuine interest. ${
      category === 'texting'
        ? 'Text patterns here support moving forward.'
        : category === 'in-person'
        ? 'In-person engagement is the most reliable signal.'
        : 'App engagement that converts to real plans is real interest.'
    }`,
    NEUTRAL: `Interaction exists but clear interest isn\'t demonstrated. Watch for behavior change before investing more.`,
    NEGATIVE: `Behaviors indicate disinterest or de-escalation. Continuing to pursue doesn\'t change the signal — it only changes your read of yourself.`,
    AMBIGUOUS: `Insufficient data to make a confident read. One more specific data point (a direct invite) will clarify.`,
  };
  return insights[state] ?? 'Read the full scenario explanation above.';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  resultIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultSymbol: {
    fontSize: typography.xxl,
    fontWeight: '800',
  },
  resultTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.base * 1.5,
  },
  detailSection: {
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  scenarioTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textMuted,
  },
  selectedAnswer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  selectedLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  selectedText: {
    fontSize: typography.base,
    color: colors.textPrimary,
  },
  explanationBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  explanationLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  explanation: {
    fontSize: typography.base,
    color: colors.textPrimary,
    lineHeight: typography.base * 1.6,
  },
  correctBox: {
    backgroundColor: `${colors.positive}10`,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.positive}35`,
    gap: spacing.sm,
  },
  correctLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.positive,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  correctText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  correctExplanation: {
    fontSize: typography.base,
    color: colors.textSecondary,
    lineHeight: typography.base * 1.6,
  },
  insightBox: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    gap: spacing.sm,
  },
  insightLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  insightText: {
    fontSize: typography.base,
    color: colors.textSecondary,
    lineHeight: typography.base * 1.6,
  },
  signalWord: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  primaryButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  primaryGradient: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.white,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
});

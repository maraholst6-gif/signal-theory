import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { PracticeStackParamList, Scenario } from '../../types';
import { supabase } from '../../lib/supabase';
import { SCENARIOS } from '../../data/scenarios';
import { useAuth } from '../../hooks/useAuth';
import { useUsageTracking } from '../../hooks/useUsageTracking';
import { OptionButton } from '../../components/OptionButton';
import { SignalBadge } from '../../components/SignalBadge';

interface Props {
  navigation: NativeStackNavigationProp<PracticeStackParamList, 'Scenario'>;
  route: RouteProp<PracticeStackParamList, 'Scenario'>;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function ScenarioScreen({ navigation, route }: Props): React.ReactElement {
  const { scenarioId } = route.params;
  const { appUser } = useAuth();
  const { recordScenarioUsed } = useUsageTracking();

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScenario = async (): Promise<void> => {
      // Try Supabase first, fall back to local data
      try {
        const { data, error: dbErr } = await supabase
          .from('scenarios')
          .select('*')
          .eq('id', scenarioId)
          .single();

        if (!dbErr && data) {
          setScenario(data as Scenario);
        } else {
          const local = SCENARIOS.find((s) => s.id === scenarioId);
          if (local) {
            setScenario(local);
          } else {
            setError('Scenario not found.');
          }
        }
      } catch {
        const local = SCENARIOS.find((s) => s.id === scenarioId);
        setScenario(local ?? null);
      } finally {
        setLoading(false);
      }
    };

    loadScenario();
  }, [scenarioId]);

  const handleSelect = useCallback(
    async (idx: number): Promise<void> => {
      if (revealed || !scenario || !appUser) return;

      setSelectedOption(idx);
      setRevealed(true);
      setSaving(true);

      const wasCorrect = scenario.options[idx]?.is_correct ?? false;

      try {
        // Save result to Supabase
        await supabase.from('scenario_results').insert({
          user_id: appUser.id,
          scenario_id: scenario.id,
          selected_option: idx,
          was_correct: wasCorrect,
        });

        // Increment usage counter
        await recordScenarioUsed(appUser.id);
      } catch (err) {
        console.error('[ScenarioScreen] save result error:', err);
        // Non-fatal — don't block the UI
      } finally {
        setSaving(false);
      }
    },
    [revealed, scenario, appUser, recordScenarioUsed]
  );

  const handleNext = useCallback((): void => {
    if (!scenario || selectedOption === null) return;

    const wasCorrect = scenario.options[selectedOption]?.is_correct ?? false;

    navigation.replace('ScenarioResult', {
      scenarioId: scenario.id,
      selectedOption,
      wasCorrect,
    });
  }, [scenario, selectedOption, navigation]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !scenario) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error ?? 'Scenario not found.'}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const correctIdx = scenario.options.findIndex((o) => o.is_correct);
  const selectedExplanation =
    revealed && selectedOption !== null
      ? scenario.options[selectedOption]?.explanation
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
            <Text style={styles.backText}>← Scenarios</Text>
          </TouchableOpacity>

          <View style={styles.headerMeta}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{scenario.category}</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{scenario.difficulty}</Text>
            </View>
          </View>

          <Text style={styles.scenarioTitle}>{scenario.title}</Text>
        </View>

        {/* Scenario body */}
        <View style={styles.bodySection}>
          <Text style={styles.body}>{scenario.body}</Text>
        </View>

        {/* Question */}
        <Text style={styles.question}>What's your read? What do you do?</Text>

        {/* Options */}
        <View style={styles.options}>
          {scenario.options.map((option, idx) => (
            <OptionButton
              key={idx}
              label={OPTION_LABELS[idx]}
              text={option.text}
              onPress={() => handleSelect(idx)}
              selected={selectedOption === idx}
              revealed={revealed}
              isCorrect={idx === correctIdx}
              disabled={revealed}
            />
          ))}
        </View>

        {/* Reveal section */}
        {revealed && selectedOption !== null && (
          <View style={styles.revealSection}>
            {/* Signal state */}
            <View style={styles.revealHeader}>
              <Text style={styles.revealLabel}>Signal State</Text>
              <SignalBadge state={scenario.correct_signal_state} size="md" />
            </View>

            {/* Result indicator */}
            <View
              style={[
                styles.resultBanner,
                scenario.options[selectedOption]?.is_correct
                  ? styles.resultCorrect
                  : styles.resultIncorrect,
              ]}
            >
              <Text style={styles.resultBannerText}>
                {scenario.options[selectedOption]?.is_correct
                  ? 'Correct read.'
                  : 'Not quite.'}
              </Text>
            </View>

            {/* Explanation */}
            {selectedExplanation && (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationLabel}>Why</Text>
                <Text style={styles.explanation}>{selectedExplanation}</Text>
              </View>
            )}

            {/* Correct answer if wrong */}
            {!scenario.options[selectedOption]?.is_correct && (
              <View style={styles.correctBox}>
                <Text style={styles.correctLabel}>Best answer</Text>
                <Text style={styles.correctText}>
                  {OPTION_LABELS[correctIdx]}: {scenario.options[correctIdx]?.text}
                </Text>
                <Text style={styles.correctExplanation}>
                  {scenario.options[correctIdx]?.explanation}
                </Text>
              </View>
            )}

            {/* Next button */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.nextButtonText}>Next →</Text>
              )}
            </TouchableOpacity>
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
    gap: spacing.lg,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  back: {
    marginBottom: spacing.xs,
  },
  backText: {
    fontSize: typography.base,
    color: colors.primary,
  },
  backButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerMeta: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: `${colors.primary}20`,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  difficultyBadge: {
    backgroundColor: `${colors.neutral}20`,
    borderWidth: 1,
    borderColor: colors.neutral,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  difficultyText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.neutral,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scenarioTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bodySection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  body: {
    fontSize: typography.base,
    color: colors.textPrimary,
    lineHeight: typography.base * 1.7,
  },
  question: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textSecondary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  options: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  revealSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    gap: spacing.lg,
  },
  revealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revealLabel: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resultBanner: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  resultCorrect: {
    backgroundColor: `${colors.positive}20`,
    borderWidth: 1,
    borderColor: colors.positive,
  },
  resultIncorrect: {
    backgroundColor: `${colors.negative}15`,
    borderWidth: 1,
    borderColor: colors.negative,
  },
  resultBannerText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  explanationBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
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
    borderColor: `${colors.positive}40`,
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
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  nextButtonText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.white,
  },
  errorText: {
    fontSize: typography.base,
    color: colors.error,
    textAlign: 'center',
  },
});

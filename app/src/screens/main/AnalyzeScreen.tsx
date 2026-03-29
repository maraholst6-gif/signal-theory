import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import {
  AnalyzeStackParamList,
  MainTabParamList,
  Analysis,
  AIAnalysisResponse,
  UsageState,
} from '../../types';
import { supabase } from '../../lib/supabase';
import { analyzeSituation } from '../../lib/openai';
import { useAuth } from '../../hooks/useAuth';
import { useProfile, getProfileMeta } from '../../hooks/useProfile';
import { useUsageTracking } from '../../hooks/useUsageTracking';
import { SignalBadge } from '../../components/SignalBadge';
import { UsageCounter } from '../../components/UsageCounter';

type NavProp = CompositeNavigationProp<
  NativeStackNavigationProp<AnalyzeStackParamList, 'AnalyzeHome'>,
  BottomTabNavigationProp<MainTabParamList>
>;

interface Props {
  navigation: NavProp;
}

export function AnalyzeScreen({ navigation }: Props): React.ReactElement {
  const { appUser } = useAuth();
  const { quizProfile } = useProfile(appUser?.id);
  const { computeUsageState, recordAnalysisUsed } = useUsageTracking();

  const [inputText, setInputText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResponse | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
  const [usageState, setUsageState] = useState<UsageState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const loadData = useCallback(async (): Promise<void> => {
    if (!appUser) return;

    try {
      const [usageResult, historyResult] = await Promise.all([
        computeUsageState(appUser),
        supabase
          .from('analyses')
          .select('*')
          .eq('user_id', appUser.id)
          .order('created_at', { ascending: false })
          .limit(3),
      ]);

      setUsageState(usageResult);

      if (historyResult.data) {
        setRecentAnalyses(historyResult.data as Analysis[]);
      }
    } catch (err) {
      console.error('[AnalyzeScreen] loadData error:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, [appUser, computeUsageState]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAnalyze = async (): Promise<void> => {
    if (!appUser || !inputText.trim()) return;
    if (!usageState?.canUseAnalysis) {
      navigation.navigate('Profile', {
        screen: 'Paywall',
        params: { trigger: 'analysis' },
      } as any);
      return;
    }

    setAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const profileMeta = getProfileMeta(appUser.profile_type);
      const payload = {
        input_text: inputText.trim(),
        profile_type: appUser.profile_type,
        signal_score: quizProfile?.signal_score ?? profileMeta.signalScore,
        readiness_score: quizProfile?.readiness_score ?? profileMeta.readinessScore,
        strategy_score: quizProfile?.strategy_score ?? profileMeta.strategyScore,
        blind_spots: profileMeta.blindSpots,
      };

      const analysisResult = await analyzeSituation(payload);
      setResult(analysisResult);

      // Save to database
      const { data: savedAnalysis } = await supabase
        .from('analyses')
        .insert({
          user_id: appUser.id,
          input_text: inputText.trim(),
          signal_state: analysisResult.signal_state,
          ai_response: analysisResult,
        })
        .select()
        .single();

      if (savedAnalysis) {
        setRecentAnalyses((prev) => [savedAnalysis as Analysis, ...prev.slice(0, 2)]);
      }

      // Record usage
      await recordAnalysisUsed(appUser.id);

      // Refresh usage state
      const freshUsage = await computeUsageState(appUser);
      setUsageState(freshUsage);
    } catch (err: any) {
      console.error('[AnalyzeScreen] analyze error:', err);
      setError('Analysis failed. Check your connection and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const isLimitHit = usageState && !usageState.canUseAnalysis && !usageState.isPro;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Analyze a Situation</Text>
            <Text style={styles.headerSubtitle}>
              Paste a conversation or describe what happened. Get a signal read.
            </Text>

            {usageState && (
              <UsageCounter
                used={usageState.analysesUsed}
                limit={usageState.analysesLimit}
                label="analyses"
                style={styles.counter}
              />
            )}
          </View>

          {/* Input area */}
          <View style={styles.inputSection}>
            <TextInput
              style={[styles.textInput, isLimitHit && styles.inputDisabled]}
              value={inputText}
              onChangeText={setInputText}
              placeholder={
                isLimitHit
                  ? 'Upgrade to Signal Pro to analyze more situations.'
                  : 'Paste a conversation or describe what happened...\n\nExample: "She texted me three times yesterday then went silent. We had a great second date last week."'
              }
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!isLimitHit}
            />

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.analyzeButton,
                (!inputText.trim() || analyzing || isLimitHit) &&
                  styles.analyzeButtonDisabled,
              ]}
              onPress={isLimitHit
                ? () => navigation.navigate('Profile', {
                    screen: 'Paywall',
                    params: { trigger: 'analysis' },
                  } as any)
                : handleAnalyze}
              disabled={!inputText.trim() || analyzing}
              activeOpacity={0.85}
            >
              {analyzing ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.analyzeButtonText}>
                  {isLimitHit ? 'Upgrade to Analyze →' : 'Analyze →'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Result */}
          {result && (
            <View style={styles.resultSection}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Signal Read</Text>
                <SignalBadge state={result.signal_state} size="md" />
              </View>

              <ResultBlock
                label="What I See"
                content={result.what_i_see}
                accentColor={colors.textSecondary}
              />
              <ResultBlock
                label="What It Means"
                content={result.what_it_means}
                accentColor={colors.neutral}
              />
              <ResultBlock
                label="Your Move"
                content={result.your_move}
                accentColor={colors.primary}
              />
              <ResultBlock
                label="Watch For"
                content={result.watch_for}
                accentColor={colors.ambiguous}
              />
            </View>
          )}

          {/* History */}
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Recent Analyses</Text>
              {recentAnalyses.length > 0 && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('AnalysisHistory')}
                >
                  <Text style={styles.historyViewAll}>View all →</Text>
                </TouchableOpacity>
              )}
            </View>

            {loadingHistory ? (
              <ActivityIndicator color={colors.primary} />
            ) : recentAnalyses.length === 0 ? (
              <Text style={styles.historyEmpty}>
                No analyses yet. Submit your first situation above.
              </Text>
            ) : (
              recentAnalyses.map((analysis) => (
                <HistoryCard key={analysis.id} analysis={analysis} />
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function ResultBlock({
  label,
  content,
  accentColor,
}: {
  label: string;
  content: string;
  accentColor: string;
}) {
  return (
    <View style={resultStyles.block}>
      <Text style={[resultStyles.label, { color: accentColor }]}>{label}</Text>
      <Text style={resultStyles.content}>{content}</Text>
    </View>
  );
}

function HistoryCard({ analysis }: { analysis: Analysis }) {
  const date = new Date(analysis.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={historyStyles.card}>
      <View style={historyStyles.cardHeader}>
        <SignalBadge state={analysis.signal_state} size="sm" />
        <Text style={historyStyles.date}>{date}</Text>
      </View>
      <Text style={historyStyles.preview} numberOfLines={2}>
        {analysis.input_text}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  kav: {
    flex: 1,
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
    lineHeight: typography.base * 1.5,
  },
  counter: {
    marginTop: spacing.xs,
  },
  inputSection: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.base,
    color: colors.textPrimary,
    minHeight: 140,
    lineHeight: typography.base * 1.6,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  errorBox: {
    backgroundColor: `${colors.error}15`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    fontSize: typography.sm,
    color: colors.error,
  },
  analyzeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.white,
  },
  resultSection: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  historySection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  historyViewAll: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: '600',
  },
  historyEmpty: {
    fontSize: typography.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});

const resultStyles = StyleSheet.create({
  block: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  content: {
    fontSize: typography.base,
    color: colors.textPrimary,
    lineHeight: typography.base * 1.6,
  },
});

const historyStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  preview: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    lineHeight: typography.sm * 1.5,
  },
});

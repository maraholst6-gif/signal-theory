import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { OnboardingStackParamList, MiniQuizQuestion } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useProfile, getProfileMeta } from '../../hooks/useProfile';

interface Props {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'MiniQuiz'>;
}

// ─────────────────────────────────────────────
// Quiz questions
// ─────────────────────────────────────────────

const QUESTIONS: MiniQuizQuestion[] = [
  {
    id: 1,
    text: "She texts 'maybe' to your date invite. You:",
    answers: [
      { label: 'A', text: 'Follow up once with a specific plan', profile_scores: { 'ready-navigator': 2, 'over-analyst': 0 } },
      { label: 'B', text: 'Wait and see if she follows up', profile_scores: { 'over-analyst': 2 } },
      { label: 'C', text: "Assume it's a no and move on", profile_scores: { 'over-analyst': 1 } },
      { label: 'D', text: 'Send multiple follow-ups to make sure she knows you\'re interested', profile_scores: { 'rusty-romantic': 2 } },
    ],
  },
  {
    id: 2,
    text: "After 3 dates she's warm in person but slow to text back. The signal is:",
    answers: [
      { label: 'A', text: 'She\'s cooling off — act accordingly', profile_scores: { 'over-analyst': 2 } },
      { label: 'B', text: 'Mixed — need more data before deciding', profile_scores: { 'ready-navigator': 2 } },
      { label: 'C', text: 'She\'s still interested — some people just don\'t text much', profile_scores: { 'signal-blind': 2 } },
      { label: 'D', text: 'She\'s playing games to seem less available', profile_scores: { 'rusty-romantic': 2 } },
    ],
  },
  {
    id: 3,
    text: "You're out with someone new and realize you're thinking about your ex. This means:",
    answers: [
      { label: 'A', text: "I'm probably not fully ready — worth noticing", profile_scores: { 'ready-navigator': 2 } },
      { label: 'B', text: "It's normal, everyone does this early on", profile_scores: { 'signal-blind': 1 } },
      { label: 'C', text: "I'm comparing them to my ex, which is unfair", profile_scores: { 'over-analyst': 2 } },
      { label: 'D', text: "I miss my ex and need closure before dating", profile_scores: { 'rusty-romantic': 2 } },
    ],
  },
  {
    id: 4,
    text: "She says 'we should grab dinner sometime' while saying goodbye. You:",
    answers: [
      { label: 'A', text: "Say 'I'd like that' and text her tomorrow to make a specific plan", profile_scores: { 'ready-navigator': 2 } },
      { label: 'B', text: 'Smile and nod — she was probably just being nice', profile_scores: { 'rusty-romantic': 2 } },
      { label: 'C', text: "Assume it was polite filler and don't follow up", profile_scores: { 'over-analyst': 1, 'signal-blind': 1 } },
      { label: 'D', text: 'Lock in the date right then: "How about Saturday?"', profile_scores: { 'ready-navigator': 1 } },
    ],
  },
  {
    id: 5,
    text: "Her texts are getting shorter and less frequent. Best move:",
    answers: [
      { label: 'A', text: "Stop initiating and give her space", profile_scores: { 'ready-navigator': 2 } },
      { label: 'B', text: "Check in once more, then let it rest", profile_scores: { 'over-analyst': 1, 'ready-navigator': 1 } },
      { label: 'C', text: "Send a longer, heartfelt message explaining how you feel", profile_scores: { 'rusty-romantic': 2 } },
      { label: 'D', text: "Move on — if she were interested she'd text", profile_scores: { 'signal-blind': 2 } },
    ],
  },
];

export function MiniQuizScreen({ navigation }: Props): React.ReactElement {
  const { appUser, refreshUser } = useAuth();
  const { setProfileFromQuiz } = useProfile(appUser?.id);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [resultProfile, setResultProfile] = useState('');

  const question = QUESTIONS[currentQ];
  const isLast = currentQ === QUESTIONS.length - 1;

  const handleSelect = (idx: number): void => {
    setSelectedAnswer(idx);
  };

  const handleNext = async (): Promise<void> => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (isLast) {
      setSaving(true);
      const profile = await setProfileFromQuiz(newAnswers);
      setResultProfile(profile);
      await refreshUser();
      setSaving(false);
      setCompleted(true);
    } else {
      setCurrentQ((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const meta = getProfileMeta(resultProfile);

  if (saving) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Analyzing your answers...</Text>
      </View>
    );
  }

  if (completed) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.resultContent}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultEmoji}>✓</Text>
              <Text style={styles.resultTitle}>Your Profile</Text>
              <Text style={styles.resultType}>{meta.title}</Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={styles.resultDesc}>{meta.description}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top Blind Spots</Text>
              {meta.blindSpots.map((spot, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.listText}>{spot}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Practice Focus</Text>
              {meta.actionPlan.map((item, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.numberLabel}>{idx + 1}</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              // Navigation handled by AppNavigator detecting profile_type set
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>Start Practicing</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Progress */}
        <View style={styles.progress}>
          <Text style={styles.progressText}>
            {currentQ + 1} of {QUESTIONS.length}
          </Text>
          <View style={styles.progressTrack}>
            {QUESTIONS.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.progressDot,
                  idx <= currentQ && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.text}</Text>
        </View>

        {/* Answers */}
        <View style={styles.answers}>
          {question.answers.map((answer, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.answerButton,
                selectedAnswer === idx && styles.answerSelected,
              ]}
              onPress={() => handleSelect(idx)}
              activeOpacity={0.75}
            >
              <View style={[styles.answerLabel, selectedAnswer === idx && styles.answerLabelSelected]}>
                <Text style={styles.answerLabelText}>{answer.label}</Text>
              </View>
              <Text style={styles.answerText}>{answer.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Next button */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            selectedAnswer === null && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedAnswer === null}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.primaryButtonText}>
              {isLast ? 'See My Profile' : 'Next'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.xl,
  },
  progress: {
    gap: spacing.sm,
  },
  progressText: {
    fontSize: typography.sm,
    color: colors.textMuted,
    fontWeight: '500',
  },
  progressTrack: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  progressDot: {
    flex: 1,
    height: 3,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 2,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  questionContainer: {
    paddingTop: spacing.md,
  },
  questionText: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: typography.xl * 1.35,
  },
  answers: {
    gap: spacing.sm,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  answerSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  answerLabel: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  answerLabelSelected: {
    backgroundColor: colors.primary,
  },
  answerLabelText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  answerText: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textPrimary,
    lineHeight: typography.base * 1.4,
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
  buttonDisabled: {
    opacity: 0.4,
  },
  // Result screen
  resultContent: {
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  resultHeader: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xl,
  },
  resultEmoji: {
    fontSize: 48,
    color: colors.positive,
    fontWeight: '700',
  },
  resultTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultType: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultDesc: {
    fontSize: typography.base,
    color: colors.textSecondary,
    lineHeight: typography.base * 1.6,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bulletDot: {
    fontSize: typography.md,
    color: colors.textMuted,
    lineHeight: typography.base * 1.5,
  },
  numberLabel: {
    width: 20,
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: typography.base * 1.5,
  },
  listText: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textSecondary,
    lineHeight: typography.base * 1.5,
  },
});

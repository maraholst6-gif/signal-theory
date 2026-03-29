import React, { useEffect, useState } from 'react';
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
import { OnboardingStackParamList } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { getProfileMeta } from '../../hooks/useProfile';
import { DimensionBar } from '../../components/DimensionBar';

interface Props {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Onboarding'>;
}

export function OnboardingScreen({ navigation }: Props): React.ReactElement {
  const { appUser } = useAuth();
  const [quizProfile, setQuizProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkQuizProfile = async (): Promise<void> => {
      if (!appUser) {
        setLoading(false);
        return;
      }

      if (appUser.quiz_profile_id) {
        const { data } = await supabase
          .from('quiz_profiles')
          .select('*')
          .eq('id', appUser.quiz_profile_id)
          .single();

        setQuizProfile(data);
      }

      setLoading(false);
    };

    checkQuizProfile();
  }, [appUser]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const profileMeta = getProfileMeta(appUser?.profile_type ?? 'unknown');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {quizProfile ? (
          // ── Quiz profile found ─────────────────
          <View style={styles.content}>
            <View style={styles.welcomeHeader}>
              <View style={styles.checkBadge}>
                <Text style={styles.checkSymbol}>✓</Text>
              </View>
              <Text style={styles.welcomeTitle}>Your profile is ready.</Text>
              <Text style={styles.welcomeSubtitle}>
                We linked your Signal Theory quiz results.
              </Text>
            </View>

            {/* Profile card */}
            <View style={styles.profileCard}>
              <Text style={styles.profileTypeLabel}>Your Profile</Text>
              <Text style={styles.profileTypeName}>{profileMeta.title}</Text>
              <Text style={styles.profileDesc}>{profileMeta.description}</Text>

              <View style={styles.dimensionSection}>
                <DimensionBar
                  label="Signal Reading"
                  score={quizProfile.signal_score ?? profileMeta.signalScore}
                  color={colors.primary}
                />
                <DimensionBar
                  label="Readiness"
                  score={quizProfile.readiness_score ?? profileMeta.readinessScore}
                  color={colors.positive}
                />
                <DimensionBar
                  label="Strategy"
                  score={quizProfile.strategy_score ?? profileMeta.strategyScore}
                  color={colors.neutral}
                />
              </View>
            </View>

            {/* Blind spots */}
            {profileMeta.blindSpots.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Blind Spots</Text>
                {profileMeta.blindSpots.map((spot, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.listText}>{spot}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Action plan */}
            {profileMeta.actionPlan.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Practice Plan</Text>
                {profileMeta.actionPlan.map((item, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.numberLabel}>{idx + 1}</Text>
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
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
        ) : (
          // ── No quiz profile — send to mini quiz ─
          <View style={styles.content}>
            <View style={styles.welcomeHeader}>
              <View style={styles.questionBadge}>
                <Text style={styles.questionSymbol}>?</Text>
              </View>
              <Text style={styles.welcomeTitle}>Let's get your baseline.</Text>
              <Text style={styles.welcomeSubtitle}>
                A quick 5-question quiz tells us where to focus your practice.
              </Text>
            </View>

            <View style={styles.quizPreview}>
              {['Signal reading', 'Readiness', 'Strategy'].map((dim) => (
                <View key={dim} style={styles.quizPreviewItem}>
                  <View style={styles.quizDot} />
                  <Text style={styles.quizPreviewText}>{dim}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.quizNote}>
              Takes about 2 minutes. No right or wrong — just calibration.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('MiniQuiz')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>Take the Quiz</Text>
              </LinearGradient>
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
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  content: {
    gap: spacing.xl,
  },
  welcomeHeader: {
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  checkBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.positive}25`,
    borderWidth: 1.5,
    borderColor: colors.positive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSymbol: {
    fontSize: typography.xl,
    color: colors.positive,
    fontWeight: '700',
  },
  questionBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${colors.primary}25`,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionSymbol: {
    fontSize: typography.xxl,
    color: colors.primary,
    fontWeight: '700',
  },
  welcomeTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.base * 1.5,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  profileTypeLabel: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  profileTypeName: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  profileDesc: {
    fontSize: typography.base,
    color: colors.textSecondary,
    lineHeight: typography.base * 1.5,
  },
  dimensionSection: {
    gap: spacing.md,
    paddingTop: spacing.sm,
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
  quizPreview: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  quizPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quizDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  quizPreviewText: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  quizNote: {
    fontSize: typography.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.sm * 1.6,
  },
  primaryButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  primaryGradient: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
  },
  primaryButtonText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.white,
  },
});

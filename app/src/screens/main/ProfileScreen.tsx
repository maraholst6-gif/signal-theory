import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { ProfileStackParamList } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useProfile, getProfileMeta } from '../../hooks/useProfile';
import { DimensionBar } from '../../components/DimensionBar';
import { LoadingSpinner } from '../../components/LoadingSpinner';

interface Props {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'ProfileHome'>;
}

export function ProfileScreen({ navigation }: Props): React.ReactElement {
  const { appUser, signOut } = useAuth();
  const { quizProfile, loading } = useProfile(appUser?.id);

  const handleSignOut = useCallback(async (): Promise<void> => {
    await signOut();
  }, [signOut]);

  if (loading || !appUser) {
    return <LoadingSpinner fullScreen />;
  }

  const profileMeta = getProfileMeta(appUser.profile_type);
  const signalScore = quizProfile?.signal_score ?? profileMeta.signalScore;
  const readinessScore = quizProfile?.readiness_score ?? profileMeta.readinessScore;
  const strategyScore = quizProfile?.strategy_score ?? profileMeta.strategyScore;

  const subLabel =
    appUser.subscription_status === 'free'
      ? 'Free Plan'
      : appUser.subscription_status === 'monthly'
      ? 'Signal Pro — Monthly'
      : 'Signal Pro — Annual';

  const subColor =
    appUser.subscription_status === 'free' ? colors.textMuted : colors.primary;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {(appUser.display_name ?? appUser.email)[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.profileName}>
            {appUser.display_name ?? appUser.email.split('@')[0]}
          </Text>
          <View style={styles.profileTypeBadge}>
            <Text style={styles.profileTypeText}>{profileMeta.title}</Text>
          </View>
        </View>

        {/* Dimension scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Signal Profile</Text>
          <View style={styles.dimensionCard}>
            <DimensionBar
              label="Signal Reading"
              score={signalScore}
              color={colors.primary}
            />
            <DimensionBar
              label="Readiness"
              score={readinessScore}
              color={colors.positive}
            />
            <DimensionBar
              label="Strategy"
              score={strategyScore}
              color={colors.neutral}
            />
          </View>
          <Text style={styles.dimensionNote}>{profileMeta.description}</Text>
        </View>

        {/* Blind spots */}
        {profileMeta.blindSpots.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blind Spots to Watch</Text>
            <View style={styles.listCard}>
              {profileMeta.blindSpots.map((spot, idx) => (
                <View key={idx} style={styles.listItem}>
                  <View style={styles.listBullet} />
                  <Text style={styles.listText}>{spot}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action plan */}
        {profileMeta.actionPlan.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Practice Plan</Text>
            <View style={styles.listCard}>
              {profileMeta.actionPlan.map((item, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.numberLabel}>{idx + 1}</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsCard}>
            {/* Subscription row */}
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>Subscription</Text>
              <Text style={[styles.settingsValue, { color: subColor }]}>
                {subLabel}
              </Text>
            </View>

            {appUser.subscription_status === 'free' && (
              <TouchableOpacity
                style={styles.upgradeRow}
                onPress={() => navigation.navigate('Paywall', { trigger: 'manual' })}
                activeOpacity={0.75}
              >
                <Text style={styles.upgradeText}>Upgrade to Signal Pro →</Text>
              </TouchableOpacity>
            )}

            <View style={styles.divider} />

            {/* Email row */}
            <View style={styles.settingsRow}>
              <Text style={styles.settingsLabel}>Email</Text>
              <Text style={styles.settingsValue} numberOfLines={1}>
                {appUser.email}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Sign out */}
            <TouchableOpacity
              style={styles.signOutRow}
              onPress={handleSignOut}
              activeOpacity={0.75}
            >
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
  profileHeader: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${colors.primary}25`,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: typography.xxl,
    fontWeight: '800',
    color: colors.primary,
  },
  profileName: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileTypeBadge: {
    backgroundColor: `${colors.primary}20`,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  profileTypeText: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.primary,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dimensionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  dimensionNote: {
    fontSize: typography.sm,
    color: colors.textMuted,
    lineHeight: typography.sm * 1.6,
    paddingHorizontal: spacing.xs,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  listBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 7,
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
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingsLabel: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  settingsValue: {
    fontSize: typography.base,
    color: colors.textPrimary,
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  upgradeRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  upgradeText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  signOutRow: {
    padding: spacing.md,
  },
  signOutText: {
    fontSize: typography.base,
    color: colors.negative,
    fontWeight: '600',
  },
});

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { PurchasesPackage } from 'react-native-purchases';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { ProfileStackParamList } from '../../types';
import { getPackages, purchasePackage, restorePurchases } from '../../lib/revenuecat';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'Paywall'>;
  route: RouteProp<ProfileStackParamList, 'Paywall'>;
}

const FEATURES = [
  { icon: '∞', title: 'Unlimited scenarios', desc: 'Every week, no limits.' },
  { icon: '∞', title: 'Unlimited analysis', desc: 'Paste anything, get a read.' },
  { icon: '↑', title: 'Progress tracking', desc: 'See your accuracy improve over time.' },
  { icon: '◈', title: 'Pattern reports', desc: 'Identify your recurring blind spots.' },
];

export function PaywallScreen({ navigation, route }: Props): React.ReactElement {
  const { trigger } = route.params;
  const { appUser, refreshUser } = useAuth();

  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPkg, setSelectedPkg] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [stats, setStats] = useState({ scenarios: 0, accuracy: 0 });

  const loadData = useCallback(async (): Promise<void> => {
    try {
      const [pkgList] = await Promise.all([getPackages()]);

      setPackages(pkgList);

      // Default select annual if available
      const annual = pkgList.find((p) =>
        p.packageType === 'ANNUAL' ||
        p.identifier.toLowerCase().includes('annual') ||
        p.identifier.toLowerCase().includes('yearly')
      );
      setSelectedPkg(annual ?? pkgList[0] ?? null);

      // Load user stats for the paywall pitch
      if (appUser) {
        const { data } = await supabase
          .from('scenario_results')
          .select('was_correct')
          .eq('user_id', appUser.id);

        if (data && data.length > 0) {
          const correct = data.filter((r) => r.was_correct).length;
          const accuracy = Math.round((correct / data.length) * 100);
          setStats({ scenarios: data.length, accuracy });
        }
      }
    } catch (err) {
      console.error('[PaywallScreen] load error:', err);
    } finally {
      setLoading(false);
    }
  }, [appUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePurchase = async (): Promise<void> => {
    if (!selectedPkg) return;

    setPurchasing(true);

    const result = await purchasePackage(selectedPkg);

    if (result.success) {
      // Update subscription status in Supabase
      if (appUser) {
        const isAnnual =
          selectedPkg.packageType === 'ANNUAL' ||
          selectedPkg.identifier.toLowerCase().includes('annual');

        await supabase
          .from('users')
          .update({
            subscription_status: isAnnual ? 'annual' : 'monthly',
          })
          .eq('id', appUser.id);

        await refreshUser();
      }

      Alert.alert(
        'Welcome to Signal Pro',
        'You now have unlimited practice. Start training.',
        [{ text: 'Start Practicing', onPress: () => navigation.goBack() }]
      );
    } else if (result.error && result.error !== 'cancelled') {
      Alert.alert('Purchase Failed', result.error);
    }

    setPurchasing(false);
  };

  const handleRestore = async (): Promise<void> => {
    setRestoring(true);
    const restored = await restorePurchases();

    if (restored && appUser) {
      await supabase
        .from('users')
        .update({ subscription_status: 'monthly' })
        .eq('id', appUser.id);
      await refreshUser();

      Alert.alert(
        'Purchases Restored',
        'Your Signal Pro subscription is active.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert(
        'No Purchases Found',
        'No previous Signal Pro subscription was found for this account.'
      );
    }

    setRestoring(false);
  };

  const getTriggerMessage = (): string => {
    switch (trigger) {
      case 'scenario':
        return "You've used all 5 scenarios this week.";
      case 'analysis':
        return "You've used your free analysis this week.";
      case 'progress':
        return 'Progress tracking is a Signal Pro feature.';
      default:
        return 'Upgrade to unlock unlimited practice.';
    }
  };

  const formatPrice = (pkg: PurchasesPackage): string => {
    return pkg.product.priceString;
  };

  const getPackageLabel = (pkg: PurchasesPackage): string => {
    if (
      pkg.packageType === 'ANNUAL' ||
      pkg.identifier.toLowerCase().includes('annual') ||
      pkg.identifier.toLowerCase().includes('yearly')
    ) {
      return 'Annual';
    }
    return 'Monthly';
  };

  const isAnnualPackage = (pkg: PurchasesPackage): boolean => {
    return (
      pkg.packageType === 'ANNUAL' ||
      pkg.identifier.toLowerCase().includes('annual') ||
      pkg.identifier.toLowerCase().includes('yearly')
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.triggerMessage}>{getTriggerMessage()}</Text>
          <Text style={styles.headerTitle}>Signal Pro</Text>
          <Text style={styles.headerSubtitle}>
            Unlimited practice. No more Monday waiting.
          </Text>
        </View>

        {/* Mini stats */}
        {stats.scenarios > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statNumber}>{stats.scenarios}</Text>
              <Text style={styles.statLabel}>scenarios</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statPill}>
              <Text style={styles.statNumber}>{stats.accuracy}%</Text>
              <Text style={styles.statLabel}>accuracy</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statPill}>
              <Text style={styles.statNumber}>↑</Text>
              <Text style={styles.statLabel}>more to go</Text>
            </View>
          </View>
        )}

        {/* Features */}
        <View style={styles.features}>
          {FEATURES.map((f, idx) => (
            <View key={idx} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>{f.icon}</Text>
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing */}
        {loading ? (
          <View style={styles.loadingPackages}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : packages.length > 0 ? (
          <View style={styles.pricing}>
            <Text style={styles.pricingTitle}>Choose Your Plan</Text>
            <View style={styles.packages}>
              {packages.map((pkg) => {
                const isSelected = selectedPkg?.identifier === pkg.identifier;
                const isAnnual = isAnnualPackage(pkg);

                return (
                  <TouchableOpacity
                    key={pkg.identifier}
                    style={[
                      styles.package,
                      isSelected && styles.packageSelected,
                    ]}
                    onPress={() => setSelectedPkg(pkg)}
                    activeOpacity={0.8}
                  >
                    {isAnnual && (
                      <View style={styles.saveBadge}>
                        <Text style={styles.saveBadgeText}>BEST VALUE</Text>
                      </View>
                    )}
                    <Text style={styles.packageLabel}>{getPackageLabel(pkg)}</Text>
                    <Text style={styles.packagePrice}>{formatPrice(pkg)}</Text>
                    <Text style={styles.packagePeriod}>
                      {isAnnual ? 'per year' : 'per month'}
                    </Text>
                    {isAnnual && (
                      <Text style={styles.packageSaving}>
                        ~{pkg.product.priceString}/yr vs monthly
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          // Fallback pricing if RevenueCat not configured
          <View style={styles.pricing}>
            <Text style={styles.pricingTitle}>Signal Pro</Text>
            <View style={styles.fallbackPrice}>
              <Text style={styles.fallbackPriceText}>$19/mo or $149/yr</Text>
              <Text style={styles.fallbackNote}>
                Configure RevenueCat to enable in-app purchases.
              </Text>
            </View>
          </View>
        )}

        {/* CTA */}
        <View style={styles.cta}>
          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={handlePurchase}
            disabled={!selectedPkg || purchasing}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.purchaseGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {purchasing ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.purchaseButtonText}>Start Signal Pro</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dismissButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.dismissText}>Come Back Monday</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={restoring}
          >
            {restoring ? (
              <ActivityIndicator size="small" color={colors.textMuted} />
            ) : (
              <Text style={styles.restoreText}>Restore Purchases</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.legalNote}>
          Subscriptions auto-renew. Cancel anytime in App Store / Google Play settings.
        </Text>
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
  closeButton: {
    alignSelf: 'flex-end',
    padding: spacing.lg,
  },
  closeText: {
    fontSize: typography.md,
    color: colors.textMuted,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
    alignItems: 'center',
  },
  triggerMessage: {
    fontSize: typography.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: typography.xxxl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.base * 1.5,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.xl,
    padding: spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statPill: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  features: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconText: {
    fontSize: typography.md,
    color: colors.primary,
    fontWeight: '700',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.base,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  featureDesc: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },
  loadingPackages: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  pricing: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  pricingTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  packages: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  package: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    overflow: 'visible',
    position: 'relative',
  },
  packageSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  saveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  packageLabel: {
    fontSize: typography.sm,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginTop: spacing.xs,
  },
  packagePrice: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  packagePeriod: {
    fontSize: typography.xs,
    color: colors.textMuted,
  },
  packageSaving: {
    fontSize: 10,
    color: colors.positive,
    fontWeight: '600',
    textAlign: 'center',
  },
  fallbackPrice: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  fallbackPriceText: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  fallbackNote: {
    fontSize: typography.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  cta: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  purchaseButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  purchaseGradient: {
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
  },
  purchaseButtonText: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  dismissButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dismissText: {
    fontSize: typography.base,
    color: colors.textSecondary,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  restoreText: {
    fontSize: typography.sm,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  legalNote: {
    fontSize: typography.xs,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    lineHeight: typography.xs * 1.6,
  },
});

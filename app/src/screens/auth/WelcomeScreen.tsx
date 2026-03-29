import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { AuthStackParamList } from '../../types';

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
}

export function WelcomeScreen({ navigation }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <LinearGradient
        colors={[colors.background, '#0F0F1A', colors.background]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe}>
        {/* Top spacer */}
        <View style={styles.topSpacer} />

        {/* Brand section */}
        <View style={styles.brand}>
          <View style={styles.logoMark}>
            <Text style={styles.logoSymbol}>ST</Text>
          </View>

          <Text style={styles.title}>Signal Theory</Text>

          <Text style={styles.tagline}>
            You know your blind spots.{'\n'}Now train them out.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.description}>
            Dating practice for divorced men who are done guessing. Read signals. Move with intention.
          </Text>
        </View>

        {/* CTA section */}
        <View style={styles.cta}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.primaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('SignIn')}
            activeOpacity={0.75}
          >
            <Text style={styles.secondaryButtonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            For men 35–55 navigating dating after divorce.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  topSpacer: {
    flex: 1,
  },
  brand: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    backgroundColor: `${colors.primary}25`,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoSymbol: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  title: {
    fontSize: typography.xxxl,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: typography.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lg * 1.4,
    fontStyle: 'italic',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  description: {
    fontSize: typography.base,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.base * 1.6,
    paddingHorizontal: spacing.md,
  },
  cta: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: spacing.md,
    paddingBottom: spacing.xl,
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
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  disclaimer: {
    fontSize: typography.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

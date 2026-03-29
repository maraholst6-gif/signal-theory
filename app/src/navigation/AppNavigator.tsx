import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

// ── Auth screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';

// ── Onboarding screens
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { MiniQuizScreen } from '../screens/onboarding/MiniQuizScreen';

// ── Main tab screens
import { PracticeScreen } from '../screens/main/PracticeScreen';
import { AnalyzeScreen } from '../screens/main/AnalyzeScreen';
import { ProgressScreen } from '../screens/main/ProgressScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';

// ── Scenario screens
import { ScenarioScreen } from '../screens/scenario/ScenarioScreen';
import { ScenarioResultScreen } from '../screens/scenario/ScenarioResultScreen';

// ── Analysis screens
import { AnalysisHistoryScreen } from '../screens/analysis/AnalysisHistoryScreen';

// ── Paywall
import { PaywallScreen } from '../screens/paywall/PaywallScreen';

// ── Param list types
import {
  AuthStackParamList,
  OnboardingStackParamList,
  MainTabParamList,
  PracticeStackParamList,
  AnalyzeStackParamList,
  ProfileStackParamList,
} from '../types';

// ─────────────────────────────────────────────
// Stack/Tab navigators
// ─────────────────────────────────────────────

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const PracticeStack = createNativeStackNavigator<PracticeStackParamList>();
const AnalyzeStack = createNativeStackNavigator<AnalyzeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// ─────────────────────────────────────────────
// Theme
// ─────────────────────────────────────────────

const NAV_THEME = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.primary,
  },
};

const SCREEN_OPTIONS = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.textPrimary,
  headerTitleStyle: { fontWeight: '700' as const },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background },
};

// ─────────────────────────────────────────────
// Auth stack
// ─────────────────────────────────────────────

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ ...SCREEN_OPTIONS, headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// ─────────────────────────────────────────────
// Onboarding stack
// ─────────────────────────────────────────────

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ ...SCREEN_OPTIONS, headerShown: false }}>
      <OnboardingStack.Screen name="Onboarding" component={OnboardingScreen} />
      <OnboardingStack.Screen name="MiniQuiz" component={MiniQuizScreen} />
    </OnboardingStack.Navigator>
  );
}

// ─────────────────────────────────────────────
// Practice stack (tab 1)
// ─────────────────────────────────────────────

function PracticeNavigator() {
  return (
    <PracticeStack.Navigator screenOptions={{ ...SCREEN_OPTIONS, headerShown: false }}>
      <PracticeStack.Screen name="PracticeHome" component={PracticeScreen} />
      <PracticeStack.Screen name="Scenario" component={ScenarioScreen} />
      <PracticeStack.Screen name="ScenarioResult" component={ScenarioResultScreen} />
    </PracticeStack.Navigator>
  );
}

// ─────────────────────────────────────────────
// Analyze stack (tab 2)
// ─────────────────────────────────────────────

function AnalyzeNavigator() {
  return (
    <AnalyzeStack.Navigator screenOptions={{ ...SCREEN_OPTIONS, headerShown: false }}>
      <AnalyzeStack.Screen name="AnalyzeHome" component={AnalyzeScreen} />
      <AnalyzeStack.Screen name="AnalysisHistory" component={AnalysisHistoryScreen} />
    </AnalyzeStack.Navigator>
  );
}

// ─────────────────────────────────────────────
// Profile stack (tab 4) — includes paywall modal
// ─────────────────────────────────────────────

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ ...SCREEN_OPTIONS, headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
      <ProfileStack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{ presentation: 'modal' }}
      />
    </ProfileStack.Navigator>
  );
}

// ─────────────────────────────────────────────
// Main tab navigator
// ─────────────────────────────────────────────

function MainTabNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Practice') {
            iconName = focused ? 'flash' : 'flash-outline';
          } else if (route.name === 'Analyze') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <MainTab.Screen name="Practice" component={PracticeNavigator} />
      <MainTab.Screen name="Analyze" component={AnalyzeNavigator} />
      <MainTab.Screen name="Progress" component={ProgressScreen} />
      <MainTab.Screen name="Profile" component={ProfileNavigator} />
    </MainTab.Navigator>
  );
}

// ─────────────────────────────────────────────
// Root navigator — decides which flow to show
// ─────────────────────────────────────────────

export function AppNavigator(): React.ReactElement {
  const { session, appUser, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.splashText}>Signal Theory</Text>
      </View>
    );
  }

  const isLoggedIn = !!session;
  const hasProfile =
    isLoggedIn && appUser && appUser.profile_type !== 'unknown';

  return (
    <NavigationContainer theme={NAV_THEME}>
      {!isLoggedIn ? (
        <AuthNavigator />
      ) : !hasProfile ? (
        <OnboardingNavigator />
      ) : (
        <MainTabNavigator />
      )}
    </NavigationContainer>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  splashText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 4,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
});

import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { initializeRevenueCat } from './src/lib/revenuecat';
import { AppNavigator } from './src/navigation/AppNavigator';

// ─────────────────────────────────────────────
// Signal Theory — Root App Component
// ─────────────────────────────────────────────

export default function App(): React.ReactElement {
  useEffect(() => {
    // Initialize RevenueCat (no userId yet — identified after sign-in)
    initializeRevenueCat().catch((err) => {
      console.warn('[App] RevenueCat init error:', err);
    });
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}

import { Platform } from 'react-native';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';

// ─────────────────────────────────────────────
// RevenueCat configuration
// ─────────────────────────────────────────────

const API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ?? '';
const API_KEY_ANDROID =
  process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ?? '';

export const ENTITLEMENT_PRO = 'signal_pro';
export const OFFERING_DEFAULT = '$rc_default';

// ─────────────────────────────────────────────
// Initialize (call in App.tsx on mount)
// ─────────────────────────────────────────────

export async function initializeRevenueCat(userId?: string): Promise<void> {
  try {
    if (__DEV__) {
      await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;

    if (!apiKey) {
      console.warn(
        '[RevenueCat] Missing API key. Set EXPO_PUBLIC_REVENUECAT_API_KEY_IOS / ANDROID.'
      );
      return;
    }

    await Purchases.configure({ apiKey });

    if (userId) {
      await Purchases.logIn(userId);
    }
  } catch (err) {
    console.error('[RevenueCat] Initialization error:', err);
  }
}

// ─────────────────────────────────────────────
// Check entitlement
// ─────────────────────────────────────────────

export async function checkProEntitlement(): Promise<boolean> {
  try {
    const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
    return (
      customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined
    );
  } catch (err) {
    console.error('[RevenueCat] Entitlement check failed:', err);
    return false;
  }
}

// ─────────────────────────────────────────────
// Fetch available packages
// ─────────────────────────────────────────────

export async function getPackages(): Promise<PurchasesPackage[]> {
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current ?? offerings.all[OFFERING_DEFAULT];
    return current?.availablePackages ?? [];
  } catch (err) {
    console.error('[RevenueCat] Failed to fetch packages:', err);
    return [];
  }
}

// ─────────────────────────────────────────────
// Purchase a package
// ─────────────────────────────────────────────

export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isPro =
      customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined;
    return { success: isPro, customerInfo };
  } catch (err: any) {
    if (err.userCancelled) {
      return { success: false, error: 'cancelled' };
    }
    console.error('[RevenueCat] Purchase failed:', err);
    return { success: false, error: err.message ?? 'Purchase failed.' };
  }
}

// ─────────────────────────────────────────────
// Restore purchases
// ─────────────────────────────────────────────

export async function restorePurchases(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined;
  } catch (err) {
    console.error('[RevenueCat] Restore failed:', err);
    return false;
  }
}

// ─────────────────────────────────────────────
// Identify user after sign-in
// ─────────────────────────────────────────────

export async function identifyUser(userId: string): Promise<void> {
  try {
    await Purchases.logIn(userId);
  } catch (err) {
    console.error('[RevenueCat] identifyUser failed:', err);
  }
}

// ─────────────────────────────────────────────
// Reset on sign-out
// ─────────────────────────────────────────────

export async function resetRevenueCat(): Promise<void> {
  try {
    await Purchases.logOut();
  } catch (err) {
    console.error('[RevenueCat] logout failed:', err);
  }
}

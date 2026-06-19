import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { OneSignal } from 'react-native-onesignal';

import { useSubscription } from '@/hooks/use-subscription';
import { isOneSignalConfigured } from '@/lib/onesignal';
import { isSubscriptionActive, isSubscriptionEnforced } from '@/lib/subscription';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationsStore } from '@/stores/notifications-store';

// Trigger/tag key OneSignal listens on for the (optional) dashboard In-App
// Message + welcome Journey push.
const WELCOME_TRIGGER = 'onboarded';
const WELCOME_FLAG_PREFIX = 'bingebox.welcomed.';

const isPushEnabled = Platform.OS === 'android' && isOneSignalConfigured;

// Fire the onboarding welcome exactly once per user — the first time they reach
// Home as a full user (signup, and payment when the paywall is enforced). The
// welcome lands in the in-app inbox immediately, with no OneSignal dependency.
export function useOnboardingWelcome() {
  const status = useAuthStore((state) => state.status);
  const { data: subscription } = useSubscription();
  const firing = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated') return;
    // Require an active subscription only where the paywall is enforced, so the
    // welcome fires right after signup in dev and after payment in production.
    if (isSubscriptionEnforced && !isSubscriptionActive(subscription)) return;
    if (firing.current) return;

    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    firing.current = true;
    fireWelcomeOnce(userId);
  }, [status, subscription]);
}

async function fireWelcomeOnce(userId: string) {
  const flagKey = WELCOME_FLAG_PREFIX + userId;
  const alreadyWelcomed = await AsyncStorage.getItem(flagKey);
  if (alreadyWelcomed) return;

  await AsyncStorage.setItem(flagKey, '1');

  // Immediate, self-contained welcome — shows in the bell/inbox right away.
  useNotificationsStore.getState().add({
    id: `welcome-${userId}`,
    title: 'Welcome to BingeBox 🎬',
    body: 'Your binge starts now — explore trending movies and shows.',
    receivedAt: Date.now(),
  });

  // Also fire the OneSignal trigger/tag so a dashboard-configured In-App Message
  // and welcome Journey (tray push) fire too, if/when they're set up.
  if (isPushEnabled) {
    OneSignal.InAppMessages.addTrigger(WELCOME_TRIGGER, '1');
    OneSignal.User.addTag(WELCOME_TRIGGER, '1');
  }
}

import { useEffect } from 'react';
import { Platform } from 'react-native';
import {
  LogLevel,
  OneSignal,
  type NotificationClickEvent,
  type NotificationWillDisplayEvent,
} from 'react-native-onesignal';

import { isOneSignalConfigured, onesignalAppId } from '@/lib/onesignal';
import { toAppNotification } from '@/lib/notification';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationsStore } from '@/stores/notifications-store';

// Push is Android-only for now, and OneSignal is a native module that only
// exists in a dev/standalone build — so both checks must pass before we touch
// the SDK.
const isPushEnabled = Platform.OS === 'android' && isOneSignalConfigured;

// Initialize OneSignal once on launch, prompt for the notification permission,
// and mirror every notification the app sees into the in-app inbox.
export function usePushNotifications() {
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    if (!isPushEnabled) return;

    if (__DEV__) {
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    }

    OneSignal.initialize(onesignalAppId);
    OneSignal.Notifications.requestPermission(true);

    // Arrived while the app is in the foreground. Let it display as usual and
    // record it in the inbox.
    const handleForeground = (event: NotificationWillDisplayEvent) => {
      useNotificationsStore.getState().add(toAppNotification(event.getNotification()));
    };

    // The user tapped a notification (app was backgrounded/closed). Record it so
    // it's still captured even when the foreground listener never ran.
    const handleClick = (event: NotificationClickEvent) => {
      useNotificationsStore.getState().add(toAppNotification(event.notification));
    };

    OneSignal.Notifications.addEventListener('foregroundWillDisplay', handleForeground);
    OneSignal.Notifications.addEventListener('click', handleClick);

    return () => {
      OneSignal.Notifications.removeEventListener('foregroundWillDisplay', handleForeground);
      OneSignal.Notifications.removeEventListener('click', handleClick);
    };
  }, []);

  // Tie the OneSignal external ID to the Supabase user so notifications can be
  // targeted per account across devices.
  useEffect(() => {
    if (!isPushEnabled) return;

    if (status === 'authenticated') {
      const userId = useAuthStore.getState().user?.id;
      if (userId) OneSignal.login(userId);
    } else if (status === 'unauthenticated') {
      OneSignal.logout();
    }
  }, [status]);
}

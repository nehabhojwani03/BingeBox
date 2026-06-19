import type { OSNotification } from 'react-native-onesignal';

import type { AppNotification } from '@/stores/notifications-store';

// Map a raw OneSignal notification into the inbox entry shape. Pure: no storage,
// no side effects.
export function toAppNotification(notification: OSNotification): Omit<AppNotification, 'read'> {
  return {
    id: notification.notificationId,
    title: notification.title ?? 'BingeBox',
    body: notification.body ?? '',
    launchUrl: notification.launchURL,
    receivedAt: Date.now(),
  };
}

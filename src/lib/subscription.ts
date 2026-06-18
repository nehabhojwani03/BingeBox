import type { Subscription } from '@/api/subscription-remote';

// The paywall is only enforced once Razorpay is configured (Phase 3). Until
// then the app stays fully usable so development isn't blocked behind a
// payment flow that doesn't exist yet.
export const isSubscriptionEnforced = Boolean(process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID);

// 'authenticated' = mandate authorized, first charge pending; 'active' = charged.
// Both grant access so the user isn't stuck on the paywall between authorizing
// payment and Razorpay capturing the first cycle.
const ACCESS_STATUSES = new Set(['active', 'authenticated']);

// Pure check: does this subscription grant access right now?
export function isSubscriptionActive(subscription: Subscription | null | undefined): boolean {
  if (!subscription || !ACCESS_STATUSES.has(subscription.status)) return false;
  if (!subscription.currentPeriodEnd) return true;
  return new Date(subscription.currentPeriodEnd).getTime() > Date.now();
}

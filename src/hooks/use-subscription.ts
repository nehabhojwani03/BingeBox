import { useQuery } from '@tanstack/react-query';

import { queries } from '@/queries';
import { useAuthStore } from '@/stores/auth-store';

export function useSubscription() {
  const userId = useAuthStore((state) => state.user?.id);
  return useQuery({
    ...queries.subscription.current(userId ?? ''),
    enabled: Boolean(userId),
    // While a payment is pending (row exists as 'created' but the webhook hasn't
    // marked it paid yet), poll so the paywall clears automatically once Razorpay
    // confirms — without the user having to relaunch the app.
    refetchInterval: (query) => (query.state.data?.status === 'created' ? 4000 : false),
  });
}

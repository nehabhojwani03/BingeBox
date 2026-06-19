import { useMutation, useQueryClient } from '@tanstack/react-query';

import { subscriptionRemote } from '@/api/subscription-remote';
import { queries } from '@/queries';
import { useAuthStore } from '@/stores/auth-store';

// Run once the checkout WebView reports a successful payment. Confirms the
// payment server-side, retrying a few times in case Razorpay takes a moment to
// mark it paid, then invalidates the subscription query so the auth gate
// re-evaluates and lifts the paywall.
export function useVerifySubscription() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: async () => {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const status = await subscriptionRemote.verify();
        if (status === 'active') return;
        await new Promise((resolve) => setTimeout(resolve, 2500));
      }
    },
    onSettled: () => {
      if (!userId) return;
      queryClient.invalidateQueries({
        queryKey: queries.subscription.current(userId).queryKey,
      });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as WebBrowser from 'expo-web-browser';

import { subscriptionRemote } from '@/api/subscription-remote';
import { queries } from '@/queries';
import { useAuthStore } from '@/stores/auth-store';

// Starts the Razorpay subscription: creates it server-side, opens the hosted
// checkout in a browser, then refetches the subscription so the paywall gate
// re-evaluates once the webhook activates it.
export function useStartSubscription() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: async (planId: string) => {
      const { shortUrl } = await subscriptionRemote.create(planId);
      await WebBrowser.openBrowserAsync(shortUrl);

      // The user has returned from checkout. Confirm payment server-side,
      // retrying a few times in case Razorpay takes a moment to mark it paid.
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

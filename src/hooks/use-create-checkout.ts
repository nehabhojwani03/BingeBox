import { useMutation } from '@tanstack/react-query';

import { subscriptionRemote } from '@/api/subscription-remote';

// Creates the Razorpay payment link server-side and returns its hosted-checkout
// URL. The paywall loads that URL in the in-app checkout WebView.
export function useCreateCheckout() {
  return useMutation({
    mutationFn: (planId: string) => subscriptionRemote.create(planId),
  });
}

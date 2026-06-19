// After a Razorpay payment link is paid, Razorpay redirects (GET) to the
// `callback_url` we set when creating the link, appending payment params —
// notably `razorpay_payment_link_status=paid`. The create-subscription Edge
// Function points that callback at CALLBACK_HOST below. We never actually load
// that page; the checkout WebView intercepts the redirect to detect success.
const CALLBACK_HOST = 'bingebox.app';

// Pure check: is this URL Razorpay's post-payment success redirect?
export function isPaymentSuccessUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== CALLBACK_HOST) return false;
    return parsed.searchParams.get('razorpay_payment_link_status') === 'paid';
  } catch {
    return false;
  }
}

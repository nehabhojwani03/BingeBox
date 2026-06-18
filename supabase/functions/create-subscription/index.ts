// Creates a one-time Razorpay Payment Link for the signed-in user and returns
// its hosted-checkout `short_url`. The app opens that URL in a browser; the
// `razorpay-webhook` function activates access when the link is paid.
//
// (Plan B: one-time payments instead of recurring subscriptions, because the
// Razorpay account isn't enabled for recurring mandates. Each paid link grants
// ACCESS_DAYS of access; the user re-pays when it lapses.)
//
// Deploy:  supabase functions deploy create-subscription
// Secrets: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_AMOUNT (paise, optional)
//          (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are injected automatically)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')!;
const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;

// Price in paise (₹149 = 14900). Override via the RAZORPAY_AMOUNT secret.
const AMOUNT_PAISE = Number(Deno.env.get('RAZORPAY_AMOUNT') ?? '14900');

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return json({ error: 'Missing authorization header.' }, 401);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return json({ error: 'Invalid session.' }, 401);
  }
  const userId = userData.user.id;

  // Create a one-time payment link on Razorpay.
  const razorpayResponse = await fetch('https://api.razorpay.com/v1/payment_links', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: AMOUNT_PAISE,
      currency: 'INR',
      description: 'BingeBox Premium — 1 month',
      notes: { user_id: userId },
      notify: { sms: false, email: false },
      reminder_enable: false,
    }),
  });

  const link = await razorpayResponse.json();
  if (!razorpayResponse.ok) {
    return json({ error: link?.error?.description ?? 'Razorpay error.' }, 502);
  }

  // Record the pending payment. The webhook flips it to active once paid.
  const { error: upsertError } = await supabase.from('subscriptions').upsert({
    user_id: userId,
    razorpay_subscription_id: link.id,
    plan_id: null,
    status: 'created',
    updated_at: new Date().toISOString(),
  });
  if (upsertError) {
    return json({ error: 'Could not save subscription.' }, 500);
  }

  return json({ subscriptionId: link.id, shortUrl: link.short_url });
});

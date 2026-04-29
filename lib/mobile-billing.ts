import type { User } from "@supabase/supabase-js";

import { upsertStripeCustomer } from "@/lib/billing";
import type { CurrencyCode } from "@/lib/currency";
import { env } from "@/lib/env";
import { getStripePriceId } from "@/lib/stripe-pricing";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

type ReturnMode = "web" | "app";
type StripePlan = "premium" | "family" | "lifetime";

const MOBILE_RETURN_BASE_URL = "app.vaultstory.mobile://billing-return";

function normalizeCurrencyCode(value: string | null | undefined): CurrencyCode {
  const normalized = value?.trim().toUpperCase();

  if (normalized === "AUD" || normalized === "USD" || normalized === "GBP" || normalized === "EUR") {
    return normalized;
  }

  return "USD";
}

function buildWebUrl(pathname: string, params?: Record<string, string>) {
  const url = new URL(pathname, env.NEXT_PUBLIC_APP_URL);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

function buildStripeSuccessUrl(pathname: string, params: Record<string, string>) {
  const sessionPlaceholder = "{CHECKOUT_SESSION_ID}";
  const encodedPlaceholder = encodeURIComponent(sessionPlaceholder);
  const url = buildWebUrl(pathname, params);

  return url.replace(encodedPlaceholder, sessionPlaceholder);
}

function buildMobileHostedReturnUrl(params: Record<string, string>) {
  return buildStripeSuccessUrl("/mobile-billing/return", params);
}

function buildMobileDeepLink(params: Record<string, string>) {
  const url = new URL(MOBILE_RETURN_BASE_URL);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}

function getMobileReturnTargets(params: Record<string, string>) {
  return {
    hostedReturnUrl: buildMobileHostedReturnUrl(params),
    deepLinkUrl: buildMobileDeepLink(params),
  };
}

export async function createStripeCheckoutUrl(options: {
  user: User;
  planId: StripePlan;
  currency?: string | null;
  returnMode?: ReturnMode;
  webCancelPath?: string;
}) {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured yet. Add STRIPE_SECRET_KEY first.");
  }

  const selectedPlan = options.planId;
  const currencyCode = normalizeCurrencyCode(options.currency);
  const selectedPriceId = getStripePriceId(selectedPlan, currencyCode);

  if (!selectedPriceId) {
    throw new Error(
      selectedPlan === "family"
        ? `Family checkout is not configured yet for ${currencyCode}.`
        : selectedPlan === "lifetime"
          ? `Founder Lifetime checkout is not configured yet for ${currencyCode}.`
          : `Premium checkout is not configured yet for ${currencyCode}.`,
    );
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,full_name,membership_plan,stripe_customer_id")
    .eq("id", options.user.id)
    .maybeSingle<{
      id: string;
      email: string | null;
      full_name: string | null;
      membership_plan: string | null;
      stripe_customer_id: string | null;
    }>();

  const email = profile?.email ?? options.user.email;
  if (!email) {
    throw new Error("We could not find an email address for your account.");
  }

  if (profile?.membership_plan === selectedPlan) {
    throw new Error(`Your account is already on ${selectedPlan === "family" ? "Family" : selectedPlan === "lifetime" ? "Founder Lifetime" : "Premium"}.`);
  }

  if (profile?.membership_plan && profile.membership_plan !== "free") {
    if (selectedPlan === "lifetime") {
      throw new Error("Founder Lifetime is only available from free accounts right now. Contact support if you need help switching from an active paid plan.");
    }
    throw new Error("Plan changes for existing paid memberships should go through billing management.");
  }

  const stripe = getStripe();
  let customerId = profile?.stripe_customer_id ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email,
      name:
        profile?.full_name ??
        (typeof options.user.user_metadata.full_name === "string" ? options.user.user_metadata.full_name : undefined),
      metadata: { supabaseUserId: options.user.id },
    });

    customerId = customer.id;
    await upsertStripeCustomer({
      userId: options.user.id,
      email,
      fullName:
        profile?.full_name ??
        (typeof options.user.user_metadata.full_name === "string" ? options.user.user_metadata.full_name : null),
      stripeCustomerId: customer.id,
    });
  }

  if (!customerId) {
    throw new Error("Stripe customer setup failed.");
  }

  const successParams = {
    billingSuccess: "1",
    billingPlan: selectedPlan,
    session_id: "{CHECKOUT_SESSION_ID}",
  };
  const cancelParams = { billingCanceled: "1" };
  const successUrl =
    options.returnMode === "app"
      ? getMobileReturnTargets(successParams).hostedReturnUrl
      : buildStripeSuccessUrl("/settings", successParams);
  const cancelUrl =
    options.returnMode === "app"
      ? getMobileReturnTargets(cancelParams).hostedReturnUrl
      : buildWebUrl(options.webCancelPath ?? "/dashboard", cancelParams);

  const session = await stripe.checkout.sessions.create({
    mode: selectedPlan === "lifetime" ? "payment" : "subscription",
    customer: customerId,
    client_reference_id: options.user.id,
    success_url: successUrl,
    cancel_url: cancelUrl,
    billing_address_collection: "auto",
    allow_promotion_codes: true,
    line_items: [
      {
        price: selectedPriceId,
        quantity: 1,
      },
    ],
    metadata: {
      supabaseUserId: options.user.id,
      membershipPlan: selectedPlan,
      stripePriceId: selectedPriceId,
    },
    ...(selectedPlan === "lifetime"
      ? {}
      : {
          subscription_data: {
            trial_period_days: 7,
            metadata: {
              supabaseUserId: options.user.id,
              membershipPlan: selectedPlan,
            },
          },
        }),
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  return session.url;
}

export async function createStripeBillingPortalUrl(options: {
  userId: string;
  returnMode?: ReturnMode;
}) {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe is not configured yet. Add STRIPE_SECRET_KEY first.");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", options.userId)
    .maybeSingle<{ stripe_customer_id: string | null }>();

  const customerId = profile?.stripe_customer_id;
  if (!customerId) {
    throw new Error("There is no Stripe billing account attached to this profile yet.");
  }

  const returnUrl =
    options.returnMode === "app"
      ? getMobileReturnTargets({ billingPortal: "1" }).hostedReturnUrl
      : buildWebUrl("/settings");

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a billing portal URL.");
  }

  return session.url;
}

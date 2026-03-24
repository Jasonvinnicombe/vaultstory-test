import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import type { CurrencyCode } from "@/lib/currency";
import type { MembershipPlan } from "@/lib/pricing";

const priceCache = new Map<string, { priceLabel: string; cadence: string }>();

function formatMoney(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function getStripePriceId(planId: MembershipPlan["id"], currency: CurrencyCode) {
  if (planId !== "premium" && planId !== "family") {
    return null;
  }

  if (planId === "premium") {
    if (currency === "AUD") return env.STRIPE_PREMIUM_PRICE_ID_AUD ?? env.STRIPE_PREMIUM_PRICE_ID;
    if (currency === "GBP") return env.STRIPE_PREMIUM_PRICE_ID_GBP ?? env.STRIPE_PREMIUM_PRICE_ID;
    if (currency === "EUR") return env.STRIPE_PREMIUM_PRICE_ID_EUR ?? env.STRIPE_PREMIUM_PRICE_ID;
    return env.STRIPE_PREMIUM_PRICE_ID_USD ?? env.STRIPE_PREMIUM_PRICE_ID;
  }

  if (currency === "AUD") return env.STRIPE_FAMILY_PRICE_ID_AUD ?? env.STRIPE_FAMILY_PRICE_ID;
  if (currency === "GBP") return env.STRIPE_FAMILY_PRICE_ID_GBP ?? env.STRIPE_FAMILY_PRICE_ID;
  if (currency === "EUR") return env.STRIPE_FAMILY_PRICE_ID_EUR ?? env.STRIPE_FAMILY_PRICE_ID;
  return env.STRIPE_FAMILY_PRICE_ID_USD ?? env.STRIPE_FAMILY_PRICE_ID;
}

export async function getPlanPriceDisplay(planId: MembershipPlan["id"], currency: CurrencyCode) {
  const priceId = getStripePriceId(planId, currency);
  if (!priceId || !env.STRIPE_SECRET_KEY) return null;

  const cached = priceCache.get(priceId);
  if (cached) return cached;

  const stripe = getStripe();
  const price = await stripe.prices.retrieve(priceId);

  if (!price || typeof price.unit_amount !== "number" || !price.currency) {
    return null;
  }

  const formatted = formatMoney(price.unit_amount / 100, currency);
  const cadence = price.recurring?.interval === "year" ? "/year" : "/month";
  const result = { priceLabel: formatted, cadence };
  priceCache.set(priceId, result);
  return result;
}


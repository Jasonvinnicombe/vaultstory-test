import type Stripe from "stripe";

export type MembershipPlanId = "free" | "premium" | "family" | "lifetime";

export type BillingProfile = {
  id: string;
  email: string;
  full_name: string | null;
  membership_plan: string;
  membership_status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_current_period_end: string | null;
  downgrade_grace_until: string | null;
};

const ENTITLED_STATUSES = new Set(["active", "trialing", "past_due"]);
export const FAMILY_MEMBER_LIMIT = 6;
export const DOWNGRADE_GRACE_DAYS = 30;

export function normalizeMembershipPlan(plan?: string | null): MembershipPlanId {
  switch (plan?.toLowerCase()) {
    case "premium":
      return "premium";
    case "family":
      return "family";
    case "lifetime":
      return "lifetime";
    default:
      return "free";
  }
}

export function resolveEntitledPlan(plan?: string | null, status?: string | null): MembershipPlanId {
  const normalizedPlan = normalizeMembershipPlan(plan);

  if (normalizedPlan === "free") {
    return "free";
  }

  if (!status) {
    return normalizedPlan;
  }

  return ENTITLED_STATUSES.has(status.toLowerCase()) ? normalizedPlan : "free";
}

export function getMembershipPlanForPrice(priceId?: string | null) {
  const { env } = require("@/lib/env") as typeof import("@/lib/env");

  const premiumPriceIds = [
    env.STRIPE_PREMIUM_PRICE_ID,
    env.STRIPE_PREMIUM_PRICE_ID_AUD,
    env.STRIPE_PREMIUM_PRICE_ID_USD,
    env.STRIPE_PREMIUM_PRICE_ID_GBP,
    env.STRIPE_PREMIUM_PRICE_ID_EUR,
  ].filter(Boolean);
  const familyPriceIds = [
    env.STRIPE_FAMILY_PRICE_ID,
    env.STRIPE_FAMILY_PRICE_ID_AUD,
    env.STRIPE_FAMILY_PRICE_ID_USD,
    env.STRIPE_FAMILY_PRICE_ID_GBP,
    env.STRIPE_FAMILY_PRICE_ID_EUR,
  ].filter(Boolean);
  const lifetimePriceIds = [
    env.STRIPE_LIFETIME_PRICE_ID,
    env.STRIPE_LIFETIME_PRICE_ID_AUD,
    env.STRIPE_LIFETIME_PRICE_ID_USD,
    env.STRIPE_LIFETIME_PRICE_ID_GBP,
    env.STRIPE_LIFETIME_PRICE_ID_EUR,
  ].filter(Boolean);

  if (priceId && premiumPriceIds.includes(priceId)) {
    return "premium";
  }

  if (priceId && familyPriceIds.includes(priceId)) {
    return "family";
  }

  if (priceId && lifetimePriceIds.includes(priceId)) {
    return "lifetime";
  }

  return "free";
}

export function getMembershipLabel(plan?: string | null) {
  switch (normalizeMembershipPlan(plan)) {
    case "premium":
      return "Premium";
    case "family":
      return "Family";
    case "lifetime":
      return "Lifetime";
    default:
      return "Free";
  }
}

export function hasPaidFeatureAccess(plan?: string | null, status?: string | null) {
  return resolveEntitledPlan(plan, status) !== "free";
}

export function getDowngradeGraceDeadline(referenceDate = new Date()) {
  const deadline = new Date(referenceDate);
  deadline.setDate(deadline.getDate() + DOWNGRADE_GRACE_DAYS);
  return deadline.toISOString();
}

export function isWithinDowngradeGrace(downgradeGraceUntil?: string | null) {
  if (!downgradeGraceUntil) {
    return false;
  }

  const deadline = new Date(downgradeGraceUntil);
  return Number.isFinite(deadline.getTime()) && deadline.getTime() > Date.now();
}

export function formatDowngradeGraceDate(downgradeGraceUntil?: string | null) {
  if (!downgradeGraceUntil) {
    return null;
  }

  const deadline = new Date(downgradeGraceUntil);
  if (!Number.isFinite(deadline.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(deadline);
}

export function getPlanStorageQuotaGb(plan?: string | null, status?: string | null) {
  switch (resolveEntitledPlan(plan, status)) {
    case "premium":
      return 50;
    case "family":
      return 100;
    case "lifetime":
      return 50;
    default:
      return 1;
  }
}

export function getEffectiveStorageQuotaGb(plan?: string | null, status?: string | null, customQuotaGb?: number | null) {
  if (typeof customQuotaGb === "number" && Number.isFinite(customQuotaGb) && customQuotaGb > 0) {
    return customQuotaGb;
  }

  return getPlanStorageQuotaGb(plan, status);
}

export function getVaultLimit(plan?: string | null, status?: string | null) {
  return resolveEntitledPlan(plan, status) === "free" ? 1 : Number.POSITIVE_INFINITY;
}

export function canCreateAnotherVault(plan: string | null | undefined, status: string | null | undefined, currentOwnedVaultCount: number) {
  return currentOwnedVaultCount < getVaultLimit(plan, status);
}

export function canUseMediaKind(plan: string | null | undefined, status: string | null | undefined, kind: "cover" | "photo" | "audio" | "video") {
  if (kind === "cover" || kind === "photo") {
    return true;
  }

  return resolveEntitledPlan(plan, status) !== "free";
}

export function canUseFamilyInvites(plan?: string | null, status?: string | null) {
  const entitledPlan = resolveEntitledPlan(plan, status);
  return entitledPlan === "family" || entitledPlan === "lifetime";
}

export function getFamilyMemberLimit(plan?: string | null, status?: string | null) {
  const entitledPlan = resolveEntitledPlan(plan, status);

  if (entitledPlan === "family") {
    return FAMILY_MEMBER_LIMIT;
  }

  if (entitledPlan === "lifetime") {
    return FAMILY_MEMBER_LIMIT;
  }

  return 0;
}

export function canInviteAnotherFamilyMember(
  plan: string | null | undefined,
  status: string | null | undefined,
  currentMemberCount: number,
  pendingInviteCount: number,
) {
  if (!canUseFamilyInvites(plan, status)) {
    return false;
  }

  const limit = getFamilyMemberLimit(plan, status);
  if (!Number.isFinite(limit)) {
    return true;
  }

  return currentMemberCount + pendingInviteCount < limit;
}

export function canUseMilestoneUnlocks(plan?: string | null, status?: string | null) {
  return resolveEntitledPlan(plan, status) !== "free";
}

export function getVaultLimitUpgradeMessage(plan?: string | null, status?: string | null) {
  const limit = getVaultLimit(plan, status);

  if (!Number.isFinite(limit)) {
    return "Your current plan can create more vaults.";
  }

  return `Free includes ${limit} vault. Upgrade to Premium to create more vaults.`;
}

export function getRichMediaUpgradeMessage() {
  return "Video and voice memories are available on Premium, Family, or Lifetime.";
}

export function getFamilyInviteUpgradeMessage() {
  return "Family invites are available on the Family or Founder Lifetime plan.";
}

export function getFamilyMemberLimitMessage() {
  return `Family and Founder Lifetime include up to ${FAMILY_MEMBER_LIMIT} people per vault. Remove a member or pending invite before adding another.`;
}

export function getMilestoneUnlockUpgradeMessage() {
  return "Milestone unlocks are available on Premium, Family, or Lifetime.";
}

export function mapStripeStatus(status?: Stripe.Subscription.Status | string | null) {
  switch (status) {
    case "active":
    case "trialing":
    case "past_due":
    case "canceled":
    case "unpaid":
    case "incomplete":
      return status;
    default:
      return "inactive";
  }
}

export async function upsertStripeCustomer(input: {
  userId: string;
  email: string;
  fullName?: string | null;
  stripeCustomerId: string;
}) {
  const { supabaseAdmin } = await import("@/lib/supabase/admin");

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      stripe_customer_id: input.stripeCustomerId,
      email: input.email,
      full_name: input.fullName ?? null,
    })
    .eq("id", input.userId);

  if (error) {
    throw new Error(error.message);
  }
}

function getSubscriptionCurrentPeriodEnd(subscription: Stripe.Subscription) {
  const periodEnd = subscription.items.data[0]?.current_period_end;
  return typeof periodEnd === "number" ? new Date(periodEnd * 1000).toISOString() : null;
}

export async function syncProfileBillingFromSubscription(options: {
  subscription: Stripe.Subscription;
  userId?: string | null;
  customerId?: string | null;
}) {
  const { supabaseAdmin } = await import("@/lib/supabase/admin");

  const priceId = options.subscription.items.data[0]?.price?.id ?? null;
  const payload = {
    membership_plan: getMembershipPlanForPrice(priceId),
    membership_status: mapStripeStatus(options.subscription.status),
    stripe_customer_id: options.customerId ?? (typeof options.subscription.customer === "string" ? options.subscription.customer : null),
    stripe_subscription_id: options.subscription.id,
    stripe_price_id: priceId,
    stripe_current_period_end: getSubscriptionCurrentPeriodEnd(options.subscription),
    downgrade_grace_until: null,
  };

  let query = supabaseAdmin.from("profiles").update(payload);

  if (options.userId) {
    query = query.eq("id", options.userId);
  } else if (options.customerId) {
    query = query.eq("stripe_customer_id", options.customerId);
  } else {
    throw new Error("Missing Stripe profile match for subscription sync.");
  }

  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }
}

export async function syncProfileBillingFromLifetimeCheckout(options: {
  userId: string;
  customerId?: string | null;
  priceId?: string | null;
}) {
  const { supabaseAdmin } = await import("@/lib/supabase/admin");

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      membership_plan: "lifetime",
      membership_status: "active",
      stripe_customer_id: options.customerId ?? null,
      stripe_subscription_id: null,
      stripe_price_id: options.priceId ?? null,
      stripe_current_period_end: null,
      downgrade_grace_until: null,
    })
    .eq("id", options.userId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function syncProfileBillingFromCanceledSubscription(customerId: string, subscriptionId: string) {
  const { supabaseAdmin } = await import("@/lib/supabase/admin");

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      membership_plan: "free",
      membership_status: "canceled",
      stripe_subscription_id: subscriptionId,
      stripe_price_id: null,
      stripe_current_period_end: null,
      downgrade_grace_until: getDowngradeGraceDeadline(),
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function verifyCheckoutSessionAndSync(options: {
  sessionId: string;
  userId: string;
  expectedPlan?: string | null;
}) {
  const { getStripe } = await import("@/lib/stripe");
  const { supabaseAdmin } = await import("@/lib/supabase/admin");

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(options.sessionId, {
    expand: ["subscription"],
  });

  if (session.status !== "complete") {
    throw new Error("Stripe checkout has not completed yet.");
  }

  const sessionUserId = session.client_reference_id ?? session.metadata?.supabaseUserId ?? null;
  if (sessionUserId !== options.userId) {
    throw new Error("This checkout session does not belong to the signed-in account.");
  }

  const customerId = typeof session.customer === "string" ? session.customer : null;

  if (customerId) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name")
      .eq("id", options.userId)
      .maybeSingle();

    if (profile?.email) {
      await upsertStripeCustomer({
        userId: options.userId,
        email: profile.email,
        fullName: profile.full_name,
        stripeCustomerId: customerId,
      });
    }
  }

  const expectedPlan = normalizeMembershipPlan(options.expectedPlan);

  if (session.mode === "payment") {
    const actualPlan = normalizeMembershipPlan(session.metadata?.membershipPlan ?? "free");
    const priceId = session.metadata?.stripePriceId ?? null;

    if (actualPlan !== "lifetime") {
      throw new Error("Stripe returned a non-lifetime one-time checkout.");
    }

    if (expectedPlan !== "free" && actualPlan !== expectedPlan) {
      throw new Error(`Stripe returned a ${getMembershipLabel(actualPlan)} checkout instead of ${getMembershipLabel(expectedPlan)}.`);
    }

    await syncProfileBillingFromLifetimeCheckout({
      userId: options.userId,
      customerId,
      priceId,
    });

    return {
      membershipPlan: actualPlan,
      membershipStatus: "active",
    };
  }

  if (session.mode !== "subscription") {
    throw new Error("Stripe returned an unsupported checkout mode.");
  }

  const subscription = typeof session.subscription === "string"
    ? await stripe.subscriptions.retrieve(session.subscription)
    : session.subscription;

  if (!subscription) {
    throw new Error("Stripe checkout completed without a subscription to sync.");
  }

  const actualPlan = getMembershipPlanForPrice(subscription.items.data[0]?.price?.id ?? null);
  if (expectedPlan !== "free" && actualPlan !== expectedPlan) {
    throw new Error(`Stripe returned a ${getMembershipLabel(actualPlan)} subscription instead of ${getMembershipLabel(expectedPlan)}.`);
  }

  await syncProfileBillingFromSubscription({
    subscription,
    userId: options.userId,
    customerId,
  });

  return {
    membershipPlan: actualPlan,
    membershipStatus: mapStripeStatus(subscription.status),
  };
}

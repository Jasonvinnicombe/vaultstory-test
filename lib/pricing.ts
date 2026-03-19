export type MembershipPlan = {
  id: "free" | "premium" | "family" | "lifetime";
  name: string;
  priceLabel: string;
  cadence: string;
  annualLabel?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlight?: boolean;
  badge?: string;
};

export type UpsellOffer = {
  name: string;
  priceLabel: string;
  description: string;
};

export type PlanComparisonRow = {
  label: string;
  values: Record<MembershipPlan["id"], string>;
};

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "free",
    name: "Free",
    priceLabel: "$0",
    cadence: "/month",
    description: "The growth engine. Start recording memories, get emotionally invested, and build the habit before you ever pay.",
    features: [
      "1 vault",
      "1GB storage",
      "Text and photo memories",
      "Basic unlock dates",
      "A calm way to start preserving what matters",
    ],
    ctaLabel: "Start free",
    ctaHref: "/signup",
  },
  {
    id: "premium",
    name: "Premium",
    priceLabel: "$7.99",
    cadence: "/month",
    annualLabel: "or $69/year",
    description: "The main paid tier for people who want richer storytelling, deeper media, and a stronger family archive.",
    features: [
      "Unlimited vaults",
      "50GB storage",
      "Video and voice memories",
      "Family invites",
      "Milestone unlocks",
      "AI summaries",
      "Timeline view",
    ],
    ctaLabel: "Choose Premium",
    ctaHref: "/signup?plan=premium",
    highlight: true,
    badge: "Best starting paid plan",
  },
  {
    id: "family",
    name: "Family",
    priceLabel: "$15",
    cadence: "/month",
    description: "Built for households preserving stories together across generations, milestones, and shared vault care.",
    features: [
      "Up to 6 family members",
      "Shared family vault",
      "100GB storage",
      "Grandparents can add stories",
      "Child milestone vaults",
      "Designed for the highest-value shared archive use case",
    ],
    ctaLabel: "Join Family waitlist",
    ctaHref: "mailto:hello@vaultstory.app?subject=Family%20Plan%20Interest",
    badge: "High-value family tier",
  },
  {
    id: "lifetime",
    name: "Lifetime Vault",
    priceLabel: "$299",
    cadence: "one time",
    description: "A legacy purchase for families who never want to wonder where the archive will live or who will keep it safe.",
    features: [
      "Lifetime storage",
      "Legacy messages",
      "Time capsules",
      "Future unlock events",
      "Inheritance release planning",
      "Long-term family archive preservation",
    ],
    ctaLabel: "Talk to us about Lifetime",
    ctaHref: "mailto:hello@vaultstory.app?subject=Lifetime%20Vault%20Interest",
    badge: "Once in a lifetime",
  },
];

export const PLAN_COMPARISON_ROWS: PlanComparisonRow[] = [
  {
    label: "Vaults included",
    values: {
      free: "1 vault",
      premium: "Unlimited",
      family: "Shared family vaults",
      lifetime: "Legacy archive",
    },
  },
  {
    label: "Storage",
    values: {
      free: "1GB",
      premium: "50GB",
      family: "100GB",
      lifetime: "Lifetime storage",
    },
  },
  {
    label: "Text memories",
    values: {
      free: "Included",
      premium: "Included",
      family: "Included",
      lifetime: "Included",
    },
  },
  {
    label: "Photo memories",
    values: {
      free: "Included",
      premium: "Included",
      family: "Included",
      lifetime: "Included",
    },
  },
  {
    label: "Video + voice memories",
    values: {
      free: "No",
      premium: "Included",
      family: "Included",
      lifetime: "Included",
    },
  },
  {
    label: "Basic unlock dates",
    values: {
      free: "Included",
      premium: "Included",
      family: "Included",
      lifetime: "Included",
    },
  },
  {
    label: "Milestone unlocks",
    values: {
      free: "No",
      premium: "Included",
      family: "Included",
      lifetime: "Included",
    },
  },
  {
    label: "Family invites",
    values: {
      free: "No",
      premium: "Included",
      family: "Up to 6 members",
      lifetime: "Included",
    },
  },
  {
    label: "AI summaries",
    values: {
      free: "No",
      premium: "Included",
      family: "Included",
      lifetime: "Included",
    },
  },
  {
    label: "Timeline view",
    values: {
      free: "No",
      premium: "Included",
      family: "Included",
      lifetime: "Included",
    },
  },
  {
    label: "Grandparents / shared stories",
    values: {
      free: "No",
      premium: "Limited",
      family: "Included",
      lifetime: "Included",
    },
  },
  {
    label: "Inheritance release / legacy planning",
    values: {
      free: "No",
      premium: "No",
      family: "No",
      lifetime: "Included",
    },
  },
];

export const UPSELL_OFFERS: UpsellOffer[] = [
  {
    name: "Printed Memory Books",
    priceLabel: "$79 - $129",
    description: "Turn vault memories into a beautifully produced keepsake book that families can hold in their hands.",
  },
  {
    name: "AI Story Builder",
    priceLabel: "$5/month add-on",
    description: "Guide relatives through prompts and interviews, then turn their stories into a cleaner life-story archive.",
  },
  {
    name: "Extra Storage",
    priceLabel: "+100GB for $3/month",
    description: "A simple expansion for growing family archives with more video, audio, and scanned history.",
  },
];
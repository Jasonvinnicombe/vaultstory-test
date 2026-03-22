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
      "Milestone unlocks",
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
    priceLabel: "$14.99",
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
    ctaLabel: "Choose Family plan",
    ctaHref: "/signup?plan=family",
    badge: "High-value family tier",
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
      premium: "No",
      family: "Up to 6 members",
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


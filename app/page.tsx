import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  CalendarClock,
  ChevronDown,
  HeartHandshake,
  ImageIcon,
  MessageSquareText,
  Mic,
  Quote,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  Video,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LandingHero, LandingProductPreview } from "@/components/marketing/landing-hero";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrencyFromHeaders } from "@/lib/currency";
import { getPlanPriceDisplay, getStripePriceId } from "@/lib/stripe-pricing";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const coreHighlights = [
  {
    title: "Capture memories",
    body: "Upload letters, photos, voice notes, and videos in one private place.",
    icon: Upload,
  },
  {
    title: "Choose the unlock moment",
    body: "Set a date, age, or milestone so each memory opens with intention.",
    icon: Calendar,
  },
  {
    title: "Deliver meaningfully",
    body: "When the future arrives, the memory feels chosen instead of forgotten.",
    icon: Sparkles,
  },
];

const mediaTypes = [
  {
    label: "Letters",
    detail: "For birthdays, future advice, reassurance, and family milestones.",
    icon: HeartHandshake,
  },
  {
    label: "Voice notes",
    detail: "So children and loved ones can hear your real voice again.",
    icon: Mic,
  },
  {
    label: "Photos",
    detail: "Preserve faces, places, and everyday moments before they fade.",
    icon: ImageIcon,
  },
  {
    label: "Videos",
    detail: "Capture movement, emotion, and stories that photos cannot hold alone.",
    icon: Video,
  },
];

const journeySteps = [
  {
    step: "01",
    title: "Create a vault",
    body: "Start a private space for a child, loved one, shared family archive, or future self.",
  },
  {
    step: "02",
    title: "Add your memories",
    body: "Save letters, photos, voice notes, and videos while the moment is still fresh.",
  },
  {
    step: "03",
    title: "Set the unlock",
    body: "Choose a date, age, or milestone for when each memory should be opened.",
  },
  {
    step: "04",
    title: "Invite the right people",
    body: "Share access where needed so trusted family members can help care for the archive.",
  },
  {
    step: "05",
    title: "Let it arrive with meaning",
    body: "When the moment comes, it feels intentional, personal, and emotionally on time.",
  },
];

const useCases = [
  {
    eyebrow: "Parents",
    title: "Record messages for birthdays, graduations, and the years ahead.",
  },
  {
    eyebrow: "Grandparents",
    title: "Preserve stories, wisdom, and family history for future generations.",
  },
  {
    eyebrow: "Families",
    title: "Build a shared archive of milestones, voices, and memories together.",
  },
  {
    eyebrow: "Future self",
    title: "Keep promises, reflections, and honest messages for a later chapter of life.",
  },
];

type MilestoneMask = {
  left: string;
  top: string;
  width: string;
  height: string;
  rotate?: string;
  borderRadius?: string;
};

type MilestoneMoment = {
  label: string;
  title: string;
  src: string;
  alt: string;
  masks: MilestoneMask[];
};

const milestoneMoments: MilestoneMoment[] = [
  {
    label: "First Christmas",
    title: "Save the little season while it still feels magical.",
    src: "/images/milestones/first-christmas.jpg",
    alt: "A young child sitting with a parent in matching Christmas clothes beside a decorated tree.",
    masks: [],
  },
  {
    label: "One year old",
    title: "Keep the face, the room, and the exact age they were.",
    src: "/images/milestones/one-year-old.jpg",
    alt: "A one-year-old child with a birthday candle while sitting with a parent.",
    masks: [],
  },
  {
    label: "First day of school",
    title: "Let the future reopen the day a whole new chapter began.",
    src: "/images/milestones/first-day-of-school.jpeg",
    alt: "A child smiling on the first day of school in uniform in front of a sign.",
    masks: [],
  },
  {
    label: "Last day of kindergarten",
    title: "Hold onto the milestone before it becomes a blur of fast years.",
    src: "/images/milestones/last-day-of-kindergarten.jpeg",
    alt: "A child holding a kindergarten graduation certificate and smiling in a cap and gown.",
    masks: [],
  },
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Private vaults and controlled access",
    body: "Built for personal memory-keeping, with access designed around trusted family relationships.",
  },
  {
    icon: CalendarClock,
    title: "Unlock by date, age, or milestone",
    body: "Every memory can be tied to the moment that gives it the most meaning.",
  },
  {
    icon: Users,
    title: "Invite family carefully",
    body: "Bring in the right people and decide how they help preserve or manage the archive.",
  },
  {
    icon: Video,
    title: "Built for rich memories",
    body: "Store photos, letters, voice notes, and video together instead of scattering them across apps.",
  },
];

const audienceFeatureImage = {
  src: "https://images.pexels.com/photos/7086018/pexels-photo-7086018.jpeg?auto=compress&cs=tinysrgb&w=1200",
  alt: "A young girl sharing a warm moment with her grandfather beside the water.",
};

const scenarioCards = [
  {
    eyebrow: "Wedding day unlock",
    title: "A mother records a message for the morning her daughter gets married.",
    body: "Saved years earlier, it arrives on the day it will mean the most.",
  },
  {
    eyebrow: "18th birthday letter",
    title: "A parent leaves advice, encouragement, and love for adulthood.",
    body: "The message opens when a child reaches a milestone worth marking intentionally.",
  },
  {
    eyebrow: "Grandparent story",
    title: "Family history, voice, and memories are preserved for future generations.",
    body: "Instead of fading with time, they become part of a living archive.",
  },
];

const reassurancePoints = [
  {
    question: "Who can access my vault and when?",
    answer:
      "You decide who can view or help manage each vault, so family access feels intentional instead of open-ended.",
  },
  {
    question: "How do timed unlocks actually work?",
    answer:
      "Each memory can be tied to a date, age, or milestone, so it opens when the moment matters instead of getting lost in everyday storage.",
  },
  {
    question: "Can I invite trusted family members later?",
    answer:
      "Yes. Start privately, then add the right people as your archive grows and your family needs change.",
  },
  {
    question: "Can I keep photos, voice notes, videos, and letters together?",
    answer:
      "Yes. Vault Story is designed to hold written memories, images, voice notes, and video in one place with shared context.",
  },
];

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage(props: HomePageProps) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const currencyParam = typeof searchParams.currency === "string" ? searchParams.currency : null;
  const detectedCurrency = getCurrencyFromHeaders(await headers(), currencyParam);
  const premiumDisplay = await getPlanPriceDisplay("premium", detectedCurrency);
  const familyDisplay = await getPlanPriceDisplay("family", detectedCurrency);
  const priceOverrides = {
    premium: premiumDisplay ?? undefined,
    family: familyDisplay ?? undefined,
  };
  const familyCheckoutEnabled = Boolean(getStripePriceId("family", detectedCurrency));
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vault Story",
    url: "https://www.vaultstory.app",
    logo: {
      "@type": "ImageObject",
      url: "https://www.vaultstory.app/Vaultstory.png",
      width: 2736,
      height: 1388,
    },
  };

  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <SiteHeader />
      <main>
        <LandingHero />

        <section className="page-wrap border-t border-white/55 py-10 sm:py-14 lg:py-18">
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
            <div className="section-stack max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">What Vault Story does</p>
              <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                A private vault for the memories that matter later.
              </h2>
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                Save meaningful messages and moments today, then choose exactly when they should be opened in the future.
              </p>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button asChild>
                  <Link href="/signup">Start free</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/#features">Explore vault uses</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {coreHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="glass-panel overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,250,244,0.97),rgba(245,234,222,0.84))] shadow-[0_18px_48px_rgba(143,71,43,0.08)]">
                    <CardContent className="p-6 sm:p-7">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/16 text-secondary-foreground ring-1 ring-secondary/25">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 font-display text-2xl leading-tight text-foreground">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{item.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="page-wrap scroll-mt-28 border-t border-white/55 py-10 sm:py-14 lg:py-18">
          <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
            <div className="section-stack max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">How it works</p>
              <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                Create a memory, choose when it should open, and let the future receive it at the right time.
              </h2>
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                Vault Story combines private storage, timed delivery, and family access so meaningful moments feel deliberate instead of forgotten.
              </p>

              <div className="grid gap-3 pt-2">
                {journeySteps.map((item) => (
                  <Card key={item.step} className="glass-panel">
                    <CardContent className="flex gap-4 p-5 sm:p-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/90 font-semibold text-secondary-foreground">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-display text-2xl leading-tight text-foreground">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">{item.body}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <LandingProductPreview />
          </div>
        </section>

        <section className="page-wrap border-t border-white/55 py-10 sm:py-14 lg:py-18">
          <div className="grid gap-4 lg:grid-cols-3">
            {scenarioCards.map((item) => (
              <Card key={item.title} className="overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,250,244,0.97),rgba(245,234,222,0.84))] shadow-[0_18px_48px_rgba(143,71,43,0.08)]">
                <CardContent className="p-6 sm:p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/16 text-secondary-foreground ring-1 ring-secondary/25">
                    <Quote className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-xs uppercase tracking-[0.22em] text-muted-foreground">{item.eyebrow}</p>
                  <h3 className="mt-3 font-display text-2xl leading-tight text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="page-wrap border-t border-white/55 py-10 sm:py-14 lg:py-18">
          <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:items-start">
            <div className="section-stack max-w-3xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">What you can save</p>
              <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                What you can save in Vault Story
              </h2>
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                Keep the words, voices, images, and videos that deserve more context than a camera roll or notes app can give them.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {mediaTypes.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.label} className="overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(245,234,222,0.82))] shadow-[0_18px_48px_rgba(143,71,43,0.07)]">
                      <CardContent className="p-6 sm:p-7">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/16 text-secondary-foreground ring-1 ring-secondary/25">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mt-5 font-display text-2xl leading-tight text-foreground">{item.label}</h3>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.detail}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {milestoneMoments.map((item) => (
                <Card key={item.label} className="overflow-hidden border-white/15 bg-[linear-gradient(180deg,rgba(143,71,43,0.98),rgba(184,92,56,0.94),rgba(201,126,103,0.9))] text-white shadow-[0_24px_60px_rgba(143,71,43,0.18)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    {item.masks.map((mask, index) => (
                      <div
                        key={`${item.label}-mask-${index}`}
                        className="absolute border border-white/12 bg-[rgba(88,45,28,0.46)] backdrop-blur-md"
                        style={{
                          left: mask.left,
                          top: mask.top,
                          width: mask.width,
                          height: mask.height,
                          transform: mask.rotate ? `rotate(${mask.rotate})` : undefined,
                          borderRadius: mask.borderRadius ?? "18px",
                        }}
                      />
                    ))}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,35,24,0.04),rgba(66,35,24,0.72))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/68">{item.label}</p>
                      <p className="mt-2 text-lg leading-7 text-white">{item.title}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="page-wrap scroll-mt-28 border-t border-white/55 py-10 sm:py-14 lg:py-18">
          <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
            <div className="section-stack max-w-3xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Who Vault Story is for</p>
              <h2 className="text-balance font-display text-4xl sm:text-5xl">
                Built for the people who want memories to land with meaning, not just sit in storage.
              </h2>
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                The strongest use cases are easy to understand: parents preserving the years ahead, grandparents saving family history, and households building a shared archive over time.
              </p>

              <Card className="overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,250,244,0.97),rgba(245,234,222,0.84))] shadow-[0_18px_48px_rgba(143,71,43,0.08)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={audienceFeatureImage.src}
                    alt={audienceFeatureImage.alt}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,35,24,0.06),rgba(66,35,24,0.14),rgba(66,35,24,0.46))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="inline-flex items-center rounded-full border border-white/30 bg-[rgba(255,250,244,0.2)] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/86 backdrop-blur-sm">
                      Grandparents and family history
                    </div>
                    <p className="mt-3 max-w-md text-lg leading-7 text-white sm:text-xl sm:leading-8">
                      A shared archive feels more real when it protects voices, stories, and moments across generations.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="overflow-hidden border-white/15 bg-[linear-gradient(180deg,rgba(143,71,43,0.98),rgba(184,92,56,0.94),rgba(201,126,103,0.9))] text-white shadow-[0_28px_72px_rgba(143,71,43,0.22)]">
              <CardContent className="p-6 sm:p-7">
                <Badge className="bg-secondary/90 text-secondary-foreground">Best-fit audiences</Badge>
                <div className="mt-5 space-y-4">
                  {useCases.map((item) => (
                    <div key={item.title} className="rounded-[24px] border border-white/12 bg-white/6 p-5">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/58">{item.eyebrow}</p>
                      <p className="mt-3 text-lg leading-8 text-white">{item.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {trustPoints.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="glass-panel">
                  <CardContent className="p-6 sm:p-7">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/90 text-secondary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-2xl text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="page-wrap border-t border-white/55 py-10 sm:py-14 lg:py-18">
          <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-start">
            <div className="section-stack max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Trust and clarity</p>
              <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                The questions people ask before they trust a family archive.
              </h2>
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                Memory products are emotional purchases, but they are also trust purchases. This section should answer the practical questions that sit behind the emotional decision to start.
              </p>
            </div>

            <Card className="glass-panel overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,250,244,0.97),rgba(245,234,222,0.84))] shadow-[0_18px_48px_rgba(143,71,43,0.08)]">
              <CardContent className="p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/16 text-secondary-foreground ring-1 ring-secondary/25">
                    <MessageSquareText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Questions to answer clearly</p>
                    <h3 className="mt-1 font-display text-2xl leading-tight text-foreground">Trust cues that reduce hesitation</h3>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {reassurancePoints.map((item) => (
                    <details
                      key={item.question}
                      name="trust-clarity"
                      className="group rounded-[24px] border border-white/75 bg-white/70 px-5 py-4 shadow-[0_10px_26px_rgba(143,71,43,0.05)] transition-colors open:bg-white/82"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                        <p className="text-base font-medium leading-7 text-foreground">{item.question}</p>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-secondary/20 bg-secondary/10 text-secondary-foreground transition-transform duration-200 group-open:rotate-180">
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </summary>
                      <p className="mt-3 pr-12 text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="pricing" className="page-wrap scroll-mt-28 border-t border-white/55 py-10 sm:py-14 lg:py-18">
          <PricingPlans
            title="Start simply, then grow into richer media, more family access, and a deeper archive."
            description="Start free with one meaningful vault, then upgrade when you want more storage, richer media, and family access."
            familyCheckoutEnabled={familyCheckoutEnabled}
            priceOverrides={priceOverrides}
          />
        </section>

        <section className="page-wrap pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(143,71,43,1),rgba(184,92,56,0.96),rgba(201,126,103,0.9))] text-white shadow-[0_28px_72px_rgba(143,71,43,0.25)]">
            <CardContent className="grid gap-6 p-8 sm:p-10 xl:grid-cols-[1fr_auto] xl:items-center xl:p-12">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">Start preserving now</p>
                <h2 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">
                  Start building the family archive they will one day open, hear, and feel.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                  Create your first private vault in minutes and start preserving what matters now.
                </p>
              </div>
              <Button asChild size="lg" variant="secondary">
                <Link href="/signup">
                  <Sparkles className="h-4 w-4" />
                  Start free
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

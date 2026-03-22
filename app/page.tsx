import Image from "next/image";
import Link from "next/link";
import {
  CalendarClock,
  HeartHandshake,
  ImageIcon,
  LockKeyhole,
  Mic,
  ShieldCheck,
  Sparkles,
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

const coreHighlights = [
  {
    title: "Save private memories",
    body: "Keep letters, photos, voice notes, and video in one calm family archive.",
    icon: LockKeyhole,
  },
  {
    title: "Choose the future moment",
    body: "Tie each memory to a date, age, or milestone so it arrives at the right time.",
    icon: CalendarClock,
  },
  {
    title: "Let it land with meaning",
    body: "A future unlock feels intentional, personal, and emotionally on time.",
    icon: Sparkles,
  },
];

const mediaTypes = [
  {
    label: "Letters",
    detail: "For reassurance, guidance, promises, and future birthdays.",
    icon: HeartHandshake,
  },
  {
    label: "Voice notes",
    detail: "So a future child or family member can hear the real voice again.",
    icon: Mic,
  },
  {
    label: "Photos + video",
    detail: "Keep the room, faces, movement, and season of life intact.",
    icon: ImageIcon,
  },
];

const journeySteps = [
  {
    step: "01",
    title: "Capture it now",
    body: "Save the story while it is still warm, clear, and true.",
  },
  {
    step: "02",
    title: "Set the unlock moment",
    body: "Pick a date, age, or milestone that gives it meaning.",
  },
  {
    step: "03",
    title: "Let the future open it",
    body: "When it arrives later, it feels chosen instead of forgotten.",
  },
];

const useCases = [
  {
    eyebrow: "For children",
    title: "Birthday messages, life advice, and years they have not reached yet.",
  },
  {
    eyebrow: "For family history",
    title: "Stories, voices, and memories that should not disappear with time.",
  },
  {
    eyebrow: "For future you",
    title: "Promises, hopes, and honest messages for a later version of yourself.",
  },
];

const milestoneMoments = [
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
    title: "Private by default",
    body: "Built for personal memory-keeping, not public sharing.",
  },
  {
    icon: Video,
    title: "Rich media ready",
    body: "Photos, voice, and video live alongside written memories.",
  },
  {
    icon: Users,
    title: "Family access controls",
    body: "Invite the right people and decide how they can help care for the archive.",
  },
  {
    icon: HeartHandshake,
    title: "Made for emotional moments",
    body: "The whole product is built around timing, trust, and human meaning.",
  },
];

export default function HomePage() {
  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <LandingHero />

        <section className="page-wrap border-t border-white/55 py-10 sm:py-14 lg:py-18">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="section-stack max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">What Vault Story does</p>
              <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                A private vault for memories that should arrive later, not get lost now.
              </h2>
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                Record something meaningful today, protect it, and choose when the future should receive it.
              </p>
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button asChild>
                  <Link href="/signup">Start free</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/#pricing">View pricing</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {coreHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="glass-panel overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,252,247,0.97),rgba(243,236,227,0.84))] shadow-[0_18px_48px_rgba(30,42,68,0.08)]">
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
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="section-stack max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">How it works</p>
              <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                Three simple actions: save it, time it, and let it mean more later.
              </h2>
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                Vault Story turns ordinary media into a future experience by connecting the memory to the moment it belongs to.
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
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
            <div className="section-stack max-w-3xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">What people keep inside</p>
              <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                Milestones are where ordinary photos become the memories families return to forever.
              </h2>
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                Birthdays, first days, last days, and family seasons are exactly the moments people do not want to leave to chance.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                {mediaTypes.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.label} className="overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(243,236,227,0.82))] shadow-[0_18px_48px_rgba(30,42,68,0.07)]">
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
                <Card key={item.label} className="overflow-hidden border-white/15 bg-[linear-gradient(180deg,rgba(30,42,68,0.98),rgba(49,63,95,0.94))] text-white shadow-[0_24px_60px_rgba(30,42,68,0.18)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    {item.masks.map((mask, index) => (
                      <div
                        key={`${item.label}-mask-${index}`}
                        className="absolute border border-white/12 bg-[rgba(18,28,47,0.52)] backdrop-blur-md"
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
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,24,39,0.04),rgba(17,24,39,0.72))]" />
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
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="section-stack max-w-3xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Real-life examples</p>
              <h2 className="text-balance font-display text-4xl sm:text-5xl">
                Built for the messages and milestones people want their family to feel, not just store.
              </h2>
            </div>

            <Card className="overflow-hidden border-white/15 bg-[linear-gradient(180deg,rgba(30,42,68,0.98),rgba(49,63,95,0.94))] text-white shadow-[0_28px_72px_rgba(30,42,68,0.22)]">
              <CardContent className="p-6 sm:p-7">
                <Badge className="bg-secondary/90 text-secondary-foreground">Examples people keep</Badge>
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

        <section id="pricing" className="page-wrap scroll-mt-28 border-t border-white/55 py-10 sm:py-14 lg:py-18">
          <PricingPlans
            title="Start simply, then grow into richer media, more family access, and a deeper archive."
            description="Start free with one meaningful vault, then upgrade when you want more media, milestone timing, and shared family access."
          />
        </section>

        <section className="page-wrap pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(30,42,68,1),rgba(49,63,95,0.96))] text-white shadow-[0_28px_72px_rgba(30,42,68,0.25)]">
            <CardContent className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">Start preserving now</p>
                <h2 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">
                  Start the vault your future family will be able to open, hear, and feel.
                </h2>
              </div>
              <Button asChild size="lg" variant="secondary">
                <Link href="/signup">
                  <Sparkles className="h-4 w-4" />
                  Create Your First Vault
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




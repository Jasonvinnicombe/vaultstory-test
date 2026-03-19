import Link from "next/link";
import { BellRing, CalendarClock, HeartHandshake, LockKeyhole, ShieldCheck, Sparkles, Users, Video, WandSparkles } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LandingHero } from "@/components/marketing/landing-hero";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const timelinePreview = [
  { age: "Age 2", title: "First Steps Video", unlock: "Locked until age 18" },
  { age: "Age 5", title: "Kindergarten Letter", unlock: "Locked until age 16" },
  { age: "Age 8", title: "Birthday Message", unlock: "Locked until age 21" },
];

const scenarios = [
  {
    eyebrow: "Messages for children",
    title: "Messages for Your Children",
    description: "Parents can record messages their children will open years later.",
    examples: ["Open when you turn 18", "Open on your wedding day", "Open when you become a parent"],
    closing: "A message recorded when a child is two years old can be opened decades later.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
    alt: "A parent recording a message while holding their child close",
    reverse: false,
    dark: false,
  },
  {
    eyebrow: "Family history",
    title: "Preserve Family Stories Before They're Lost",
    description: "Many families lose stories when relatives develop dementia or pass away.",
    examples: ["How I met your grandmother", "What my childhood was like", "Advice for my grandchildren", "The hardest challenge I overcame"],
    closing: "Vault Story allows grandparents and parents to record their life stories so future generations can hear them.",
    image: "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&w=1200&q=80",
    alt: "An elderly person sharing stories with family in warm light",
    reverse: true,
    dark: false,
  },
  {
    eyebrow: "Future self",
    title: "Talk to Your Future Self",
    description: "Capture what you believe, fear, hope, and promise right now before time changes your perspective.",
    examples: ["Open after ten years", "Open after a hard season", "Open after your next big leap"],
    closing: "A note from your earlier self can become clarity, comfort, or courage when you need it most.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    alt: "A person recording a thoughtful message for their future self",
    reverse: false,
    dark: false,
  },
  {
    eyebrow: "Milestones",
    title: "Save Memories for Important Milestones",
    description: "Some moments deserve memories waiting for them.",
    examples: ["Open on our 10th anniversary", "Open on graduation", "Open when you move out", "Open when you have your first child"],
    closing: "Memories arrive exactly when they matter most, turning milestones into deeply personal reveal moments instead of forgotten files.",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    alt: "A family sharing an emotional milestone moment in warm light",
    reverse: true,
    dark: true,
  },
  {
    eyebrow: "For generations",
    title: "Build a Family Memory Archive",
    description: "Families can create a shared vault of stories, photos, and videos.",
    examples: ["Annual family recaps", "Grandparents' stories", "Shared photo collections", "Milestone videos to revisit together"],
    closing: "Over time it becomes a digital family history archive that children and grandchildren can explore years later.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1400&q=80",
    alt: "Multiple generations of a family looking through photos together",
    reverse: false,
    dark: false,
  },
];

const trustPoints = [
  {
    icon: LockKeyhole,
    title: "Private vaults",
    body: "Keep memories in private vaults instead of public feeds and timelines, so intimate moments stay protected from performance and noise.",
  },
  {
    icon: ShieldCheck,
    title: "Secure storage",
    body: "Store letters, photos, audio, and video with production-minded infrastructure designed for personal content that should feel safe to keep for years.",
  },
  {
    icon: Video,
    title: "Rich media memories",
    body: "Preserve photos, voice notes, and video alongside written letters so a future unlock can feel vivid, human, and emotionally complete.",
  },
  {
    icon: Users,
    title: "Family-only access",
    body: "Choose exactly who can view, edit, or help care for a vault, whether it is just you, a partner, or a wider family circle.",
  },
  {
    icon: CalendarClock,
    title: "Timed future delivery",
    body: "Let memories arrive on the dates, ages, milestones, and future chapters where they will feel most meaningful instead of getting buried today.",
  },
  {
    icon: BellRing,
    title: "Moments worth waiting for",
    body: "Turn future unlocks into something anticipated, so birthdays, anniversaries, graduations, and life changes carry more emotional weight.",
  },
];

const benefitPoints = [
  {
    icon: HeartHandshake,
    title: "More than storage",
    body: "Vault Story helps families say what matters while they still can, so stories and reassurance are not left unsaid.",
  },
  {
    icon: WandSparkles,
    title: "A better emotional experience",
    body: "Unlocking a memory later feels cinematic and intimate, giving ordinary files the shape of a meaningful moment.",
  },
  {
    icon: Sparkles,
    title: "A living family archive",
    body: "Over time, separate letters, clips, and photos become a connected history that children and grandchildren can revisit with context.",
  },
];

export default function HomePage() {
  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <LandingHero />

        <section id="how-it-works" className="page-wrap section-space soft-divider">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="section-stack max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">What a vault looks like</p>
              <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                A private timeline of memories waiting for the right chapter of life.
              </h2>
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                Each vault becomes a living timeline of letters, stories, voice notes, and videos. Some can be opened now. Others stay locked until the exact moment they are meant to arrive.
              </p>
            </div>

            <Card className="overflow-hidden border-white/15 bg-[linear-gradient(180deg,rgba(30,42,68,0.98),rgba(49,63,95,0.94))] text-white shadow-[0_30px_90px_rgba(30,42,68,0.24)]">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-white/55">Vault preview</p>
                    <h3 className="mt-2 font-display text-3xl text-white sm:text-4xl">Emma's Life Vault</h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/70">
                    <CalendarClock className="h-4 w-4 text-secondary" />
                    Timed future unlocks
                  </div>
                </div>

                <div className="relative mt-8 space-y-5 before:absolute before:bottom-4 before:left-[1.05rem] before:top-4 before:w-px before:bg-white/10 sm:before:left-[1.15rem]">
                  {timelinePreview.map((item) => (
                    <div key={item.title} className="relative grid gap-4 rounded-[28px] border border-white/10 bg-white/8 p-5 pl-12 sm:grid-cols-[120px_1fr_auto] sm:items-center sm:pl-14">
                      <span className="absolute left-4 top-6 h-3.5 w-3.5 rounded-full border border-secondary/40 bg-secondary" />
                      <p className="text-sm uppercase tracking-[0.18em] text-white/55">{item.age}</p>
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="mt-1 text-sm leading-7 text-white/68">{item.unlock}</p>
                      </div>
                      <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
                        Locked
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="use-cases" className="page-wrap section-space soft-divider">
          <div className="overflow-hidden rounded-[40px] border border-white/55 bg-[linear-gradient(180deg,rgba(244,237,229,0.95),rgba(239,229,218,0.72))] shadow-[0_22px_60px_rgba(30,42,68,0.06)]">
            <div className="px-7 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
              <div className="max-w-4xl section-stack">
                <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Why people use Vault Story</p>
                <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  Memories that matter, saved for the moments that matter most.
                </h2>
                <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  People use Vault Story to capture meaningful stories, preserve family history, and deliver memories at the moments that matter most.
                </p>
              </div>

              <div className="mt-10 space-y-8 lg:mt-14 lg:space-y-10">
                {scenarios.map((scenario) => (
                  <div key={scenario.title} className={`grid gap-6 lg:items-center ${scenario.reverse ? "lg:grid-cols-[0.98fr_1.02fr]" : "lg:grid-cols-[1.02fr_0.98fr]"}`}>
                    {!scenario.reverse ? (
                      <div className="overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,rgba(230,184,106,0.18),rgba(230,184,106,0.06))] p-3 shadow-[0_24px_60px_rgba(30,42,68,0.10)]">
                        <div className="overflow-hidden rounded-[28px]">
                          <img src={scenario.image} alt={scenario.alt} className="h-full min-h-[320px] w-full object-cover sm:min-h-[420px]" />
                        </div>
                      </div>
                    ) : null}

                    <div className={scenario.dark ? "rounded-[34px] border border-white/60 bg-[linear-gradient(180deg,rgba(30,42,68,0.98),rgba(43,56,85,0.94))] p-7 text-white shadow-[0_24px_64px_rgba(30,42,68,0.18)] sm:p-9 lg:p-10" : "rounded-[34px] border border-white/60 bg-background/72 p-7 shadow-[0_18px_48px_rgba(30,42,68,0.07)] backdrop-blur-sm sm:p-9 lg:p-10"}>
                      <div className="section-stack">
                        <p className={scenario.dark ? "text-sm uppercase tracking-[0.22em] text-white/62" : "text-sm uppercase tracking-[0.22em] text-muted-foreground"}>{scenario.eyebrow}</p>
                        <h3 className={scenario.dark ? "text-balance font-display text-3xl leading-tight text-white sm:text-4xl" : "text-balance font-display text-3xl leading-tight text-foreground sm:text-4xl"}>{scenario.title}</h3>
                        <p className={scenario.dark ? "text-base leading-8 text-white/82 sm:text-lg" : "text-base leading-8 text-muted-foreground sm:text-lg"}>{scenario.description}</p>
                      </div>

                      <div className={scenario.dark ? "mt-8 rounded-[28px] border border-white/10 bg-white/10 p-6 backdrop-blur-sm sm:p-7" : "mt-8 rounded-[28px] bg-secondary/18 p-6 sm:p-7"}>
                        <p className={scenario.dark ? "text-sm uppercase tracking-[0.22em] text-white/58" : "text-sm uppercase tracking-[0.22em] text-muted-foreground"}>Example entries</p>
                        <div className={scenario.dark ? "mt-4 space-y-3 font-display text-2xl leading-tight text-white sm:text-[2rem]" : "mt-4 space-y-3 font-display text-2xl leading-tight text-foreground sm:text-[2rem]"}>
                          {scenario.examples.map((example) => <p key={example}>{example}</p>)}
                        </div>
                      </div>

                      <p className={scenario.dark ? "mt-8 text-sm leading-7 text-white/80 sm:text-base sm:leading-8" : "mt-8 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8"}>{scenario.closing}</p>
                    </div>

                    {scenario.reverse ? (
                      <div className="overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,rgba(230,184,106,0.18),rgba(230,184,106,0.06))] p-3 shadow-[0_24px_60px_rgba(30,42,68,0.10)]">
                        <div className="overflow-hidden rounded-[28px]">
                          <img src={scenario.image} alt={scenario.alt} className="h-full min-h-[320px] w-full object-cover sm:min-h-[420px]" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ))}

                <div className="overflow-hidden rounded-[36px] border border-white/50 bg-[linear-gradient(180deg,rgba(250,245,239,0.96),rgba(238,226,214,0.7))] px-6 py-12 text-center shadow-[0_18px_48px_rgba(30,42,68,0.05)] sm:px-10 sm:py-16 lg:px-16 lg:py-20">
                  <p className="mx-auto max-w-4xl text-balance font-display text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">
                    Vault Story is where your past self, your present self, and your future family can talk to each other.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-wrap section-space soft-divider">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <Card className="overflow-hidden border-white/15 bg-[linear-gradient(180deg,rgba(30,42,68,0.98),rgba(49,63,95,0.94))] text-white shadow-[0_28px_72px_rgba(30,42,68,0.24)]">
              <CardContent className="p-7 sm:p-8 lg:p-10">
                <p className="text-sm uppercase tracking-[0.22em] text-white/58">The reveal moment</p>
                <h2 className="mt-4 text-balance font-display text-4xl leading-tight text-white sm:text-5xl">
                  The memory does not just get stored. It comes back with timing, context, and feeling.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                  Imagine hearing a message from your parent recorded when you were two years old, or reading a letter you wrote to yourself ten years earlier. That is the moment Vault Story is built for.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[28px] border border-white/10 bg-white/8 p-5">
                    <p className="text-sm uppercase tracking-[0.18em] text-white/52">What arrives</p>
                    <p className="mt-3 font-display text-2xl leading-tight text-white">A voice, a face, a promise, a season of life you thought was gone.</p>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-white/8 p-5">
                    <p className="text-sm uppercase tracking-[0.18em] text-white/52">What it feels like</p>
                    <p className="mt-3 font-display text-2xl leading-tight text-white">Less like opening a file and more like being met by someone who knew you then.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(243,236,227,0.78))] shadow-[0_20px_52px_rgba(30,42,68,0.08)]">
                <CardContent className="p-7 sm:p-8">
                  <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">A future unlock</p>
                  <blockquote className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                    "It felt like being hugged by a version of my family that had been waiting for me."
                  </blockquote>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                    This is the emotional handoff between the story you save today and the person who receives it later. It is the bridge between memory and meaning.
                  </p>
                </CardContent>
              </Card>

              <div className="overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,rgba(230,184,106,0.18),rgba(230,184,106,0.06))] p-3 shadow-[0_18px_48px_rgba(30,42,68,0.07)]">
                <div className="overflow-hidden rounded-[24px]">
                  <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80" alt="A family watching a meaningful memory together" className="h-full min-h-[280px] w-full object-cover sm:min-h-[340px]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="page-wrap section-space soft-divider">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="section-stack max-w-3xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Features and benefits</p>
              <h2 className="text-balance font-display text-4xl sm:text-5xl">
                Built so the memories feel intimate, protected, and genuinely worth preserving.
              </h2>
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                Vault Story is designed for private emotional content, but the real benefit goes beyond storage. It gives families a calm place to capture stories, hold onto media that matters, and let memories arrive when they can be felt most deeply.
              </p>
            </div>

            <Card className="overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(255,252,247,0.92),rgba(243,236,227,0.78))] shadow-[0_20px_52px_rgba(30,42,68,0.08)]">
              <CardContent className="p-7 sm:p-8">
                <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">What families gain</p>
                <div className="mt-5 space-y-5">
                  {benefitPoints.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-start gap-4 rounded-[26px] bg-white/60 p-4 backdrop-blur-sm">
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/88 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trustPoints.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="glass-panel">
                  <CardContent className="p-7 sm:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/90 text-secondary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-2xl">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

                <section id="pricing" className="page-wrap section-space soft-divider">
          <PricingPlans
            title="Start free, then grow into richer family storytelling."
            description="Choose the membership that fits your archive today. Upgrade when you want more vaults, richer media, milestone unlocks, and family collaboration."
          />
        </section>

        <section className="page-wrap pb-24 lg:pb-32">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(30,42,68,1),rgba(49,63,95,0.96))] text-white shadow-[0_28px_72px_rgba(30,42,68,0.25)]">
            <CardContent className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">Start preserving now</p>
                <h2 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">
                  Start preserving your most important moments today.
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


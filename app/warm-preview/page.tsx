import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    title: "Save private memories",
    body: "Keep letters, photos, voice notes, and video in one warm family archive.",
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
];

const milestoneMoments = [
  {
    label: "First Christmas",
    title: "Save the little season while it still feels magical.",
    src: "/images/milestones/first-christmas.jpg",
    alt: "A young child sitting with a parent beside a decorated Christmas tree.",
  },
  {
    label: "First day of school",
    title: "Let the future reopen the day a whole new chapter began.",
    src: "/images/milestones/first-day-of-school.jpeg",
    alt: "A child smiling on the first day of school in uniform in front of a sign.",
  },
];

export default function WarmPreviewPage() {
  return (
    <div className="min-h-screen bg-[#f7ede3] text-[#4a3429]">
      <div
        className="min-h-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(216,161,91,0.18), transparent 20%), radial-gradient(circle at 86% 12%, rgba(201,126,103,0.16), transparent 18%), linear-gradient(180deg, #fbf6f0 0%, #f2e5d8 100%)",
        }}
      >
        <header className="sticky top-0 z-40 border-b border-[#e2cdbb]/80 bg-[#fbf4ec]/85 backdrop-blur-xl">
          <div className="page-wrap flex items-center justify-between gap-4 py-4">
            <Link href="/warm-preview" className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-[linear-gradient(180deg,#b85c38,#cf8663)] text-white shadow-[0_14px_30px_rgba(143,71,43,0.22)]">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-2xl leading-none tracking-[-0.03em] text-[#5a3526]">Vault Story</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#956b56]">Warm brand preview</p>
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 text-sm text-[#7b665a] lg:flex">
              <a href="#preview" className="transition-colors hover:text-[#4a3429]">Preview</a>
              <a href="#palette" className="transition-colors hover:text-[#4a3429]">Palette</a>
              <a href="#pricing" className="transition-colors hover:text-[#4a3429]">Pricing</a>
            </nav>

            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" className="hidden sm:inline-flex hover:bg-[#d8a15b]/15 hover:text-[#4a3429]">
                <Link href="/">Back to current site</Link>
              </Button>
              <Button asChild className="bg-[#b85c38] text-white shadow-[0_18px_36px_rgba(143,71,43,0.2)] hover:bg-[#a75130] hover:shadow-[0_20px_40px_rgba(143,71,43,0.24)]">
                <Link href="/signup">
                  <Sparkles className="h-4 w-4" />
                  Create account
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main id="preview">
          <section className="page-wrap relative overflow-hidden pb-18 pt-10 sm:pt-14 lg:pb-24 lg:pt-18">
            <div className="absolute left-[-5rem] top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(216,161,91,0.30),rgba(216,161,91,0.08)_55%,transparent_74%)] blur-xl" />
            <div className="absolute right-[-6rem] top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(201,126,103,0.28),rgba(201,126,103,0.08)_54%,transparent_76%)] blur-xl" />

            <div className="relative grid items-start gap-10 lg:grid-cols-[1fr_0.94fr] lg:gap-14">
              <div className="space-y-6">
                <Badge className="w-fit border-transparent bg-[#d8a15b]/30 text-[#8f472b]">Warm brand concept</Badge>
                <div className="space-y-5">
                  <h1 className="max-w-4xl font-display text-5xl leading-[0.96] tracking-[-0.04em] text-[#4a3429] sm:text-6xl lg:text-[5.7rem]">
                    Preserve what matters. Let it arrive with warmth.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-[#7b665a] sm:text-xl sm:leading-9">
                    This preview shows Vault Story reimagined with burnt orange, clay, ochre, and parchment tones so the
                    product feels more intimate, heirloom-like, and emotionally inviting.
                  </p>
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
                  <Button asChild size="lg" className="bg-[#b85c38] text-white shadow-[0_18px_38px_rgba(143,71,43,0.22)] hover:bg-[#a75130]">
                    <Link href="/signup">
                      Start free trial
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-[#ddc9b7] bg-[#fff7ef]/85 text-[#5a3526] shadow-[0_12px_28px_rgba(143,71,43,0.08)] hover:bg-[#fff3e7]">
                    <Link href="#palette">See warm palette</Link>
                  </Button>
                </div>
              </div>

              <Card className="overflow-hidden border-[#c88b72]/35 bg-[linear-gradient(180deg,rgba(143,71,43,0.98),rgba(184,92,56,0.96)_58%,rgba(207,134,99,0.92))] text-white shadow-[0_34px_90px_rgba(143,71,43,0.24)]">
                <CardContent className="p-4 sm:p-5">
                  <div className="overflow-hidden rounded-[30px] border border-white/12 bg-[rgba(70,36,22,0.22)]">
                    <div className="relative h-[480px] sm:h-[560px]">
                      <Image
                        src="/images/milestones/one-year-old.jpg"
                        alt="A family memory used for the warm branding preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,35,24,0.1),rgba(66,35,24,0.38)_34%,rgba(66,35,24,0.84))]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,161,91,0.20),transparent_24%)]" />

                      <div className="absolute left-4 top-6 inline-flex items-center gap-2 rounded-full border border-white/14 bg-[rgba(88,45,28,0.44)] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/76 backdrop-blur-sm sm:left-6 sm:top-8">
                        <Sparkles className="h-3.5 w-3.5 text-[#f1c47f]" />
                        Warm concept
                      </div>

                      <div className="absolute inset-x-0 top-0 p-4 pt-20 sm:p-6 sm:pt-28 lg:p-8 lg:pt-32">
                        <div className="max-w-3xl">
                          <p className="text-[11px] uppercase tracking-[0.28em] text-white/58 sm:text-xs">Preserved from the past</p>
                          <h2 className="mt-3 max-w-[11ch] font-display text-4xl leading-[0.94] text-white sm:mt-4 sm:text-[3.6rem] lg:text-[4.2rem]">
                            Keep the feeling, not just the file.
                          </h2>
                          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82 sm:text-base sm:leading-8 lg:text-lg">
                            The warmer palette pushes the product toward memory, family, and keepsake energy rather than a colder platform feel.
                          </p>

                          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[rgba(88,45,28,0.44)] px-4 py-2 text-sm text-white/84 backdrop-blur-sm">
                              <CalendarClock className="h-4 w-4 text-[#f1c47f]" />
                              Next opening: June 12, 2036
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[rgba(88,45,28,0.44)] px-4 py-2 text-sm text-white/84 backdrop-blur-sm">
                              <HeartHandshake className="h-4 w-4 text-[#f1c47f]" />
                              Saved now, felt later
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="page-wrap border-t border-[#eadbcc] py-10 sm:py-14 lg:py-18">
            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="overflow-hidden border-[#dfc7b3] bg-[linear-gradient(180deg,rgba(255,250,244,0.97),rgba(245,234,222,0.92))] shadow-[0_18px_48px_rgba(143,71,43,0.08)]">
                    <CardContent className="p-6 sm:p-7">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d8a15b]/22 text-[#8f472b] ring-1 ring-[#d8a15b]/30">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 font-display text-2xl leading-tight text-[#4a3429]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#7b665a] sm:text-base">{item.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="page-wrap border-t border-[#eadbcc] py-10 sm:py-14 lg:py-18">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
              <div className="space-y-5">
                <p className="text-sm uppercase tracking-[0.22em] text-[#956b56]">Warm direction in practice</p>
                <h2 className="font-display text-4xl leading-tight text-[#4a3429] sm:text-5xl">
                  The site becomes more personal, less corporate, and more rooted in memory.
                </h2>
                <p className="text-base leading-8 text-[#7b665a] sm:text-lg">
                  Burnt orange leads the hierarchy, clay and ochre build softness, and cocoa text keeps the experience premium
                  without drifting back to a cool blue system.
                </p>

                <div className="grid gap-3 pt-2">
                  {mediaTypes.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Card key={item.label} className="border-[#dfc7b3] bg-[#fff8f1]/90 shadow-[0_14px_32px_rgba(143,71,43,0.06)]">
                        <CardContent className="flex gap-4 p-5 sm:p-6">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c97e67] font-semibold text-white">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h3 className="font-display text-2xl leading-tight text-[#4a3429]">{item.label}</h3>
                            <p className="mt-2 text-sm leading-7 text-[#7b665a] sm:text-base">{item.detail}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {milestoneMoments.map((item) => (
                  <Card key={item.label} className="overflow-hidden border-[#c88b72]/35 bg-[linear-gradient(180deg,rgba(116,60,35,0.98),rgba(173,89,54,0.94))] text-white shadow-[0_24px_60px_rgba(143,71,43,0.18)]">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
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

          <section id="palette" className="page-wrap border-t border-[#eadbcc] py-10 sm:py-14 lg:py-18">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm uppercase tracking-[0.22em] text-[#956b56]">Warm palette</p>
              <h2 className="font-display text-4xl text-[#4a3429] sm:text-5xl">A burnt orange-led scheme with grounded complementary tones.</h2>
              <p className="text-base leading-8 text-[#7b665a] sm:text-lg">
                These are the tones from the warm branding concept, translated into something you can imagine across the live product.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["Burnt Orange", "#B85C38", "Primary actions, brand moments, key emphasis"],
                ["Clay Rose", "#C97E67", "Supporting surfaces and warm depth"],
                ["Golden Ochre", "#D8A15B", "Highlights, badges, and glows"],
                ["Sage Olive", "#7C8A62", "Complementary balance and quiet contrast"],
                ["Cocoa", "#4A3429", "Headings, deep text, and premium structure"],
                ["Parchment", "#F6EEE5", "Base backgrounds and calm whitespace"],
              ].map(([name, color, usage]) => (
                <Card key={name} className="border-[#dfc7b3] bg-[#fff8f1]/92 shadow-[0_14px_36px_rgba(143,71,43,0.05)]">
                  <CardContent className="p-6 sm:p-7">
                    <div className="rounded-[22px] border border-[#eadbcc] p-4" style={{ backgroundColor: color }}>
                      <p className={`text-sm font-semibold ${color === "#F6EEE5" || color === "#D8A15B" || color === "#7C8A62" ? "text-[#3f2c24]" : "text-white"}`}>{color}</p>
                    </div>
                    <h3 className="mt-5 font-display text-2xl text-[#4a3429]">{name}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#7b665a]">{usage}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="page-wrap border-t border-[#eadbcc] py-10 sm:py-14 lg:py-18">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm uppercase tracking-[0.22em] text-[#956b56]">Trust moments</p>
              <h2 className="font-display text-4xl text-[#4a3429] sm:text-5xl">Core reassurance still works in the warmer palette.</h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {trustPoints.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="border-[#dfc7b3] bg-[#fff8f1]/92 shadow-[0_18px_42px_rgba(143,71,43,0.05)]">
                    <CardContent className="p-6 sm:p-7">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#7c8a62]/18 text-[#6b7754] ring-1 ring-[#7c8a62]/24">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display text-2xl text-[#4a3429]">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#7b665a]">{item.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section id="pricing" className="page-wrap border-t border-[#eadbcc] py-10 sm:py-14 lg:py-18">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm uppercase tracking-[0.22em] text-[#956b56]">Pricing preview</p>
              <h2 className="font-display text-4xl text-[#4a3429] sm:text-5xl">Key pricing moments also shift naturally into the warmer system.</h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <Card className="border-[#dfc7b3] bg-[#fff8f1]/92 shadow-[0_20px_56px_rgba(143,71,43,0.06)]">
                <CardContent className="p-6">
                  <h3 className="font-display text-2xl text-[#4a3429]">Free</h3>
                  <p className="mt-2 text-[#7b665a]">A simple entry point for one meaningful vault.</p>
                  <p className="mt-6 font-display text-4xl text-[#4a3429]">$0</p>
                  <Button className="mt-6 w-full border-[#ddc9b7] bg-[#fff3e7] text-[#5a3526] hover:bg-[#fce9d7]">Start free</Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-[#b85c38]/30 bg-[linear-gradient(180deg,rgba(143,71,43,0.98),rgba(184,92,56,0.94))] text-white shadow-[0_26px_72px_rgba(143,71,43,0.2)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl text-white">Premium</h3>
                    <Badge className="bg-[#d8a15b] text-[#4a3429]">Most loved</Badge>
                  </div>
                  <p className="mt-2 text-white/78">Richer media, more storage, and more meaningful unlocks.</p>
                  <p className="mt-6 font-display text-4xl text-white">$19</p>
                  <Button className="mt-6 w-full bg-[#f6eee5] text-[#8f472b] hover:bg-[#fff8f1]">Choose premium</Button>
                </CardContent>
              </Card>

              <Card className="border-[#dfc7b3] bg-[#fff8f1]/92 shadow-[0_20px_56px_rgba(143,71,43,0.06)]">
                <CardContent className="p-6">
                  <h3 className="font-display text-2xl text-[#4a3429]">Family</h3>
                  <p className="mt-2 text-[#7b665a]">More collaboration and a deeper family archive.</p>
                  <p className="mt-6 font-display text-4xl text-[#4a3429]">$39</p>
                  <Button className="mt-6 w-full bg-[#c97e67] text-white hover:bg-[#b86f58]">Choose family</Button>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="page-wrap pb-16 pt-10 sm:pb-20 sm:pt-12 lg:pb-24 lg:pt-14">
            <Card className="overflow-hidden border-[#c88b72]/35 bg-[linear-gradient(135deg,rgba(143,71,43,1),rgba(184,92,56,0.96),rgba(201,126,103,0.92))] text-white shadow-[0_28px_72px_rgba(143,71,43,0.22)]">
              <CardContent className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-white/60">Warm concept outcome</p>
                  <h2 className="mt-4 font-display text-4xl leading-tight text-white sm:text-5xl">
                    The product still feels premium, but the emotional center gets stronger.
                  </h2>
                </div>
                <Button asChild size="lg" className="bg-[#f6eee5] text-[#8f472b] hover:bg-[#fff8f1]">
                  <Link href="/">
                    Compare with current site
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </main>

        <footer className="border-t border-[#e2cdbb]/80 bg-[#fbf4ec]/88 py-10 text-sm text-[#7b665a] sm:py-16">
          <div className="page-wrap flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="font-display text-3xl text-[#5a3526]">Vault Story</p>
              <p className="max-w-xl text-sm leading-7">
                Warm preview route for reviewing the burnt orange concept on a real page before deciding whether to re-theme the full site.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.16em]">
              <Link href="/" className="transition-colors hover:text-[#4a3429]">Current site</Link>
              <a href="#preview" className="transition-colors hover:text-[#4a3429]">Top</a>
              <a href="#palette" className="transition-colors hover:text-[#4a3429]">Palette</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

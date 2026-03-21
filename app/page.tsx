import Link from "next/link";
import {
  CalendarClock,
  HeartHandshake,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LandingHero, LandingProductPreview } from "@/components/marketing/landing-hero";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const narrativeMoments = [
  {
    eyebrow: "The moment",
    title: "You realize this should not be left to chance.",
    body:
      "A child is still small. A parent still remembers the story clearly. A promise still feels fresh. The value is not just in keeping the file, but in deciding that this moment deserves to survive.",
  },
  {
    eyebrow: "The decision",
    title: "You save it now so it can mean more later.",
    body:
      "Vault Story lets you turn something private and ordinary today into something unforgettable later by pairing the memory with the moment it belongs to.",
  },
  {
    eyebrow: "The arrival",
    title: "Years from now, it does not feel old. It feels like it arrived right on time.",
    body:
      "That is the difference between storage and a future vault. One keeps files. The other creates an experience of being met again by someone who cared enough to leave something behind.",
  },
];

const journeySteps = [
  {
    step: "01",
    title: "Capture it while it is still real",
    body: "Write the letter, save the voice note, upload the photo, or record the video while the memory still has warmth in it.",
  },
  {
    step: "02",
    title: "Tie it to the future moment that gives it meaning",
    body: "Choose a date, an age, or a milestone so the message arrives when life is ready for it.",
  },
  {
    step: "03",
    title: "Let time turn it into something unforgettable",
    body: "When it opens later, it lands with context, timing, and emotional weight instead of feeling like forgotten old media.",
  },
];

const useCases = [
  {
    eyebrow: "For your children",
    title: "Leave them love they can grow into.",
    body:
      "Save birthday letters, reassurance, life advice, and video messages now, then let them arrive in the years when they will be understood most deeply.",
  },
  {
    eyebrow: "For your family history",
    title: "Keep the voices and stories that disappear too easily.",
    body:
      "Grandparents, parents, and relatives can preserve the stories that would otherwise end up as fragments, half-remembered anecdotes, or missing chapters.",
  },
  {
    eyebrow: "For your future self",
    title: "Meet the person you used to be with honesty.",
    body:
      "Capture what you believed, feared, promised, or hoped for now, then hear it again when you have become someone new.",
  },
];
const exampleVaults = [
  {
    eyebrow: "A child's vault",
    title: "For the birthdays and milestones they have not reached yet.",
    body: "A parent records short videos every year, saves letters for age 18 and 21, and keeps the little stories that would otherwise disappear between school runs and ordinary days.",
  },
  {
    eyebrow: "A family archive",
    title: "For the stories only grandparents still know how to tell.",
    body: "Voice notes, old photos, and memories from earlier decades are kept together so children and grandchildren can one day hear family history in the voices it belongs to.",
  },
  {
    eyebrow: "A private promise",
    title: "For the words someone may need in a harder future season.",
    body: "A message of comfort, guidance, or reassurance can be written now and opened later when life changes, grief arrives, or a turning point finally comes.",
  },
];

const trustPoints = [
  {
    icon: LockKeyhole,
    title: "Private by default",
    body: "Memories live in protected vaults, not public feeds, making the whole experience feel calmer and more intentional.",
  },
  {
    icon: Video,
    title: "Made for rich memories",
    body: "Letters, photos, voice notes, and video can live together so a future unlock feels vivid instead of flat.",
  },
  {
    icon: CalendarClock,
    title: "Timing is part of the meaning",
    body: "Dates, ages, and milestones are not just settings here. They are what turn the memory into an arrival.",
  },
  {
    icon: Users,
    title: "Shared with care",
    body: "Invite the right family members while keeping control over who can view, edit, or help preserve the archive.",
  },
  {
    icon: HeartHandshake,
    title: "Built for emotional moments",
    body: "Everything from the flow to the language is designed to help the experience feel human, not transactional.",
  },
  {
    icon: ShieldCheck,
    title: "Strong enough for family history",
    body: "The archive is meant to hold stories that matter for years, not just whatever happens to still be on a phone.",
  },
];

export default function HomePage() {
  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <LandingHero />

        <section className="page-wrap section-space soft-divider">
          <div className="section-stack max-w-4xl">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Why this exists</p>
            <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              This is for the people, words, and memories you already know should not be left to chance.
            </h2>
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">
              People are not looking for another folder full of files. They are trying to keep hold of a voice, a story, a promise, or a season of life before it slips away, and make sure it can be felt again when it matters most.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {narrativeMoments.map((item) => (
              <Card key={item.title} className="overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(243,236,227,0.82))] shadow-[0_18px_48px_rgba(30,42,68,0.08)]">
                <CardContent className="p-7 sm:p-8">
                  <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">{item.eyebrow}</p>
                  <h3 className="mt-4 text-balance font-display text-3xl leading-tight text-foreground">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="page-wrap section-space soft-divider scroll-mt-28">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="section-stack max-w-2xl">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">How it works</p>
              <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                It works because it follows the emotional rhythm people already understand: keep it safe now, let it wait, and let it arrive when life is ready for it.
              </h2>
              <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                You do not need to learn a complicated system. You simply save something meaningful now, decide when it should be opened, and let time give the memory its weight.
              </p>
            </div>

            <div className="grid gap-4">
              {journeySteps.map((item) => (
                <Card key={item.step} className="glass-panel">
                  <CardContent className="flex gap-5 p-6 sm:p-7">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary/90 font-semibold text-secondary-foreground">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-display text-2xl leading-tight text-foreground">{item.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">{item.body}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <LandingProductPreview />
          </div>
        </section>

        <section className="page-wrap section-space soft-divider">
          <div className="section-stack max-w-4xl">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">What people actually keep inside</p>
            <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              A vault is not just a timeline. It is a place for specific memories people are afraid of losing.
            </h2>
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">
              The strongest examples are usually simple: a birthday video, a voice note from grandad, a letter for the future, a message for a hard day, or a family story that should still be heard years from now.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {exampleVaults.map((item) => (
              <Card key={item.title} className="overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(243,236,227,0.82))] shadow-[0_18px_48px_rgba(30,42,68,0.08)]">
                <CardContent className="p-7 sm:p-8">
                  <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">{item.eyebrow}</p>
                  <h3 className="mt-4 text-balance font-display text-3xl leading-tight text-foreground">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="use-cases" className="page-wrap section-space soft-divider scroll-mt-28">
          <div className="section-stack max-w-4xl">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Where it fits in real life</p>
            <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Different families use it in different ways, but the feeling they are trying to protect is always deeply personal.
            </h2>
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">
              Sometimes it is for children who will grow into the message later. Sometimes it is for family history that should not disappear. Sometimes it is for a future version of yourself who will need to hear who you were.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {useCases.map((story) => (
              <Card key={story.title} className="overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(243,236,227,0.8))] shadow-[0_18px_48px_rgba(30,42,68,0.07)]">
                <CardContent className="p-7 sm:p-8">
                  <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">{story.eyebrow}</p>
                  <h3 className="mt-4 text-balance font-display text-3xl leading-tight text-foreground">{story.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">{story.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="features" className="page-wrap section-space soft-divider scroll-mt-28">
          <div className="section-stack max-w-4xl">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Why it feels trustworthy</p>
            <h2 className="text-balance font-display text-4xl sm:text-5xl">
              Families only trust this with important memories if it feels private, steady, and respectful from the very first click.
            </h2>
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">
              Vault Story is designed to feel gentle and human on the surface, while still giving families the structure they need to protect something that cannot be replaced.
            </p>
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

        <section id="pricing" className="page-wrap section-space soft-divider scroll-mt-28">
          <PricingPlans
            title="Start simply, then grow into richer media, more family access, and a deeper archive as the story becomes more valuable."
            description="The pricing is designed to let people begin with one meaningful vault, then expand once the archive becomes something they truly want to keep building."
          />
        </section>

        <section className="page-wrap pb-24 lg:pb-32">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(30,42,68,1),rgba(49,63,95,0.96))] text-white shadow-[0_28px_72px_rgba(30,42,68,0.25)]">
            <CardContent className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">Start preserving now</p>
                <h2 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">
                  Start preserving the memories your future family will be able to open, hear, and feel again.
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




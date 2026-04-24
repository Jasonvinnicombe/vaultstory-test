"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  LayoutDashboard,
  ShieldCheck,
  LockKeyhole,
  Sparkles,
  Users,
  Vault,
  Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Vaults", icon: Vault },
  { label: "Upcoming", icon: CalendarClock },
];

const revealItems = [
  {
    title: "Video",
    detail: "Hear the room, the laughter, the little voice.",
    type: "Archive",
  },
  {
    title: "Letter",
    detail: "Keep the tone, handwriting, and feeling intact.",
    type: "Meaning",
  },
  {
    title: "Voice note",
    detail: "Let love return in the exact voice it was spoken in.",
    type: "Return",
  },
];

const trustSignals = [
  {
    icon: LockKeyhole,
    label: "Private vaults",
    detail: "Save personal memories in a space built for family, not public sharing.",
  },
  {
    icon: CalendarClock,
    label: "Timed unlocks",
    detail: "Choose a date, age, or milestone for when each memory should open.",
  },
  {
    icon: Users,
    label: "Family access",
    detail: "Invite the right people and control who helps care for the archive.",
  },
  {
    icon: ShieldCheck,
    label: "Built for trust",
    detail: "Designed around private moments, long-term memory keeping, and emotional care.",
  },
];

export function LandingHero() {
  return (
    <section className="page-wrap relative section-space overflow-hidden pb-18 pt-10 sm:pt-14 lg:pb-20 xl:pb-24 xl:pt-18">
      <div className="hero-orb absolute left-[-4rem] top-8 h-60 w-60 rounded-full opacity-75 sm:h-80 sm:w-80" />
      <div className="hero-orb absolute right-[-6rem] top-16 h-72 w-72 rounded-full opacity-55 sm:h-[24rem] sm:w-[24rem]" />

      <div className="relative space-y-8 lg:space-y-9 xl:space-y-10">
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.82fr)] md:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.88fr)] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] xl:gap-14">
          <motion.div initial="initial" animate="animate" transition={{ staggerChildren: 0.08 }} className="section-stack max-w-4xl pt-2 md:pt-6 lg:pt-8 xl:pt-0">
            <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
              <Badge className="w-fit bg-secondary/90">Private family time capsules</Badge>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: "easeOut" }} className="space-y-5 sm:space-y-6">
              <h1 className="max-w-4xl text-balance font-display text-5xl leading-[0.96] tracking-[-0.03em] text-foreground sm:text-6xl md:max-w-[9ch] md:text-[4.55rem] lg:max-w-[10ch] lg:text-[5rem] xl:max-w-4xl xl:text-[5.8rem]">
                A private family memory vault for future messages, voice notes, and video memories.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9 md:max-w-[29rem] md:text-[1.1rem] md:leading-8 lg:max-w-[34rem] xl:max-w-2xl xl:text-xl xl:leading-9">
                Vault Story is a digital time capsule for families who want to save future messages, family stories, letters, voice notes, photos, and video messages for children, loved ones, or their future self.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: "easeOut" }} className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup">
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/#how-it-works">See How It Works</Link>
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: "easeOut" }} className="grid gap-3 pt-1 sm:grid-cols-2 xl:grid-cols-4">
              {trustSignals.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-white/70 bg-white/72 px-4 py-4 shadow-[0_14px_34px_rgba(143,71,43,0.08)] backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/18 text-secondary-foreground ring-1 ring-secondary/20">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            className="relative mx-auto w-full max-w-[34rem] md:sticky md:top-28 md:mx-0 md:max-w-none"
          >
            <VaultTimelinePreview />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VaultTimelinePreview() {
  return (
    <Card className="overflow-hidden border-white/15 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_88%_14%,rgba(216,161,91,0.14),transparent_18%),linear-gradient(180deg,rgba(143,71,43,0.99),rgba(184,92,56,0.95),rgba(201,126,103,0.92))] text-white shadow-[0_32px_90px_rgba(143,71,43,0.24)]">
      <CardContent className="p-4 sm:p-5">
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(70,36,22,0.22)]">
          <div className="relative h-[700px] sm:h-[760px] md:h-[640px] lg:h-[600px] xl:h-[640px]">
            <Image
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1400&q=80"
              alt="A family memory preserved inside a vault"
              fill
              priority
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 42vw, 38vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,35,24,0.08),rgba(66,35,24,0.22)_28%,rgba(66,35,24,0.52)_62%,rgba(66,35,24,0.88))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,161,91,0.18),transparent_24%)]" />

            <div className="absolute left-4 top-5 inline-flex items-center gap-2 rounded-full border border-white/14 bg-[rgba(88,45,28,0.44)] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/76 backdrop-blur-sm sm:left-6 sm:top-8 sm:text-[11px] sm:tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              Vault preview
            </div>

            <div className="absolute inset-x-4 top-28 bottom-5 flex flex-col sm:inset-x-6 sm:top-36 sm:bottom-6 md:inset-x-5 md:top-[8rem] md:bottom-5 lg:inset-x-6 lg:top-[8.5rem] lg:bottom-6 xl:inset-x-8 xl:top-[9.5rem] xl:bottom-8">
              <div className="-translate-y-6 max-w-[21rem] sm:-translate-y-8 sm:max-w-[24rem] md:-translate-y-8 md:max-w-[25rem] lg:-translate-y-10 lg:max-w-[28rem] xl:-translate-y-10 xl:max-w-[30rem]">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/68 sm:text-xs sm:tracking-[0.28em]">
                  Preserved from the past
                </p>
                <h2 className="mt-2 text-balance font-display text-[2.15rem] leading-[0.9] tracking-[-0.03em] text-white sm:text-[2.8rem] md:text-[3.9rem] lg:text-[3.45rem] xl:text-[4.15rem]">
                  Create a private vault your family can feel later.
                </h2>
                <p className="mt-3 max-w-[19rem] text-[0.9rem] leading-6 text-white/82 sm:max-w-[22rem] sm:text-[1rem] sm:leading-7 md:max-w-[24rem] md:text-[0.98rem] md:leading-7 lg:max-w-[27rem] xl:max-w-[29rem] xl:text-[1.02rem] xl:leading-8">
                  Store memories with context, timing, and care so they arrive when they are meant to be opened, not when they get buried in camera roll noise.
                </p>
              </div>

              <div className="mt-auto flex flex-col gap-2 sm:gap-3">
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/14 bg-[rgba(88,45,28,0.48)] px-3 py-1.5 text-[0.82rem] text-white/88 backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                  <CalendarClock className="h-4 w-4 text-secondary" />
                  Next opening: June 12, 2036
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/14 bg-[rgba(88,45,28,0.48)] px-3 py-1.5 text-[0.82rem] text-white/88 backdrop-blur-sm sm:px-4 sm:py-2 sm:text-sm">
                  <LockKeyhole className="h-4 w-4 text-secondary" />
                  Date, age, or milestone unlock
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function LandingProductPreview() {
  return (
    <Card className="mx-auto w-full max-w-[42rem] overflow-hidden border-white/15 bg-[linear-gradient(180deg,rgba(143,71,43,0.98),rgba(184,92,56,0.94),rgba(201,126,103,0.9))] text-white shadow-[0_32px_90px_rgba(143,71,43,0.24)] xl:mx-0 xl:max-w-none">
      <CardContent className="p-4 sm:p-5">
        <div className="rounded-[30px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-3 sm:p-4">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-3 text-xs uppercase tracking-[0.22em] text-white/58 sm:flex-row sm:items-center sm:justify-between">
            <span>Vault Story Preview</span>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] tracking-[0.16em] text-white/72">
              <LockKeyhole className="h-3.5 w-3.5 text-secondary" />
              Private family archive
            </span>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[160px_1fr] xl:grid-cols-[180px_1fr]">
            <div className="rounded-[24px] border border-white/10 bg-[rgba(70,36,22,0.28)] p-4">
              <div className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/6 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground">
                  HV
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Hugo&apos;s vault</p>
                  <p className="text-xs text-white/60">Family timeline</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-[16px] border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white/78">
                      <Icon className="h-4 w-4 text-secondary" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(70,36,22,0.22)]">
                <div className="relative h-40 overflow-hidden border-b border-white/10 sm:h-48 lg:h-44 xl:h-48">
                  <Image
                    src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80"
                    alt="A family memory used as a vault cover"
                    fill
                    sizes="(max-width: 1023px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,35,24,0.08),rgba(66,35,24,0.75))]" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/64">Family vault</p>
                        <h2 className="mt-2 text-balance font-display text-3xl leading-tight text-white sm:text-[2rem] lg:text-[1.9rem] xl:text-[2rem]">
                          Hugo&apos;s Life In Action
                        </h2>
                        <p className="mt-2 max-w-[22rem] text-sm text-white/78">A private timeline of letters, videos, and voice notes saved for Hugo.</p>
                      </div>
                      <div className="hidden rounded-[18px] border border-white/12 bg-[rgba(255,255,255,0.08)] px-4 py-3 text-right lg:block">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/54">Next unlock</p>
                        <p className="mt-1 text-sm font-semibold text-white">June 12, 2036</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 p-4 text-sm text-white/84 sm:grid-cols-3 sm:p-5">
                  <div className="rounded-[18px] border border-white/10 bg-white/6 p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/54">Entries</p>
                    <p className="mt-2 text-lg font-semibold text-white">12 memories</p>
                  </div>
                  <div className="rounded-[18px] border border-white/10 bg-white/6 p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/54">Media</p>
                    <p className="mt-2 text-lg font-semibold text-white">Photos, voice, video</p>
                  </div>
                  <div className="rounded-[18px] border border-white/10 bg-white/6 p-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/54">Access</p>
                    <p className="mt-2 text-lg font-semibold text-white">Parents + family</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[rgba(70,36,22,0.22)] p-4 sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/54">Upcoming reveals</p>
                    <h3 className="mt-2 max-w-[26rem] text-xl font-semibold text-white">What the future timeline actually looks like</h3>
                  </div>
                  <div className="hidden rounded-full border border-white/12 bg-white/6 px-3 py-2 text-xs text-white/70 sm:inline-flex sm:items-center sm:gap-2">
                    <CalendarClock className="h-3.5 w-3.5 text-secondary" />
                    Timed future unlocks
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {revealItems.map((item) => (
                    <div key={item.title} className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/6 px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/92 text-secondary-foreground">
                        {item.title === "Video" ? <Video className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-xs text-white/62">{item.detail}</p>
                      </div>
                      <div className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/62">
                        Locked
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  LayoutDashboard,
  LockKeyhole,
  Sparkles,
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

const timelineItems = [
  {
    age: "Age 2",
    title: "First steps on the deck",
    detail: "The wobble, the laugh after, and both parents cheering behind the camera.",
  },
  {
    age: "Age 5",
    title: "A letter before school began",
    detail: "A note about who they were before the world started shaping them.",
  },
  {
    age: "Age 8",
    title: "Birthday wishes for later",
    detail: "A message waiting for the version of them that hasn't arrived yet.",
  },
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

export function LandingHero() {
  return (
    <section className="page-wrap relative section-space overflow-hidden pb-18 pt-10 sm:pt-14 lg:pb-24 lg:pt-18">
      <div className="hero-orb absolute left-[-4rem] top-8 h-60 w-60 rounded-full opacity-75 sm:h-80 sm:w-80" />
      <div className="hero-orb absolute right-[-6rem] top-16 h-72 w-72 rounded-full opacity-55 sm:h-[24rem] sm:w-[24rem]" />

      <div className="relative space-y-8 lg:space-y-10">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-14">
          <motion.div initial="initial" animate="animate" transition={{ staggerChildren: 0.08 }} className="section-stack">
            <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
              <Badge className="w-fit bg-secondary/90">Private family time capsules</Badge>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: "easeOut" }} className="space-y-5 sm:space-y-6">
              <h1 className="max-w-4xl text-balance font-display text-5xl leading-[0.96] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-[5.8rem]">
                Preserve what matters. Deliver it when it matters most.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
                Vault Story is a private vault for letters, photos, voice notes, and video messages that are meant to be opened at the right moment in the future.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: "easeOut" }} className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup">
                  Start Your First Vault
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/#how-it-works">See How It Works</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
            className="relative"
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
    <Card className="overflow-hidden border-white/15 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_88%_14%,rgba(230,184,106,0.12),transparent_18%),linear-gradient(180deg,rgba(29,42,70,0.99),rgba(57,74,112,0.95))] text-white shadow-[0_32px_90px_rgba(30,42,68,0.24)]">
      <CardContent className="p-4 sm:p-5">
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[rgba(10,16,30,0.22)]">
          <div className="relative h-[460px] sm:h-[560px] lg:h-[640px]">
            <img
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1400&q=80"
              alt="A family memory preserved inside a vault"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,18,34,0.12),rgba(11,18,34,0.38)_34%,rgba(11,18,34,0.84))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,184,106,0.14),transparent_24%)]" />

            <div className="absolute left-4 top-6 inline-flex items-center gap-2 rounded-full border border-white/14 bg-[rgba(20,28,48,0.48)] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/76 backdrop-blur-sm sm:left-6 sm:top-8">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              Vault preview
            </div>

            <div className="absolute inset-x-0 top-0 p-4 pt-20 sm:p-6 sm:pt-28 lg:p-8 lg:pt-32">
              <div className="max-w-3xl">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/58 sm:text-xs">Preserved from the past</p>
                <h2 className="mt-3 max-w-[11ch] text-balance font-display text-4xl leading-[0.94] text-white sm:mt-4 sm:text-[3.6rem] lg:text-[4.4rem]">
                  Keep the feeling, not just the file.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 sm:text-base sm:leading-8 lg:text-lg">
                  Vault Story keeps photos, letters, voice notes, and video memories wrapped in their meaning until the right future day arrives.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[rgba(20,28,48,0.48)] px-4 py-2 text-sm text-white/82 backdrop-blur-sm">
                    <CalendarClock className="h-4 w-4 text-secondary" />
                    Next opening: June 12, 2036
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-[rgba(20,28,48,0.48)] px-4 py-2 text-sm text-white/82 backdrop-blur-sm">
                    <LockKeyhole className="h-4 w-4 text-secondary" />
                    Saved now, felt later
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[22px] border border-white/10 bg-[rgba(20,28,48,0.42)] p-4 backdrop-blur-sm">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/54">Why it matters</p>
                    <p className="mt-2 text-sm leading-6 text-white/82">A memory returns with the age, voice, room, and reason it was saved.</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-[rgba(20,28,48,0.42)] p-4 backdrop-blur-sm">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/54">What it holds</p>
                    <p className="mt-2 text-sm leading-6 text-white/82">Videos, letters, voice notes, and the emotional context around them.</p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-[rgba(20,28,48,0.42)] p-4 backdrop-blur-sm">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/54">How it lands</p>
                    <p className="mt-2 text-sm leading-6 text-white/82">Opened at the right milestone, not lost in everyday storage.</p>
                  </div>
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
    <Card className="overflow-hidden border-white/15 bg-[linear-gradient(180deg,rgba(30,42,68,0.98),rgba(49,63,95,0.94))] text-white shadow-[0_32px_90px_rgba(42,29,20,0.24)]">
      <CardContent className="p-4 sm:p-5">
        <div className="rounded-[30px] border border-white/10 bg-[rgba(255,255,255,0.06)] p-3 sm:p-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs uppercase tracking-[0.22em] text-white/58">
            <span>Vault Story Preview</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] tracking-[0.16em] text-white/72">
              <LockKeyhole className="h-3.5 w-3.5 text-secondary" />
              Private family archive
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[180px_1fr]">
            <div className="rounded-[24px] border border-white/10 bg-[rgba(13,18,32,0.26)] p-4">
              <div className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/6 p-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground">
                  HV
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Hugo&apos;s vault</p>
                  <p className="text-xs text-white/60">Family timeline</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
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
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(13,18,32,0.22)]">
                <div className="relative h-40 overflow-hidden border-b border-white/10 sm:h-48">
                  <img
                    src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80"
                    alt="A family memory used as a vault cover"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,23,35,0.1),rgba(20,23,35,0.75))]" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/64">Family vault</p>
                        <h2 className="mt-2 text-balance font-display text-3xl leading-tight text-white sm:text-[2rem]">
                          Hugo&apos;s Life In Action
                        </h2>
                        <p className="mt-2 text-sm text-white/78">A private timeline of letters, videos, and voice notes saved for Hugo.</p>
                      </div>
                      <div className="hidden rounded-[18px] border border-white/12 bg-[rgba(255,255,255,0.08)] px-4 py-3 text-right sm:block">
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

              <div className="rounded-[24px] border border-white/10 bg-[rgba(13,18,32,0.22)] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/54">Upcoming reveals</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">What the future timeline actually looks like</h3>
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


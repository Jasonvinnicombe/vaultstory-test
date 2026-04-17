"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  LockKeyhole,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

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
              <h1 className="max-w-4xl text-balance font-display text-5xl leading-[0.96] tracking-[-0.03em] text-foreground sm:text-6xl md:max-w-[8ch] md:text-[4.55rem] lg:max-w-[8.5ch] lg:text-[5rem] xl:max-w-4xl xl:text-[5.8rem]">
                Preserve what matters. Deliver it when it matters most.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9 md:max-w-[29rem] md:text-[1.1rem] md:leading-8 lg:max-w-[34rem] xl:max-w-2xl xl:text-xl xl:leading-9">
                Vault Story is a private vault for letters, photos, voice notes, and video messages that are meant to be opened at the right moment in the future.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: "easeOut" }} className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/signup">
                  Start free trial
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
          <div className="relative h-[460px] sm:h-[560px] md:h-[640px] lg:h-[600px] xl:h-[640px]">
            <img
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1400&q=80"
              alt="A family memory preserved inside a vault"
              className="h-full w-full object-cover brightness-[1.14] saturate-[1.08]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,35,24,0.04),rgba(66,35,24,0.18)_34%,rgba(66,35,24,0.46))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,161,91,0.18),transparent_24%)]" />

            <div className="absolute inset-x-0 top-0 p-4 pt-12 sm:p-6 sm:pt-16 md:p-5 md:pt-14 lg:p-6 lg:pt-16 xl:p-8 xl:pt-18">
              <div className="max-w-3xl">
                <h2 className="max-w-[10ch] text-balance font-display text-4xl leading-[0.94] text-white sm:text-[3.25rem] md:text-[3.9rem] lg:text-[3.45rem] xl:text-[4.4rem]">
                  Keep the feeling, not just the file.
                </h2>
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
          <div className="flex flex-col gap-3 border-b border-white/10 pb-3 text-xs uppercase tracking-[0.22em] text-white/58 sm:flex-row sm:items-center sm:justify-end">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] tracking-[0.16em] text-white/72">
              <LockKeyhole className="h-3.5 w-3.5 text-secondary" />
              Private family archive
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(70,36,22,0.22)]">
            <div className="relative h-[420px] overflow-hidden sm:h-[500px] lg:h-[460px] xl:h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1761735142515-e0175a5a0b3f?auto=format&fit=crop&w=1400&q=80"
                alt="A bride sharing a tender wedding-day moment that supports the timed memory scenario"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(66,35,24,0.08),rgba(66,35,24,0.22)_36%,rgba(66,35,24,0.78))]" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-[36%] bg-[linear-gradient(270deg,rgba(255,255,255,0.38),rgba(255,255,255,0.16)_42%,rgba(255,255,255,0)_86%)] mix-blend-screen" />
              <div className="pointer-events-none absolute right-[0%] top-[8%] h-[72%] w-[27%] bg-[radial-gradient(circle_at_48%_38%,rgba(255,255,255,0.48),rgba(255,255,255,0.22)_36%,rgba(255,255,255,0.05)_62%,transparent_78%)] blur-[12px]" />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-[rgba(255,255,255,0.08)] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/72 sm:left-6 sm:top-6">
                <CalendarClock className="h-3.5 w-3.5 text-secondary" />
                Wedding day unlock
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <h2 className="max-w-[19rem] text-balance font-display text-[2.05rem] leading-[1.02] text-white sm:max-w-[26rem] sm:text-[2.65rem]">
                  On the morning of her wedding, she hears her mum again.
                </h2>
                <p className="mt-4 max-w-[29rem] text-sm leading-6 text-white/82 sm:text-base sm:leading-7">
                  Recorded while she was ill, this video was locked away for years so it could arrive on the one day her daughter would need her most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export function LandingHero() {
  return (
    <section className="page-wrap relative section-space overflow-hidden pb-20 pt-10 sm:pt-14 lg:pb-28 lg:pt-18">
      <div className="hero-orb absolute left-[-4rem] top-8 h-60 w-60 rounded-full opacity-80 sm:h-80 sm:w-80" />
      <div className="hero-orb absolute right-[-6rem] top-16 h-72 w-72 rounded-full opacity-65 sm:h-[26rem] sm:w-[26rem]" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <motion.div initial="initial" animate="animate" transition={{ staggerChildren: 0.08 }} className="section-stack">
          <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
            <Badge className="w-fit bg-secondary/90">Private family time capsules</Badge>
          </motion.div>

          <motion.div variants={fadeUp} transition={{ duration: 0.55, ease: "easeOut" }} className="space-y-5 sm:space-y-6">
            <h1 className="max-w-4xl text-balance font-display text-5xl leading-[0.94] tracking-[-0.03em] text-foreground sm:text-6xl lg:text-[6.2rem]">
              Preserve what matters. Deliver it when it matters most.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
              Create private time capsules with letters, photos, videos, and voice notes for your future self, your child, or the people you love.
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

          <motion.div variants={fadeUp} transition={{ duration: 0.6, ease: "easeOut" }} className="grid max-w-3xl gap-3 pt-4 sm:grid-cols-3">
            <Card className="glass-panel"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Formats</p><p className="mt-3 font-display text-2xl leading-tight">Letters, photos, audio, video</p></CardContent></Card>
            <Card className="glass-panel"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">For</p><p className="mt-3 font-display text-2xl leading-tight">Future self, child, partner, family</p></CardContent></Card>
            <Card className="glass-panel"><CardContent className="p-5"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Unlocks</p><p className="mt-3 font-display text-2xl leading-tight">Dates, milestones, life moments</p></CardContent></Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.08 }}
          className="relative"
        >
          <div className="absolute inset-x-10 bottom-[-2rem] h-24 rounded-full bg-[radial-gradient(circle,rgba(76,48,31,0.18),transparent_72%)] blur-2xl" />
          <Card className="overflow-hidden border-white/15 bg-[linear-gradient(180deg,rgba(53,39,31,0.98),rgba(96,68,49,0.95))] text-white shadow-[0_32px_90px_rgba(42,29,20,0.28)]">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="grid gap-5 lg:grid-rows-[auto_1fr]">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/72 backdrop-blur-sm sm:px-5">
                  <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-200" />Recorded with love, opened later</span>
                  <span>Unlocks on June 12, 2036</span>
                </div>

                <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/7">
                  <div className="relative aspect-[4/4.6] sm:aspect-[5/5.7] lg:aspect-[4/4.7]">
                    <img
                      src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80"
                      alt="A parent holding a child in warm evening light"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,17,12,0.08),rgba(27,17,12,0.68))]" />
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <div className="max-w-xl rounded-[28px] border border-white/12 bg-[rgba(94,72,58,0.72)] p-6 backdrop-blur-md sm:p-7">
                        <p className="text-xs uppercase tracking-[0.28em] text-white/58">Letter to my daughter</p>
                        <h2 className="mt-3 text-balance font-display text-3xl leading-tight text-white sm:text-[2.85rem]">
                          For the day you need proof of how deeply you were loved.
                        </h2>
                        <p className="mt-5 max-w-lg text-sm leading-7 text-white/84 sm:text-base">
                          Save the memories that would mean everything years from now, then let timing turn them into unforgettable arrivals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

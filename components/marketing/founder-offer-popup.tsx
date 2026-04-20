"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Clock3, Gem, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "vaultstory-founder-offer-dismissed-v1";

export function FounderOfferPopup(props: {
  enabled: boolean;
  isAuthenticated?: boolean;
  currentPlan?: string | null;
  currency?: string;
}) {
  const [open, setOpen] = useState(false);
  const normalizedCurrentPlan = props.currentPlan?.toLowerCase();
  const shouldShowOffer = props.enabled && (!normalizedCurrentPlan || normalizedCurrentPlan === "free");

  useEffect(() => {
    if (!shouldShowOffer) {
      return;
    }

    if (window.localStorage.getItem(DISMISS_KEY) === "1") {
      return;
    }

    const timer = window.setTimeout(() => setOpen(true), 3000);
    return () => window.clearTimeout(timer);
  }, [shouldShowOffer]);

  function closePopup() {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
  }

  if (!shouldShowOffer || !open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(53,31,20,0.22)] px-3 py-4 backdrop-blur-md sm:flex sm:items-center sm:justify-center sm:px-4">
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[30px] border border-[#edd8c8] bg-[linear-gradient(180deg,rgba(255,251,247,0.98),rgba(246,236,225,0.97))] shadow-[0_36px_120px_rgba(79,49,31,0.22)] sm:rounded-[36px]">
        <div className="absolute left-[-5rem] top-[-5rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(226,168,99,0.38),rgba(226,168,99,0))]" />
        <div className="absolute bottom-[-7rem] right-[-5rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(143,71,43,0.14),rgba(143,71,43,0))]" />

        <div className="relative grid gap-5 p-5 sm:p-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:p-10">
          <div className="flex min-h-0 flex-col justify-between space-y-5 lg:min-h-[540px] lg:space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#efc99f] bg-[#f6c983] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f472b] shadow-[0_10px_25px_rgba(246,201,131,0.35)] sm:px-4 sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5" />
              Founder offer
            </div>

            <div className="space-y-4 sm:space-y-5">
              <h2 className="max-w-[10ch] font-display text-[2.6rem] leading-[0.95] text-[#432d22] sm:text-5xl lg:text-6xl">
                Lifetime family vault for $99
              </h2>
              <p className="max-w-xl text-base leading-7 text-[#7c5f4e] sm:text-lg sm:leading-8">
                A one-time founder offer for families who want lifetime access, shared vault care, and 50GB of storage.
              </p>
            </div>

            <div className="flex flex-1 items-end">
              <div className="w-full max-w-[420px] rounded-[28px] bg-[linear-gradient(135deg,#fff6ef,#f8e5d3)] p-[1px] shadow-[0_24px_48px_rgba(143,71,43,0.12)] sm:rounded-[34px] sm:shadow-[0_30px_70px_rgba(143,71,43,0.16)]">
                <div className="rounded-[27px] bg-[linear-gradient(180deg,rgba(255,252,248,0.98),rgba(250,239,228,0.96))] px-5 py-5 sm:rounded-[33px] sm:px-7 sm:py-7">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f4e2cf] text-[#8f472b] shadow-[0_12px_30px_rgba(143,71,43,0.12)] sm:h-16 sm:w-16">
                      <Gem className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8f472b] sm:text-sm">Founder pricing</p>
                      <p className="mt-1 text-4xl font-semibold leading-none text-[#432d22] sm:mt-2 sm:text-5xl lg:text-6xl">$99</p>
                      <p className="mt-1 text-sm text-[#8a6f60] sm:mt-2 sm:text-base">One-time payment</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[20px] bg-white/72 px-4 py-3 text-sm leading-6 text-[#7c5f4e] sm:mt-6 sm:rounded-[24px] sm:px-5 sm:py-4 sm:leading-7">
                    Lifetime family vault access with a 50GB cap, designed as a standout founder offer.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/75 bg-white/78 p-4 shadow-[0_18px_44px_rgba(143,71,43,0.08)] sm:rounded-[30px] sm:p-6">
            <Badge className="bg-secondary/15 text-[#8f472b]">What&apos;s included</Badge>

            <div className="mt-4 grid gap-3 sm:mt-5">
              <div className="rounded-[20px] border border-[#f0e1d5] bg-[linear-gradient(180deg,rgba(255,248,243,0.95),rgba(252,244,238,0.95))] p-4 sm:rounded-[22px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4e2cf] text-[#b6633e] sm:h-10 sm:w-10">
                    <Gem className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[1rem] font-semibold text-[#432d22]">One payment</p>
                    <p className="text-sm leading-6 text-[#7c5f4e]">Pay once and keep the founder tier active.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#f0e1d5] bg-[linear-gradient(180deg,rgba(255,248,243,0.95),rgba(252,244,238,0.95))] p-4 sm:rounded-[22px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4e2cf] text-[#b6633e] sm:h-10 sm:w-10">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[1rem] font-semibold text-[#432d22]">Family-ready</p>
                    <p className="text-sm leading-6 text-[#7c5f4e]">Up to 6 family members can help protect the archive.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#f0e1d5] bg-[linear-gradient(180deg,rgba(255,248,243,0.95),rgba(252,244,238,0.95))] p-4 sm:rounded-[22px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4e2cf] text-[#b6633e] sm:h-10 sm:w-10">
                    <Clock3 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[1rem] font-semibold text-[#432d22]">50GB max</p>
                    <p className="text-sm leading-6 text-[#7c5f4e]">A clear, fixed storage ceiling for this lifetime founder tier.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[22px] bg-[linear-gradient(135deg,#8f472b,#c36a44)] p-[1px] shadow-[0_18px_40px_rgba(143,71,43,0.18)] sm:mt-6 sm:rounded-[24px]">
              <div className="rounded-[21px] bg-[linear-gradient(180deg,rgba(108,55,34,0.96),rgba(143,71,43,0.94))] px-4 py-4 text-white sm:rounded-[23px] sm:px-5">
                <p className="text-xs uppercase tracking-[0.22em] text-white/70">Early founder pricing</p>
                <p className="mt-2 text-sm leading-6 text-white/90 sm:leading-7">
                  Available for a limited time before standard pricing replaces this offer.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row">
              <Button asChild className="h-14 w-full rounded-full bg-[#c36a44] text-base font-semibold text-white shadow-[0_18px_34px_rgba(195,106,68,0.28)] hover:bg-[#b75f3a] sm:h-12 sm:flex-[1.25]">
                <Link href="/founder-offer">
                  Claim founder offer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button type="button" variant="outline" className="h-12 w-full rounded-full border-[#ead7ca] bg-white/80 px-6 text-sm font-medium text-[#6f5547] sm:h-11 sm:w-auto sm:flex-[0.75]" onClick={closePopup}>
                Maybe later
              </Button>
            </div>

            <p className="mt-4 text-center text-[11px] uppercase tracking-[0.16em] text-[#9a7b68] sm:text-xs sm:tracking-[0.18em]">
              Limited time offer. T&amp;C&apos;s apply.
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close founder offer"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#8a6f60] transition hover:bg-white sm:right-5 sm:top-5"
          onClick={closePopup}
        >
          x
        </button>
      </div>
    </div>
  );
}

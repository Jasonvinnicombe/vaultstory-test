"use client";

import { useEffect, useState } from "react";

import { getCountdownParts } from "@/lib/entries";

export function CountdownTimer({ unlockAt, variant = "default" }: { unlockAt: string | null; variant?: "default" | "inline" }) {
  const [countdown, setCountdown] = useState<ReturnType<typeof getCountdownParts> | null>(null);

  useEffect(() => {
    setCountdown(getCountdownParts(unlockAt));

    if (!unlockAt) {
      return;
    }

    const interval = window.setInterval(() => {
      setCountdown(getCountdownParts(unlockAt));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [unlockAt]);

  if (!unlockAt) {
    return <p className="text-sm leading-7 text-white/78">Unlocks when the milestone is completed.</p>;
  }

  if (variant === "inline") {
    const inlineItems = countdown
      ? [
          { label: "d", value: String(countdown.days).padStart(2, "0") },
          { label: "h", value: String(countdown.hours).padStart(2, "0") },
          { label: "m", value: String(countdown.minutes).padStart(2, "0") },
          { label: "s", value: String(countdown.seconds).padStart(2, "0") },
        ]
      : [
          { label: "d", value: "--" },
          { label: "h", value: "--" },
          { label: "m", value: "--" },
          { label: "s", value: "--" },
        ];

    return (
      <div className="rounded-[28px] border border-white/12 bg-black/20 px-5 py-4 text-white backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase tracking-[0.22em] text-white/54">Opens in</span>
          {inlineItems.map((item) => (
            <div key={item.label} className="inline-flex items-baseline gap-1 rounded-full border border-white/10 bg-white/6 px-3 py-2">
              <span className="font-display text-2xl leading-none text-white">{item.value}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/58">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = countdown
    ? [
        { label: "Days", value: countdown.days },
        { label: "Hours", value: countdown.hours },
        { label: "Minutes", value: countdown.minutes },
        { label: "Seconds", value: countdown.seconds },
      ]
    : [
        { label: "Days", value: "--" },
        { label: "Hours", value: "--" },
        { label: "Minutes", value: "--" },
        { label: "Seconds", value: "--" },
      ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 rounded-3xl border border-white/10 bg-black/20 px-3 py-5 text-center text-white sm:px-4">
          <p className="font-display text-3xl leading-none">{typeof item.value === "number" ? String(item.value).padStart(2, "0") : item.value}</p>
          <p className="mt-3 whitespace-nowrap text-[11px] uppercase leading-none tracking-[0.16em] text-white/60 sm:text-xs sm:tracking-[0.22em]">{item.label}</p>
        </div>
      ))}
    </div>
  );
}


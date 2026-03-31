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
    const inlineLabel = countdown
      ? [
          countdown.days > 0 ? `${countdown.days}d` : null,
          `${countdown.hours}h`,
          `${countdown.minutes}m`,
          `${countdown.seconds}s`,
        ].filter(Boolean).join(" ")
      : "--h --m --s";

    return (
      <div className="rounded-[24px] border border-white/12 bg-black/20 px-4 py-3 text-white backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/54">Opens in</span>
          <span className="font-display text-2xl leading-none text-white sm:text-3xl">{inlineLabel}</span>
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



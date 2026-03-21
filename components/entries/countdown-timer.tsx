"use client";

import { useEffect, useState } from "react";

import { getCountdownParts } from "@/lib/entries";

export function CountdownTimer({ unlockAt }: { unlockAt: string | null }) {
  const [countdown, setCountdown] = useState(() => getCountdownParts(unlockAt));

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

  if (!countdown) {
    return <p className="text-sm leading-7 text-white/78">Unlocks when the milestone is completed.</p>;
  }

  const items = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-3xl border border-white/10 bg-black/20 px-4 py-5 text-center text-white">
          <p className="font-display text-3xl">{String(item.value).padStart(2, "0")}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/60">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

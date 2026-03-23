"use client";

import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

type StorageQuotaResponse = {
  allowed: boolean;
  quotaGb?: number;
  usedBytes?: number;
  message?: string;
};

function formatGb(value: number) {
  return `${value.toFixed(value >= 10 ? 0 : 1)}GB`;
}

export function StorageUsageCard() {
  const [data, setData] = useState<StorageQuotaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/storage/quota", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ additionalBytes: 0 }),
        });

        const payload = (await response.json()) as StorageQuotaResponse;
        if (!active) return;

        if (!response.ok) {
          setError(payload.message ?? "Unable to load storage usage.");
          return;
        }

        setData(payload);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load storage usage.");
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const usage = useMemo(() => {
    const quotaGb = data?.quotaGb;
    const usedBytes = data?.usedBytes ?? 0;
    if (!quotaGb || !Number.isFinite(quotaGb)) {
      return {
        unlimited: true,
        usedGb: usedBytes / (1024 * 1024 * 1024),
        percent: 0,
        remainingGb: null as number | null,
      };
    }

    const usedGb = usedBytes / (1024 * 1024 * 1024);
    const percent = Math.min(100, (usedGb / quotaGb) * 100);
    const remainingGb = Math.max(0, quotaGb - usedGb);
    return { unlimited: false, usedGb, percent, remainingGb };
  }, [data]);

  return (
    <Card className="overflow-hidden border-white/60 bg-card/86 shadow-[0_18px_48px_rgba(66,46,31,0.08)]">
      <CardContent className="space-y-4 p-6 sm:p-7">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Storage</p>
          <h3 className="font-display text-2xl text-foreground">Storage usage</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Track how much of your plan storage is still available.
          </p>
        </div>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : data ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>{usage.unlimited ? "Unlimited plan" : `${formatGb(usage.usedGb)} used`}</span>
              {usage.unlimited ? (
                <span>{formatGb(usage.usedGb)} used so far</span>
              ) : (
                <span>{formatGb(usage.remainingGb ?? 0)} remaining</span>
              )}
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-secondary/25">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: usage.unlimited ? "12%" : `${usage.percent}%` }}
              />
            </div>
            {!usage.unlimited ? (
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {formatGb(usage.usedGb)} of {formatGb(data.quotaGb ?? 0)} used
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading storage usage...</p>
        )}
      </CardContent>
    </Card>
  );
}

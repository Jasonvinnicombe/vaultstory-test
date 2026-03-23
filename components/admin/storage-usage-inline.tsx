"use client";

import { useEffect, useMemo, useState } from "react";

type StorageUsageResponse = {
  allowed: boolean;
  quotaGb?: number;
  usedBytes?: number;
  message?: string;
};

function formatGb(value: number) {
  return `${value.toFixed(value >= 10 ? 0 : 1)}GB`;
}

export function StorageUsageInline({ userId }: { userId: string }) {
  const [data, setData] = useState<StorageUsageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch(`/api/admin/storage/usage?userId=${encodeURIComponent(userId)}`);
        const payload = (await response.json()) as StorageUsageResponse;
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
  }, [userId]);

  const usage = useMemo(() => {
    const quotaGb = data?.quotaGb;
    const usedBytes = data?.usedBytes ?? 0;
    if (!quotaGb || !Number.isFinite(quotaGb)) {
      return {
        unlimited: true,
        usedGb: usedBytes / (1024 * 1024 * 1024),
        remainingGb: null as number | null,
      };
    }

    const usedGb = usedBytes / (1024 * 1024 * 1024);
    const remainingGb = Math.max(0, quotaGb - usedGb);
    return { unlimited: false, usedGb, remainingGb };
  }, [data]);

  if (error) {
    return <span className="text-sm text-destructive">{error}</span>;
  }

  if (!data) {
    return <span className="text-sm text-muted-foreground">Loading storage usage...</span>;
  }

  if (usage.unlimited) {
    return <span className="text-sm text-muted-foreground">{formatGb(usage.usedGb)} used</span>;
  }

  return (
    <span className="text-sm text-muted-foreground">
      {formatGb(usage.usedGb)} used · {formatGb(usage.remainingGb ?? 0)} remaining
    </span>
  );
}

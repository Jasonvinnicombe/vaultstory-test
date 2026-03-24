"use client";

import { useEffect, useState } from "react";

import { getCurrencyCookieName } from "@/lib/currency";

const EURO_REGIONS = new Set([
  "AT",
  "BE",
  "CY",
  "DE",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PT",
  "SI",
  "SK",
]);

function normalizeCurrency(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim().toUpperCase();
  if (trimmed === "AUD" || trimmed === "USD" || trimmed === "GBP" || trimmed === "EUR") {
    return trimmed;
  }
  return null;
}

function detectCurrency() {
  if (typeof navigator === "undefined") return null;

  const language = navigator.languages?.[0] ?? navigator.language;
  const regionMatch = language?.match(/-([A-Za-z]{2})$/);
  const region = regionMatch?.[1]?.toUpperCase();

  if (region === "AU") return "AUD";
  if (region === "GB" || region === "UK") return "GBP";
  if (region === "US") return "USD";
  if (region && EURO_REGIONS.has(region)) return "EUR";

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz?.startsWith("Australia/")) return "AUD";
  if (tz === "Europe/London") return "GBP";
  if (tz?.startsWith("Europe/")) return "EUR";
  if (tz?.startsWith("America/")) return "USD";

  return null;
}

function getCookieValue(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.toLowerCase().startsWith(`${name}=`));
  if (!match) return null;
  return match.split("=").slice(1).join("=");
}

function getQueryCurrency() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return normalizeCurrency(params.get("currency"));
}

export function CurrencyDetect() {
  const [status, setStatus] = useState<{
    cookie: string | null;
    detected: string | null;
    timezone: string | null;
    language: string | null;
  } | null>(null);

  useEffect(() => {
    const cookieName = getCurrencyCookieName();
    const existing = normalizeCurrency(getCookieValue(cookieName));
    const detected = detectCurrency() ?? "USD";
    const override = getQueryCurrency();
    const nextCurrency = override ?? detected;

    if (existing !== nextCurrency) {
      document.cookie = `${cookieName}=${nextCurrency}; path=/; max-age=2592000; samesite=lax`;
      window.location.replace(window.location.pathname);
      return;
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
    const language = navigator.languages?.[0] ?? navigator.language ?? null;
    setStatus({
      cookie: existing,
      detected,
      timezone: tz,
      language,
    });
  }, []);

  if (typeof window === "undefined") return null;

  if (!status) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] rounded-2xl border border-white/20 bg-[rgba(30,42,68,0.92)] p-4 text-xs text-white shadow-[0_18px_48px_rgba(15,23,42,0.28)]">
      <div className="font-semibold">Currency debug</div>
      <div className="mt-1">cookie: {status.cookie ?? "none"}</div>
      <div>detected: {status.detected ?? "none"}</div>
      <div>tz: {status.timezone ?? "unknown"}</div>
      <div>lang: {status.language ?? "unknown"}</div>
    </div>
  );
}

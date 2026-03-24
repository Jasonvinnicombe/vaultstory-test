"use client";

import { useEffect } from "react";

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

export function CurrencyDetect() {
  useEffect(() => {
    const cookieName = getCurrencyCookieName();
    const existing = normalizeCurrency(getCookieValue(cookieName));
    if (existing) return;

    const detected = detectCurrency() ?? "USD";
    document.cookie = `${cookieName}=${detected}; path=/; max-age=2592000; samesite=lax`;
    window.location.reload();
  }, []);

  return null;
}

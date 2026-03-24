"use client";

import { useCallback } from "react";

import { getCurrencyCookieName } from "@/lib/currency";
import type { CurrencyCode } from "@/lib/currency";

const CURRENCIES: CurrencyCode[] = ["AUD", "USD", "GBP", "EUR"];

export function CurrencySwitcher({ currentCurrency }: { currentCurrency: CurrencyCode }) {
  const handleClick = useCallback((currency: CurrencyCode) => {
    const cookieName = getCurrencyCookieName();
    document.cookie = `${cookieName}=${currency}; path=/; max-age=2592000; samesite=lax`;
    window.location.reload();
  }, []);

  return (
    <div className="mt-3 inline-flex flex-wrap items-center gap-2 text-xs">
      <span className="text-muted-foreground">Currency:</span>
      {CURRENCIES.map((currency) => (
        <button
          key={currency}
          type="button"
          onClick={() => handleClick(currency)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${currency === currentCurrency
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-white/40 bg-white/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
          }`}
        >
          {currency}
        </button>
      ))}
    </div>
  );
}

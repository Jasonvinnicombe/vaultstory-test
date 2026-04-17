"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";

export function MobileBillingReturnClient(props: {
  params: Record<string, string>;
  fallbackUrl: string;
}) {
  const deepLinkUrl = useMemo(() => {
    const url = new URL("app.vaultstory.mobile://billing-return");

    for (const [key, value] of Object.entries(props.params)) {
      url.searchParams.set(key, value);
    }

    return url.toString();
  }, [props.params]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      window.location.replace(deepLinkUrl);
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [deepLinkUrl]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf6f0] px-6 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-[#e6d5c8] bg-[#fffaf5] p-6 shadow-[0_18px_48px_rgba(66,46,31,0.08)] sm:p-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-[#8f472b]">Vault Story</p>
          <h1 className="text-3xl font-semibold text-[#4e2f21]">Returning to the app</h1>
          <p className="text-sm leading-7 text-[#7a675b]">
            If the app does not reopen automatically in a moment, use the button below.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <a
            href={deepLinkUrl}
            className="block w-full rounded-2xl bg-[#8f472b] px-4 py-3 text-center text-base font-semibold text-white"
          >
            Return to the Vault Story app
          </a>
          <Link
            href={props.fallbackUrl}
            className="block w-full rounded-2xl border border-[#e6d5c8] bg-white px-4 py-3 text-center text-base font-medium text-[#4e2f21]"
          >
            Open Vault Story in the browser instead
          </Link>
        </div>
      </div>
    </main>
  );
}

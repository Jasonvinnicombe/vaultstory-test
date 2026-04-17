"use client";

import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import Link from "next/link";
import { useEffect, useState } from "react";

import { MobileLogoutButton } from "@/components/auth/mobile-logout-button";
import { createClient } from "@/lib/supabase/client";

const mainSiteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/";

export function MobileHomeScreen() {
  const [name, setName] = useState("there");
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    setIsNativeApp(Capacitor.isNativePlatform());

    const supabase = createClient();

    if (!supabase) {
      return;
    }

    let active = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (!active) {
        return;
      }

      const fullName =
        typeof data.user?.user_metadata?.full_name === "string"
          ? data.user.user_metadata.full_name
          : null;

      const firstName = fullName?.split(" ")[0]?.trim();
      if (firstName) {
        setName(firstName);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  async function openMainSite() {
    if (!isNativeApp) {
      window.location.href = mainSiteUrl;
      return;
    }

    await Browser.open({
      url: mainSiteUrl,
      presentationStyle: "fullscreen",
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf6f0] px-6 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-[#e6d5c8] bg-[#fffaf5] p-6 shadow-[0_18px_48px_rgba(66,46,31,0.08)] sm:p-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-[#8f472b]">Vault Story</p>
          <h1 className="text-3xl font-semibold text-[#4e2f21]">Welcome back, {name}</h1>
          <p className="text-sm leading-7 text-[#7a675b]">
            You are signed in. Start from this lighter mobile home, then open the rest of the app when you are ready.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => void openMainSite()}
            className="block w-full rounded-2xl border border-[#e6d5c8] bg-[#f7efe6] px-4 py-3 text-center text-base font-semibold text-[#8f472b]"
          >
            Go to main site
          </button>
          <Link
            href="/dashboard"
            className="block w-full rounded-2xl bg-primary px-4 py-3 text-center text-base font-semibold text-primary-foreground"
          >
            Open dashboard
          </Link>
          <Link
            href="/vaults/new"
            className="block w-full rounded-2xl border border-[#e6d5c8] bg-white px-4 py-3 text-center text-base font-medium text-[#4e2f21]"
          >
            Create a vault
          </Link>
          <Link
            href="/settings"
            className="block w-full rounded-2xl border border-[#e6d5c8] bg-white px-4 py-3 text-center text-base font-medium text-[#4e2f21]"
          >
            Open settings
          </Link>
          <MobileLogoutButton />
        </div>
      </div>
    </main>
  );
}

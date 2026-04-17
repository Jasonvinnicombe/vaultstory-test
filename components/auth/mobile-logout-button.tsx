"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function MobileLogoutButton() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function handleLogout() {
    const supabase = createClient();

    if (!supabase) {
      return;
    }

    setSubmitting(true);
    await supabase.auth.signOut();
    router.push("/mobile-login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={submitting}
      className="w-full rounded-2xl border border-[#e6d5c8] bg-white px-4 py-3 text-base font-medium text-[#4e2f21] transition disabled:cursor-not-allowed disabled:opacity-60"
    >
      {submitting ? "Signing out..." : "Log out"}
    </button>
  );
}

import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { MobileAuthForm } from "@/components/forms/mobile-auth-form";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Mobile signup | Vault Story",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MobileSignupPage() {
  const user = await getUser();

  if (user) {
    redirect("/mobile-home");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf6f0] px-6 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-[#e6d5c8] bg-[#fffaf5] p-6 shadow-[0_18px_48px_rgba(66,46,31,0.08)] sm:p-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-[#8f472b]">Vault Story</p>
          <h1 className="text-3xl font-semibold text-[#4e2f21]">Mobile sign up</h1>
          <p className="text-sm leading-7 text-[#7a675b]">
            A lighter account setup flow for the native app so new users can get in without loading the full marketing UI first.
          </p>
        </div>

        <div className="mt-6">
          <MobileAuthForm mode="signup" />
        </div>
      </div>
    </main>
  );
}

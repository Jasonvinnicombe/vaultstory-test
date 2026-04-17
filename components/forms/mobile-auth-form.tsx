"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type MobileAuthFormProps = {
  mode: "login" | "signup";
};

export function MobileAuthForm({ mode }: MobileAuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supabaseReady, setSupabaseReady] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupabaseReady(Boolean(createClient()));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const supabase = createClient();

    if (!supabase) {
      setError("Supabase is not configured on this device yet.");
      return;
    }

    setSubmitting(true);

    if (mode === "login") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      setSubmitting(false);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/mobile-home");
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: fullName.trim() ? { full_name: fullName.trim() } : undefined,
      },
    });

    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/mobile-home");
      router.refresh();
      return;
    }

    router.push(`/mobile-login?email=${encodeURIComponent(email.trim())}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4" noValidate>
      {mode === "signup" ? (
        <div className="space-y-1">
          <label htmlFor="mobile-full-name" className="block text-sm font-medium text-foreground">
            Full name
          </label>
          <input
            id="mobile-full-name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-base text-foreground outline-none transition focus:border-primary"
            placeholder="Your full name"
          />
        </div>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="mobile-email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="mobile-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-base text-foreground outline-none transition focus:border-primary"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="mobile-password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="mobile-password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-base text-foreground outline-none transition focus:border-primary"
          placeholder={mode === "login" ? "Your password" : "Create a password"}
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {!supabaseReady ? <p className="text-sm text-muted-foreground">Checking app setup...</p> : null}

      <button
        type="submit"
        disabled={!supabaseReady || submitting}
        className="w-full rounded-2xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (mode === "login" ? "Signing in..." : "Creating account...") : mode === "login" ? "Log in" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? "Need a new account?" : "Already have an account?"}{" "}
        <Link
          href={mode === "login" ? "/mobile-signup" : "/mobile-login"}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {mode === "login" ? "Create one" : "Log in"}
        </Link>
      </p>
    </form>
  );
}

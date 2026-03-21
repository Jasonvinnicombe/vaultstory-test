"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { signInSchema, signUpSchema } from "@/lib/validations/auth";

type AuthMode = "login" | "signup" | "sign-in" | "sign-up";
type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;
type AuthValues = SignInValues & { fullName?: string; acceptTerms?: boolean };
type OAuthProvider = "google";
type BrowserSupabaseClient = NonNullable<ReturnType<typeof createClient>>;

const OAUTH_PROVIDERS: Array<{ provider: OAuthProvider; label: string }> = [
  { provider: "google", label: "Google" },
];

function normalizeMode(mode: AuthMode) {
  return mode === "sign-in" ? "login" : mode === "sign-up" ? "signup" : mode;
}

function buildAuthHref(mode: "login" | "signup", email: string, inviteMode: string | null, nextPath: string) {
  const params = new URLSearchParams();

  if (email) params.set("email", email);
  if (inviteMode) params.set("invite", inviteMode);
  if (nextPath) params.set("next", nextPath);

  const query = params.toString();
  return query ? `/${mode}?${query}` : `/${mode}`;
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.29h6.44a5.51 5.51 0 0 1-2.39 3.62v3h3.86c2.26-2.08 3.58-5.15 3.58-8.64Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.86-3c-1.07.72-2.43 1.15-4.09 1.15-3.14 0-5.8-2.12-6.75-4.97H1.26v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.25 14.27A7.2 7.2 0 0 1 4.87 12c0-.79.14-1.55.38-2.27V6.64H1.26A12 12 0 0 0 0 12c0 1.94.46 3.78 1.26 5.36l3.99-3.09Z" />
      <path fill="#EA4335" d="M12 4.76c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.26 6.64l3.99 3.09c.95-2.85 3.61-4.97 6.75-4.97Z" />
    </svg>
  );
}

function buildAuthCallbackHref(nextPath: string, inviteMode: string | null, email: string) {
  const params = new URLSearchParams();

  if (nextPath) params.set("next", nextPath);
  if (inviteMode) params.set("invite", inviteMode);
  if (email) params.set("email", email);

  const query = params.toString();
  return query ? `/auth/callback?${query}` : "/auth/callback";
}

function getFriendlyAuthError(message: string, mode: "login" | "signup" | "reset") {
  if (/email rate limit exceeded/i.test(message)) {
    if (mode === "signup") {
      return "Too many confirmation emails were requested. Wait a few minutes, then try again, or check whether a confirmation email already arrived in your inbox or spam folder.";
    }

    if (mode === "reset") {
      return "Too many password reset emails were requested. Wait a few minutes, then try again, or use the most recent reset email you already received.";
    }

    return "Too many email attempts were made recently. Wait a few minutes, then try again.";
  }

  if (/user already registered|already been registered/i.test(message)) {
    return "That email address is already registered. Try logging in instead, or use Forgot password if you need to reset access.";
  }

  if (/email.*confirm/i.test(message)) {
    return "Please confirm your email first, then log in.";
  }

  return message;
}

function isExistingAccountSignUp(data: { session: unknown; user: { identities?: Array<unknown> | null } | null }) {
  return Boolean(data.user && !data.session && Array.isArray(data.user.identities) && data.user.identities.length === 0);
}

async function getPostAuthDestination(supabase: BrowserSupabaseClient, nextPath: string) {
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (data?.nextLevel === "aal2" && data.currentLevel !== "aal2") {
    return `/auth/mfa?next=${encodeURIComponent(nextPath)}`;
  }

  return nextPath;
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient>>(null);
  const [authClientChecked, setAuthClientChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSending, setResetSending] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<OAuthProvider | null>(null);
  const currentMode = normalizeMode(mode);
  const inviteEmail = searchParams.get("email") ?? "";
  const inviteMode = searchParams.get("invite");
  const nextPath = searchParams.get("next") || "/dashboard";
  const alternateAuthHref = buildAuthHref(currentMode === "login" ? "signup" : "login", inviteEmail, inviteMode, nextPath);

  useEffect(() => {
    setSupabase(createClient());
    setAuthClientChecked(true);
  }, []);

  const form = useForm<AuthValues>({
    resolver: zodResolver(currentMode === "login" ? signInSchema : signUpSchema),
    defaultValues: { fullName: "", email: inviteEmail, password: "", acceptTerms: false },
  });

  async function handleForgotPassword() {
    if (!supabase) {
      toast.error("Add your Supabase URL and anon key in .env.local to enable authentication.");
      return;
    }

    const email = form.getValues("email").trim();
    const emailCheck = signInSchema.shape.email.safeParse(email);

    if (!emailCheck.success) {
      toast.error("Enter your email address first so we know where to send the reset link.");
      return;
    }

    setResetSending(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setResetSending(false);

    if (error) {
      toast.error(getFriendlyAuthError(error.message, "reset"));
      return;
    }

    toast.success("Password reset email sent. Use the link in that email to choose a new password.");
  }

  async function handleOAuth(provider: OAuthProvider) {
    if (!supabase) {
      toast.error("Add your Supabase URL and anon key in .env.local to enable authentication.");
      return;
    }

    setOauthLoading(provider);

    const email = form.getValues("email").trim() || inviteEmail;
    const redirectTo = `${window.location.origin}${buildAuthCallbackHref(nextPath, inviteMode, email)}`;
    const providerOptions: Record<OAuthProvider, { scopes?: string; queryParams?: Record<string, string> }> = {
      google: {
        scopes: "email profile",
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    };

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        scopes: providerOptions[provider].scopes,
        queryParams: providerOptions[provider].queryParams,
      },
    });

    setOauthLoading(null);

    if (error) {
      toast.error(getFriendlyAuthError(error.message, "login"));
    }
  }

  async function onSubmit(values: AuthValues) {
    if (!supabase) {
      toast.error("Add your Supabase URL and anon key in .env.local to enable authentication.");
      return;
    }

    setLoading(true);

    if (currentMode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
      setLoading(false);
      if (error) {
        return toast.error(getFriendlyAuthError(error.message, "login"));
      }
      toast.success("Signed in successfully.");
      const destination = await getPostAuthDestination(supabase, nextPath);
      router.push(destination);
      router.refresh();
      return;
    }

    const signUpValues = values as SignUpValues;
    const { data, error } = await supabase.auth.signUp({
      email: signUpValues.email,
      password: signUpValues.password,
      options: { data: { full_name: signUpValues.fullName } },
    });

    setLoading(false);
    if (error) return toast.error(getFriendlyAuthError(error.message, "signup"));

    if (isExistingAccountSignUp(data)) {
      const loginHref = buildAuthHref("login", signUpValues.email, inviteMode, nextPath);
      toast.error("That email address is already registered. Try logging in instead, or use Forgot password if you need to reset access.");
      router.push(loginHref);
      router.refresh();
      return;
    }

    if (data.session) {
      toast.success(inviteMode === "vault" ? "Account created. You can now open the invited vault." : inviteMode === "admin" ? "Account created. Your admin access will be available once you land inside the app." : "Account created successfully.");
      const destination = await getPostAuthDestination(supabase, nextPath);
      router.push(destination);
      router.refresh();
      return;
    }

    const loginHref = buildAuthHref("login", signUpValues.email, inviteMode, nextPath);
    toast.success("Account created. Check your email to confirm your address, then log in.");
    router.push(loginHref);
    router.refresh();
  }

  const showSetupState = authClientChecked && !supabase;
  const authUnavailable = !authClientChecked || !supabase;

  return (
    <Card className="w-full max-w-lg overflow-hidden border-white/60 bg-card/90 shadow-[0_28px_90px_rgba(66,46,31,0.14)] backdrop-blur-xl">
      <CardHeader className="space-y-6 p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_16px_30px_rgba(91,60,35,0.22)]">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div className="hidden rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex sm:items-center sm:gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Private by design
          </div>
        </div>
        <div className="space-y-3">
          <CardTitle className="font-display text-3xl sm:text-4xl">
            {currentMode === "login" ? "Return to your memories" : "Begin your first vault"}
          </CardTitle>
          <CardDescription className="max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
            {currentMode === "login"
              ? "Sign in to continue writing, preserving, and unlocking moments that deserve to be held with care."
              : "Create a quiet place for letters, photos, videos, and voice notes that will matter even more later."}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-7 pt-0 sm:p-9 sm:pt-0">
        {showSetupState ? (
          <div className="rounded-[30px] border border-border/80 bg-secondary/50 p-5 sm:p-6">
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Supabase setup needed</h3>
              <p className="text-sm leading-7 text-muted-foreground">
                Add your Supabase project URL and anon key in <code className="rounded bg-background px-1.5 py-0.5">.env.local</code> to enable authentication.
              </p>
            </div>
            <div className="mt-4 rounded-[24px] bg-background/80 p-4 text-sm text-muted-foreground">
              <p>NEXT_PUBLIC_SUPABASE_URL=...</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=...</p>
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-1">
            {OAUTH_PROVIDERS.map((item) => (
              <button
                key={item.provider}
                type="button"
                onClick={() => void handleOAuth(item.provider)}
                disabled={authUnavailable || loading || oauthLoading !== null}
                className="inline-flex items-center justify-center gap-3 rounded-[22px] border border-border/70 bg-background/80 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center">
                  <GoogleLogo />
                </span>
                {oauthLoading === item.provider ? `Opening ${item.label}...` : `Continue with ${item.label}`}
              </button>
            ))}
          </div>
          <div className="relative py-1 text-center text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border/70" aria-hidden="true" />
            <span className="relative bg-card px-4">or continue with email</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {inviteMode ? (
            <div className="rounded-[28px] border border-secondary/30 bg-secondary/10 p-4 text-sm leading-7 text-foreground">
              {inviteMode === "admin" ? "You were invited to help manage Vault Story. Sign in or create your account with this email to continue." : "You were invited into a family vault. Sign in or create your account with this email to continue."}
            </div>
          ) : null}

          {currentMode === "signup" ? (
            <div className="space-y-2.5">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" placeholder="Your full name" disabled={authUnavailable} aria-invalid={Boolean(form.formState.errors.fullName)} {...form.register("fullName")} />
              {form.formState.errors.fullName ? <p className="text-xs text-destructive">{String(form.formState.errors.fullName.message)}</p> : <p className="text-xs text-muted-foreground">This helps personalize your vault and family invitations.</p>}
            </div>
          ) : null}

          <div className="space-y-2.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" disabled={authUnavailable} aria-invalid={Boolean(form.formState.errors.email)} {...form.register("email")} />
            {form.formState.errors.email ? <p className="text-xs text-destructive">{String(form.formState.errors.email.message)}</p> : null}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Minimum 8 characters</span>
                {currentMode === "login" ? (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={resetSending || authUnavailable}
                    className="text-xs font-medium text-primary underline-offset-4 transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resetSending ? "Sending..." : "Forgot password?"}
                  </button>
                ) : null}
              </div>
            </div>
            <Input id="password" type="password" placeholder="Enter your password" disabled={authUnavailable} aria-invalid={Boolean(form.formState.errors.password)} {...form.register("password")} />
            {form.formState.errors.password ? <p className="text-xs text-destructive">{String(form.formState.errors.password.message)}</p> : <p className="text-xs text-muted-foreground">Use something memorable to you, but hard for anyone else to guess.</p>}
          </div>

          {currentMode === "login" ? (
            <div className="rounded-[28px] border border-border/70 bg-background/65 p-4 text-sm leading-7 text-muted-foreground">
              Your memories stay private. Once you are in, you will land back inside your dashboard.
            </div>
          ) : null}

          {currentMode === "signup" ? (
            <>
              <div className="space-y-3 rounded-[24px] border border-border/70 bg-background/65 p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    id="acceptTerms"
                    className="mt-1 h-7 w-7 rounded-full border-2 border-primary/50 bg-white shadow-[0_8px_18px_rgba(66,46,31,0.08)] data-[state=checked]:border-primary"
                    checked={Boolean(form.watch("acceptTerms"))}
                    onCheckedChange={(checked) => form.setValue("acceptTerms", Boolean(checked), { shouldValidate: true })}
                    aria-invalid={Boolean(form.formState.errors.acceptTerms)}
                  />
                  <div className="space-y-1.5 text-sm leading-7 text-muted-foreground">
                    <Label htmlFor="acceptTerms" className="cursor-pointer text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                      I agree to the Terms & Conditions
                    </Label>
                    <p>
                      By creating an account, you agree to the <Link href="/terms" className="font-medium text-primary underline-offset-4 hover:underline">Terms & Conditions</Link> for Vault Story.
                    </p>
                  </div>
                </div>
                {form.formState.errors.acceptTerms ? <p className="text-xs text-destructive">{String(form.formState.errors.acceptTerms.message)}</p> : null}
              </div>

            </>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading || authUnavailable || oauthLoading !== null}>
            {loading ? "Please wait..." : currentMode === "login" ? "Log in" : "Create account"}
            {!loading ? <ArrowRight className="h-4 w-4" /> : null}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {currentMode === "login" ? "Need an account?" : "Already have an account?"}{" "}
          <Link href={alternateAuthHref} className="font-medium text-primary underline-offset-4 hover:underline">
            {currentMode === "login" ? "Sign up" : "Log in"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

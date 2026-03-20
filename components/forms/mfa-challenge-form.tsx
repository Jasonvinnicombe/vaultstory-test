"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ShieldCheck, Smartphone, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function MfaChallengeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient>>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const nextPath = useMemo(() => {
    const path = searchParams.get("next") || "/dashboard";
    return path.startsWith("/") ? path : "/dashboard";
  }, [searchParams]);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    let active = true;

    async function loadFactor() {
      if (!supabase) {
        if (active) setReady(true);
        return;
      }

      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.currentLevel === "aal2") {
        router.replace(nextPath);
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.mfa.listFactors();
      if (!active) return;

      if (error) {
        toast.error(error.message);
        setReady(true);
        return;
      }

      const firstFactor = data?.totp?.find((item) => item.status === "verified") ?? null;
      if (!firstFactor) {
        toast.error("Two-factor authentication is not set up on this account yet.");
        router.replace(nextPath);
        router.refresh();
        return;
      }

      setFactorId(firstFactor.id);
      setReady(true);
    }

    void loadFactor();

    return () => {
      active = false;
    };
  }, [nextPath, router, supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      toast.error("Add your Supabase URL and anon key in .env.local to enable authentication.");
      return;
    }

    if (!factorId) {
      toast.error("No verified authenticator is available for this account.");
      return;
    }

    if (code.trim().length !== 6) {
      toast.error("Enter the 6-digit code from your authenticator app.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code: code.trim(),
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Identity confirmed.");
    router.replace(nextPath);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-lg overflow-hidden border-white/60 bg-card/90 shadow-[0_28px_90px_rgba(66,46,31,0.14)] backdrop-blur-xl">
      <CardHeader className="space-y-6 p-7 sm:p-9">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_16px_30px_rgba(91,60,35,0.22)]">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="space-y-3">
          <CardTitle className="font-display text-3xl sm:text-4xl">Enter your verification code</CardTitle>
          <CardDescription className="max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
            Vault Story needs one extra step before opening protected memories.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-7 pt-0 sm:p-9 sm:pt-0">
        <div className="rounded-[28px] border border-border/80 bg-background/75 p-5 text-sm leading-7 text-muted-foreground">
          <div className="flex items-start gap-3">
            <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary/85 text-primary">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-foreground">Open your authenticator app</p>
              <p className="mt-1">Use Google Authenticator, 1Password, Apple Passwords, or any TOTP app to read the current 6-digit code.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="mfaCode">Authentication code</Label>
            <Input
              id="mfaCode"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={!ready || loading}
            />
            <p className="text-xs text-muted-foreground">Enter the current code exactly as shown in your authenticator app.</p>
          </div>

          <Button type="submit" className="w-full" disabled={!ready || loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Verifying..." : "Verify and continue"}
            {!loading ? <ArrowRight className="h-4 w-4" /> : null}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}



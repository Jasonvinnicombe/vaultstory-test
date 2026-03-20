"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient>>(null);
  const [authClientChecked, setAuthClientChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    setSupabase(createClient());
    setAuthClientChecked(true);
  }, []);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      if (!supabase) {
        if (active && authClientChecked) {
          setSessionChecked(true);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (active) {
        setSessionReady(Boolean(data.session));
        setSessionChecked(true);
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [authClientChecked, supabase]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      toast.error("Add your Supabase URL and anon key in .env.local to enable authentication.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated. You can now log in with your new password.");
    router.push("/login");
    router.refresh();
  }

  const showSetupState = authClientChecked && !supabase;
  const authUnavailable = !authClientChecked || !supabase;

  return (
    <Card className="w-full max-w-lg overflow-hidden border-white/60 bg-card/90 shadow-[0_28px_90px_rgba(66,46,31,0.14)] backdrop-blur-xl">
      <CardHeader className="space-y-6 p-7 sm:p-9">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_16px_30px_rgba(91,60,35,0.22)]">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <div className="space-y-3">
          <CardTitle className="font-display text-3xl sm:text-4xl">Reset your password</CardTitle>
          <CardDescription className="max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
            Opened the recovery email? Choose a new password below and we will update your account securely.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-7 pt-0 sm:p-9 sm:pt-0">
        {showSetupState ? (
          <div className="rounded-[30px] border border-border/80 bg-secondary/50 p-5 sm:p-6 text-sm leading-7 text-muted-foreground">
            Add your Supabase project URL and anon key in <code className="rounded bg-background px-1.5 py-0.5">.env.local</code> to enable password recovery.
          </div>
        ) : null}

        {!showSetupState && sessionChecked && !sessionReady ? (
          <div className="rounded-[28px] border border-secondary/25 bg-secondary/10 p-5 text-sm leading-7 text-foreground/85">
            Open the password reset link from your email first. That secure link brings you back here with permission to set a new password.
          </div>
        ) : null}

        {!showSetupState && sessionReady ? (
          <div className="rounded-[24px] border border-border/70 bg-background/65 p-4 text-sm leading-7 text-muted-foreground">
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Recovery session confirmed
            </span>
            <p className="mt-2">Set a new password below, then head back to login.</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your new password"
              disabled={!sessionReady || authUnavailable}
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat your new password"
              disabled={!sessionReady || authUnavailable}
            />
            <p className="text-xs text-muted-foreground">Use at least 8 characters so your vault stays protected.</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !sessionReady || authUnavailable}>
            {loading ? "Updating..." : "Save new password"}
            {!loading ? <ArrowRight className="h-4 w-4" /> : null}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

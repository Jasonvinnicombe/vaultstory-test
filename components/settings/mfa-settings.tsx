"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Copy, Loader2, Shield, ShieldCheck, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function MfaSettings() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedFactorId, setVerifiedFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [pendingFactorId, setPendingFactorId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");

  const isEnabled = Boolean(verifiedFactorId);

  useEffect(() => {
    let active = true;

    async function loadFactors() {
      if (!supabase) {
        if (active) setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.mfa.listFactors();
      if (!active) return;

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const verifiedFactor = data?.totp?.find((item) => item.status === "verified") ?? null;
      setVerifiedFactorId(verifiedFactor?.id ?? null);
      setLoading(false);
    }

    void loadFactors();

    return () => {
      active = false;
    };
  }, [supabase]);

  const maskedSecret = useMemo(() => {
    if (!secret) return null;
    return secret.replace(/(.{4})/g, "$1 ").trim();
  }, [secret]);

  async function refreshFactors() {
    if (!supabase) return;
    const { data } = await supabase.auth.mfa.listFactors();
    const verifiedFactor = data?.totp?.find((item) => item.status === "verified") ?? null;
    setVerifiedFactorId(verifiedFactor?.id ?? null);
  }

  async function handleEnable() {
    if (!supabase) {
      toast.error("Add your Supabase URL and anon key in .env.local to enable authentication.");
      return;
    }

    setEnrolling(true);
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Vault Story Authenticator",
      issuer: "Vault Story",
    });
    setEnrolling(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setPendingFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setVerificationCode("");
    toast.success("Authenticator setup started. Scan the QR code, then enter the code below.");
  }

  async function handleVerify() {
    if (!supabase || !pendingFactorId) return;

    if (verificationCode.trim().length !== 6) {
      toast.error("Enter the 6-digit code from your authenticator app.");
      return;
    }

    setVerifying(true);
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: pendingFactorId,
      code: verificationCode.trim(),
    });
    setVerifying(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Two-factor authentication is now enabled.");
    setPendingFactorId(null);
    setQrCode(null);
    setSecret(null);
    setVerificationCode("");
    await refreshFactors();
  }

  async function handleDisable() {
    if (!supabase || !verifiedFactorId) return;

    setDisabling(true);
    const { error } = await supabase.auth.mfa.unenroll({ factorId: verifiedFactorId });
    setDisabling(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Two-factor authentication has been turned off.");
    setVerifiedFactorId(null);
    setPendingFactorId(null);
    setQrCode(null);
    setSecret(null);
    setVerificationCode("");
  }

  async function copySecret() {
    if (!secret) return;
    await navigator.clipboard.writeText(secret);
    toast.success("Setup key copied.");
  }

  return (
    <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_26px_80px_rgba(66,46,31,0.12)]">
      <CardHeader className="space-y-3 p-7 sm:p-9">
        <CardTitle className="font-display text-3xl sm:text-4xl">Two-factor authentication</CardTitle>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Add an authenticator app step so even a stolen password is not enough to open your family archive.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-7 pt-0 sm:p-9 sm:pt-0">
        <div className="rounded-[30px] border border-border/70 bg-background/60 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary/85 text-primary">
                {isEnabled ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
              </div>
              <div>
                <p className="font-medium text-foreground">{isEnabled ? "Protection is active" : "Protection is currently off"}</p>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">
                  {isEnabled
                    ? "Vault Story will ask for a one-time code after password or social login."
                    : "Turn on 2FA to require a one-time code from your phone each time you sign in."}
                </p>
              </div>
            </div>
            {isEnabled ? (
              <Button type="button" variant="outline" onClick={() => void handleDisable()} disabled={disabling}>
                {disabling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {disabling ? "Turning off..." : "Disable 2FA"}
              </Button>
            ) : (
              <Button type="button" onClick={() => void handleEnable()} disabled={loading || enrolling || Boolean(pendingFactorId)}>
                {enrolling ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {enrolling ? "Preparing..." : "Enable 2FA"}
              </Button>
            )}
          </div>
        </div>

        {pendingFactorId && qrCode ? (
          <section className="space-y-5 rounded-[32px] border border-secondary/30 bg-secondary/10 p-5 sm:p-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-foreground">Set up your authenticator app</h2>
              <p className="text-sm text-muted-foreground">Scan the QR code below with Google Authenticator, Apple Passwords, 1Password, or another TOTP app.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-start">
              <div className="flex items-center justify-center rounded-[28px] border border-border/70 bg-card/85 p-5">
                <img src={qrCode} alt="Vault Story authenticator QR code" className="h-40 w-40 rounded-2xl" />
              </div>
              <div className="space-y-4">
                <div className="rounded-[24px] border border-border/70 bg-card/85 p-4 text-sm leading-7 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary/85 text-primary">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">No camera? Use the setup key instead.</p>
                      <p className="mt-1 break-all font-mono text-xs text-foreground/80">{maskedSecret}</p>
                    </div>
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={() => void copySecret()}>
                  <Copy className="h-4 w-4" />
                  Copy setup key
                </Button>
                <div className="space-y-2.5">
                  <Label htmlFor="mfaVerificationCode">Verification code</Label>
                  <Input
                    id="mfaVerificationCode"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                  <p className="text-xs text-muted-foreground">Enter the 6-digit code shown in your authenticator app to finish setup.</p>
                </div>
                <Button type="button" onClick={() => void handleVerify()} disabled={verifying}>
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {verifying ? "Verifying..." : "Verify and activate"}
                </Button>
              </div>
            </div>
          </section>
        ) : null}
      </CardContent>
    </Card>
  );
}

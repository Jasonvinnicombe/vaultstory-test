import type { Metadata } from "next";
import Link from "next/link";
import { Headphones, Mail, ShieldCheck } from "lucide-react";

import { SupportForm } from "@/components/forms/support-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Support | Vault Story",
  description: "Get support for Vault Story, submit a help request, or email support@vaultstory.app.",
};

const supportEmail = "support@vaultstory.app";

const quickTopics = [
  "Invites not showing up after signup",
  "Billing, Premium, or Family plan access",
  "Trouble logging in or confirming email",
  "Vault, entry, or media upload problems",
] as const;

export default function SupportPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-10 xl:grid-cols-[1.08fr_0.76fr]">
        <div className="space-y-8">
          <div className="space-y-5">
            <Badge className="bg-secondary/85">Support</Badge>
            <h1 className="max-w-4xl font-display text-5xl leading-tight text-foreground sm:text-6xl">Need a hand with Vault Story?</h1>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              Send a support request and we will help with account access, invites, billing, missing vaults, uploads, and anything else that feels stuck.
            </p>
          </div>

          <Card className="overflow-hidden border-white/60 bg-card/92 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
            <CardHeader className="space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_16px_30px_rgba(91,60,35,0.22)]">
                <Headphones className="h-5 w-5" />
              </div>
              <CardTitle className="text-3xl sm:text-4xl">Tell us what is happening</CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-7 sm:text-base">
                Fill out the form below and we will send your request to our support inbox. If email sending is temporarily unavailable, you can always contact us directly at <a href={`mailto:${supportEmail}`} className="font-medium text-primary underline-offset-4 hover:underline">{supportEmail}</a>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupportForm />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/15 bg-primary text-primary-foreground shadow-[0_28px_84px_rgba(30,42,68,0.18)]">
            <CardHeader className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <Mail className="h-5 w-5" />
              </div>
              <CardTitle className="text-3xl text-primary-foreground">Prefer direct email?</CardTitle>
              <CardDescription className="text-sm leading-7 text-primary-foreground/75">
                You can email us anytime at the address below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href={`mailto:${supportEmail}`} className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 text-base font-medium text-primary-foreground transition hover:bg-white/14">
                {supportEmail}
              </a>
              <p className="text-sm leading-7 text-primary-foreground/72">
                Include the email address on your account, the vault name if relevant, and a short note about what you expected to happen.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Common reasons people reach out</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickTopics.map((topic) => (
                <div key={topic} className="rounded-[22px] border border-border/70 bg-background/70 px-4 py-3 text-sm leading-7 text-foreground">
                  {topic}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/70 text-secondary-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-2xl">Helpful details to include</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
              <p>The email address you signed in with.</p>
              <p>The vault or entry name if something is missing.</p>
              <p>What you clicked, what happened, and what you expected instead.</p>
              <p>Whether this happened on mobile, desktop, or after following an email link.</p>
              <p>Looking for legal details first? Read the <Link href="/terms" className="font-medium text-primary underline-offset-4 hover:underline">Terms & Conditions</Link>.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

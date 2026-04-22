import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, LockKeyhole, ShieldCheck, TimerReset, UserCheck } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Learn how Vault Story protects private family memory vaults with authentication, access controls, signed media links, billing verification, and planned security improvements.",
  alternates: {
    canonical: "/security",
  },
  openGraph: {
    title: "Vault Story Security",
    description:
      "How Vault Story protects private family memory vaults with authentication, access controls, signed media links, and billing verification.",
    url: `${SITE_URL}/security`,
  },
};

const protections = [
  {
    title: "Authenticated accounts",
    body: "Vault Story uses account-based authentication so vaults and settings are tied to signed-in users rather than public links.",
    icon: UserCheck,
  },
  {
    title: "Private vault access",
    body: "Vaults are designed around owner and invited-member access, so family sharing is intentional rather than public by default.",
    icon: LockKeyhole,
  },
  {
    title: "Signed media links",
    body: "Private media is served through time-limited signed URLs, reducing the risk of long-lived public file exposure.",
    icon: TimerReset,
  },
  {
    title: "Payment verification",
    body: "Stripe checkout and webhook handling are used to verify billing events before membership access is updated.",
    icon: ShieldCheck,
  },
];

const hardening = [
  "Security headers help protect against clickjacking, MIME sniffing, unsafe embedding, and unnecessary browser permissions.",
  "Admin areas require authenticated admin access before user, billing, or storage controls are shown.",
  "Optional multi-factor authentication support is available in account settings for stronger sign-in protection.",
  "Uploads are checked against storage limits so plan boundaries can be enforced before additional media is added.",
];

const roadmap = [
  "Review and document Supabase Row Level Security policies for every customer table.",
  "Add rate limiting to support, upload, and auth-adjacent API routes.",
  "Add admin audit logs for plan changes, storage changes, account deletion, and admin invitations.",
  "Explore client-side encryption for future end-to-end private vault storage.",
];

export default function SecurityPage() {
  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <section className="page-wrap section-space">
          <Card className="overflow-hidden border-white/60 bg-[linear-gradient(135deg,rgba(255,252,247,0.97),rgba(242,233,223,0.92))] shadow-[0_26px_72px_rgba(66,46,31,0.1)]">
            <CardContent className="relative p-8 sm:p-10 lg:p-14">
              <div className="hero-orb absolute right-[-4rem] top-[-2rem] hidden h-48 w-48 rounded-full opacity-60 lg:block" />
              <div className="relative max-w-4xl section-stack">
                <Badge className="w-fit bg-secondary/88">Security</Badge>
                <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  Private family memories deserve careful protection.
                </h1>
                <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Vault Story is built around authenticated access, private vaults, signed media links, and controlled family sharing. Security is an ongoing commitment, so we are clear about what is protected today and what we are continuing to harden.
                </p>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button asChild>
                    <Link href="/signup">Start free</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/privacy">Read privacy policy</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="page-wrap pb-10 sm:pb-14">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {protections.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title} className="glass-panel">
                  <CardContent className="p-7 sm:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/90 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-2xl leading-tight text-foreground">{item.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="page-wrap section-space soft-divider">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(243,236,227,0.82))] shadow-[0_18px_48px_rgba(143,71,43,0.08)]">
              <CardContent className="p-7 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-balance font-display text-3xl leading-tight text-foreground">Security measures in place today</h2>
                <div className="mt-6 space-y-4">
                  {hardening.map((item) => (
                    <div key={item} className="flex gap-3 text-sm leading-7 text-muted-foreground">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(243,236,227,0.82))] shadow-[0_18px_48px_rgba(143,71,43,0.08)]">
              <CardContent className="p-7 sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/90 text-primary">
                  <KeyRound className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-balance font-display text-3xl leading-tight text-foreground">What we are continuing to improve</h2>
                <div className="mt-6 space-y-4">
                  {roadmap.map((item) => (
                    <div key={item} className="flex gap-3 text-sm leading-7 text-muted-foreground">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="page-wrap pb-24 lg:pb-32">
          <Card className="overflow-hidden border-white/60 bg-card/90 shadow-[0_20px_56px_rgba(66,46,31,0.09)]">
            <CardContent className="p-8 sm:p-10 lg:p-12">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Important note</p>
              <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-foreground sm:text-4xl">
                Private storage is not the same as end-to-end encryption.
              </h2>
              <p className="mt-4 max-w-4xl text-base leading-8 text-muted-foreground">
                Vault Story currently focuses on authenticated access, private storage, and signed media links. We do not currently claim that vault contents are end-to-end encrypted in a way that only customer devices can decrypt. That is a future privacy upgrade we are planning carefully because it affects sharing, recovery, and long-term access.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

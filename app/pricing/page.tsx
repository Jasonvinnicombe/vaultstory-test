import Link from "next/link";
import { Check, LockKeyhole, Sparkles, Users, X } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMembershipLabel } from "@/lib/billing";
import { getUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { MEMBERSHIP_PLANS, PLAN_COMPARISON_ROWS } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";

const comparisonPoints = [
  {
    title: "Free is built to create attachment",
    body: "One vault, simple media, and timed delivery are enough to get families emotionally invested before they ever pay.",
    icon: LockKeyhole,
  },
  {
    title: "Premium is the main revenue engine",
    body: "This is where richer media, collaboration and milestone unlocks make the archive feel meaningfully deeper.",
    icon: Sparkles,
  },
  {
    title: "Family is the highest shared-value tier",
    body: "Once multiple relatives are contributing stories, a household plan becomes easier to justify and harder to leave.",
    icon: Users,
  },
];

function renderComparisonValue(value: string) {
  const normalized = value.toLowerCase();

  if (normalized === "included") {
    return (
      <span className="inline-flex items-center gap-2 text-foreground">
        <Check className="h-4 w-4 text-primary" />
        Included
      </span>
    );
  }

  if (normalized === "no") {
    return (
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <X className="h-4 w-4 text-muted-foreground/70" />
        Not included
      </span>
    );
  }

  return <span>{value}</span>;
}

type PricingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PricingPage(props: PricingPageProps) {
  const user = await getUser();
  const searchParams = props.searchParams ? await props.searchParams : {};
  const supabase = user ? await createClient() : null;
  const { data: profile } = user && supabase
    ? await supabase.from("profiles").select("membership_plan").eq("id", user.id).maybeSingle()
    : { data: null };
  const currentPlan = getMembershipLabel(profile?.membership_plan ?? null);
  const billingCanceled = typeof searchParams.billingCanceled === "string" ? searchParams.billingCanceled : null;
  const familyCheckoutEnabled = Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_FAMILY_PRICE_ID);

  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <section className="page-wrap section-space">
          <Card className="overflow-hidden border-white/60 bg-[linear-gradient(135deg,rgba(255,252,247,0.96),rgba(241,235,227,0.92))] shadow-[0_26px_72px_rgba(66,46,31,0.1)]">
            <CardContent className="relative p-8 sm:p-10 lg:p-14">
              <div className="hero-orb absolute right-[-4rem] top-[-2rem] hidden h-48 w-48 rounded-full opacity-60 lg:block" />
              <div className="relative max-w-4xl section-stack">
                <Badge className="w-fit bg-secondary/88">Pricing</Badge>
                <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  Build a pricing ladder that starts with emotion and grows into family value.
                </h1>
                <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Free gets families recording. Premium becomes the main revenue layer. Family expands the household use case when more loved ones start contributing.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild><Link href={user ? "/settings" : "/signup"}>{user ? "Manage membership" : "Start free"}</Link></Button>
                  <Button asChild variant="outline"><Link href="mailto:hello@vaultstory.app?subject=Pricing%20Questions">Talk to us about plans</Link></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {billingCanceled ? (
          <section className="page-wrap pb-2">
            <div className="rounded-[28px] border border-secondary/20 bg-secondary/10 p-5 text-sm leading-7 text-muted-foreground">
              Checkout was canceled, so your plan did not change. You can start again any time.
            </div>
          </section>
        ) : null}

        <section className="mx-auto w-full max-w-[1500px] px-5 pb-8 sm:px-6 sm:pb-12 lg:px-8">
          <PricingPlans currentPlan={currentPlan} isAuthenticated={Boolean(user)} familyCheckoutEnabled={familyCheckoutEnabled} title="Membership plans" description={familyCheckoutEnabled ? "Premium and Family are both ready to run through Stripe. Choose the plan that fits how many people will care for the archive together." : "Premium is live through Stripe today. Family is fully modelled in-product and can be switched on as soon as its Stripe price id is configured."} />
        </section>

        <section className="page-wrap pb-12">
          <Card className="overflow-hidden border-white/60 bg-card/92 shadow-[0_22px_64px_rgba(66,46,31,0.1)]">
            <CardContent className="p-8 sm:p-10 lg:p-12">
              <div className="max-w-4xl section-stack">
                <Badge className="w-fit bg-secondary/85">Plan comparison</Badge>
                <h2 className="text-balance font-display text-4xl sm:text-5xl">Exactly what each package includes.</h2>
                <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                  This is the clearest way to position what people get in each tier. The pricing cards tell the story. This table removes ambiguity.
                </p>
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3 text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">Feature</th>
                      {MEMBERSHIP_PLANS.map((plan) => (
                        <th key={plan.id} className="px-4 py-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">{plan.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PLAN_COMPARISON_ROWS.map((row) => (
                      <tr key={row.label}>
                        <td className="rounded-l-[18px] border border-white/70 bg-white/72 px-4 py-4 font-medium text-foreground">{row.label}</td>
                        {MEMBERSHIP_PLANS.map((plan, index) => (
                          <td
                            key={`${row.label}-${plan.id}`}
                            className={`border border-white/70 bg-white/72 px-4 py-4 text-sm leading-7 text-muted-foreground ${index === MEMBERSHIP_PLANS.length - 1 ? "rounded-r-[18px]" : ""}`}
                          >
                            {renderComparisonValue(row.values[plan.id])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 rounded-[28px] border border-secondary/20 bg-secondary/10 p-5 text-sm leading-7 text-muted-foreground">
                {familyCheckoutEnabled
                  ? "Premium and Family checkout both run through Stripe now, so the pricing table and in-product gates finally tell the same story."
                  : "Premium checkout is live now. Family is already gated correctly in-product and can use the same Stripe flow as soon as its Family price id is configured."}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="page-wrap section-space soft-divider">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {comparisonPoints.map((point) => {
              const Icon = point.icon;
              return (
                <Card key={point.title} className="glass-panel">
                  <CardContent className="p-7 sm:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/90 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-2xl">{point.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{point.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="page-wrap pb-24 lg:pb-32">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(30,42,68,1),rgba(49,63,95,0.96))] text-white shadow-[0_28px_72px_rgba(30,42,68,0.25)]">
            <CardContent className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">Ready to begin</p>
                <h2 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">Start preserving your most important moments today.</h2>
              </div>
              <Button asChild size="lg" variant="secondary">
                <Link href={user ? "/settings" : "/signup"}>{user ? "Manage membership" : "Create Your First Vault"}</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

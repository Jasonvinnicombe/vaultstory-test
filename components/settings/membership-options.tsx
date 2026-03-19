import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";

import { PricingPlans } from "@/components/marketing/pricing-plans";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function MembershipOptions(props: {
  currentPlan?: string | null;
  currentStatus?: string | null;
  billingError?: string | null;
  billingSuccess?: string | null;
}) {
  const hasBillingSuccess = props.billingSuccess === "1";

  return (
    <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_26px_80px_rgba(66,46,31,0.12)]">
      <CardContent className="p-7 sm:p-9">
        <div className="section-stack">
          <Badge className="w-fit bg-secondary/85">Membership</Badge>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="section-stack max-w-3xl">
              <h2 className="font-display text-3xl sm:text-4xl">Choose how your family archive grows.</h2>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                Premium checkout is live now. Family and Lifetime are mapped out as the next expansion tiers so your membership area already reflects the bigger roadmap.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/pricing"><Crown className="h-4 w-4" />View full pricing</Link>
            </Button>
          </div>
        </div>

        {hasBillingSuccess ? (
          <div className="mt-6 rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 text-sm leading-7 text-emerald-900">
            Premium is active. Stripe finished successfully and your plan will refresh here as soon as the webhook lands.
          </div>
        ) : null}

        {props.billingError ? (
          <div className="mt-6 rounded-[28px] border border-destructive/20 bg-destructive/10 p-5 text-sm leading-7 text-destructive">
            {props.billingError}
          </div>
        ) : null}

        <div className="mt-8 rounded-[28px] border border-secondary/20 bg-secondary/10 p-5 text-sm leading-7 text-muted-foreground">
          <p className="inline-flex items-center gap-2 font-medium text-foreground"><Sparkles className="h-4 w-4 text-primary" />Current membership</p>
          <p className="mt-2">
            You are currently on <strong className="text-foreground">{props.currentPlan ?? "Free"}</strong>
            {props.currentStatus ? <> with a status of <strong className="text-foreground">{props.currentStatus.replaceAll("_", " ")}</strong></> : null}.
          </p>
          <p className="mt-3">
            Today, Stripe is wired for Premium first. Family and Lifetime can now be marketed, waitlisted, or launched next without rethinking the pricing structure.
          </p>
        </div>

        <div className="mt-8">
          <PricingPlans
            compact
            currentPlan={props.currentPlan ?? "Free"}
            isAuthenticated
            title="Membership options"
            description="Start free, upgrade to Premium through Stripe today, and use the Family and Lifetime tiers as the next revenue layers in the roadmap."
          />
        </div>
      </CardContent>
    </Card>
  );
}
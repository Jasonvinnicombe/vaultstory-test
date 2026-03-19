import { Check, Sparkles } from "lucide-react";

import { PlanActionButton } from "@/components/billing/plan-action-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MEMBERSHIP_PLANS } from "@/lib/pricing";

export function PricingPlans(props: {
  title?: string;
  description?: string;
  compact?: boolean;
  currentPlan?: string | null;
  isAuthenticated?: boolean;
}) {
  const title = props.title ?? "Choose the membership that fits how your family preserves memories.";
  const description = props.description ?? "Start free, then move up when you want richer media, milestone unlocks, and shared family access.";

  return (
    <div className="space-y-8">
      <div className="max-w-3xl section-stack">
        <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Membership options</p>
        <h2 className="text-balance font-display text-4xl sm:text-5xl">{title}</h2>
        <p className="text-base leading-8 text-muted-foreground sm:text-lg">{description}</p>
      </div>

      <div className={`grid gap-5 ${props.compact ? "xl:grid-cols-2" : "xl:grid-cols-2 2xl:grid-cols-4"}`}>
        {MEMBERSHIP_PLANS.map((plan) => {
          const isCurrent = props.currentPlan?.toLowerCase() === plan.name.toLowerCase();

          return (
            <Card
              key={plan.id}
              className={plan.highlight
                ? "overflow-hidden border-primary/18 bg-[linear-gradient(180deg,rgba(30,42,68,0.98),rgba(49,63,95,0.94))] text-white shadow-[0_26px_72px_rgba(30,42,68,0.22)]"
                : "overflow-hidden border-white/65 bg-card/88 shadow-[0_20px_56px_rgba(66,46,31,0.09)]"
              }
            >
              <CardContent className="p-7 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className={`font-display text-3xl ${plan.highlight ? "text-white" : "text-foreground"}`}>{plan.name}</h3>
                      {plan.badge ? <Badge className={plan.highlight ? "bg-secondary text-secondary-foreground" : "bg-secondary/80"}>{plan.badge}</Badge> : null}
                      {isCurrent ? <Badge variant="outline" className={plan.highlight ? "border-white/25 text-white" : "border-primary/20 text-primary"}>Current</Badge> : null}
                    </div>
                    <p className={plan.highlight ? "text-white/78" : "text-muted-foreground"}>{plan.description}</p>
                  </div>
                  {plan.highlight ? <Sparkles className="h-5 w-5 text-secondary" /> : null}
                </div>

                <div className="mt-8 flex items-end gap-2">
                  <span className={`font-display text-5xl ${plan.highlight ? "text-white" : "text-foreground"}`}>{plan.priceLabel}</span>
                  <span className={plan.highlight ? "pb-1 text-white/62" : "pb-1 text-muted-foreground"}>{plan.cadence}</span>
                </div>
                {plan.annualLabel ? (
                  <p className={`mt-2 text-sm ${plan.highlight ? "text-white/88" : "text-muted-foreground"}`}>{plan.annualLabel}</p>
                ) : null}

                <div className={`mt-8 rounded-[24px] p-4 text-sm leading-7 ${plan.highlight ? "border border-white/18 bg-white/8 text-white/88" : "border border-secondary/20 bg-secondary/10 text-muted-foreground"}`}>
                  <p className={`font-medium ${plan.highlight ? "text-white" : "text-foreground"}`}>This plan includes:</p>
                  <div className="mt-3 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <span className={plan.highlight ? "mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/12 text-secondary" : "mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary/18 text-primary"}>
                          <Check className="h-4 w-4" />
                        </span>
                        <span className={plan.highlight ? "text-white" : "text-foreground/82"}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <PlanActionButton
                  planId={plan.id}
                  ctaLabel={plan.ctaLabel}
                  ctaHref={plan.ctaHref}
                  isCurrent={isCurrent}
                  isAuthenticated={props.isAuthenticated ?? false}
                  highlight={plan.highlight}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
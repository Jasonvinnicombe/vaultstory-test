import Link from "next/link";

import { createBillingPortalSessionAction, createCheckoutSessionAction } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function PlanActionButton(props: {
  planId: "free" | "premium" | "family" | "lifetime";
  ctaLabel: string;
  ctaHref: string;
  isCurrent: boolean;
  isAuthenticated: boolean;
  highlight?: boolean;
  checkoutEnabled?: boolean;
}) {
  const variant = props.highlight ? "secondary" : "default";
  const isStripePlan = props.planId === "premium" || props.planId === "family";

  if (isStripePlan) {
    if (props.isCurrent) {
      return (
        <form action={createBillingPortalSessionAction}>
          <Button className="mt-8 w-full" variant={variant}>
            Manage billing
          </Button>
        </form>
      );
    }

    if (props.isAuthenticated && props.checkoutEnabled) {
      return (
        <form action={createCheckoutSessionAction}>
          <input type="hidden" name="planId" value={props.planId} />
          <Button className="mt-8 w-full" variant={variant}>
            {props.ctaLabel}
          </Button>
        </form>
      );
    }
  }

  if (props.isCurrent) {
    return (
      <Button className="mt-8 w-full" variant={variant} disabled>
        Current plan
      </Button>
    );
  }

  return (
    <Button asChild className="mt-8 w-full" variant={variant}>
      <Link href={props.ctaHref}>{props.ctaLabel}</Link>
    </Button>
  );
}

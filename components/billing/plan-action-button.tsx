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
}) {
  const variant = props.highlight ? "secondary" : "default";

  if (props.planId === "premium") {
    if (props.isCurrent) {
      return (
        <form action={createBillingPortalSessionAction}>
          <Button className="mt-8 w-full" variant={variant}>
            Manage billing
          </Button>
        </form>
      );
    }

    if (props.isAuthenticated) {
      return (
        <form action={createCheckoutSessionAction}>
          <Button className="mt-8 w-full" variant={variant}>
            {props.ctaLabel}
          </Button>
        </form>
      );
    }

    return (
      <Button asChild className="mt-8 w-full" variant={variant}>
        <Link href={props.ctaHref}>{props.ctaLabel}</Link>
      </Button>
    );
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
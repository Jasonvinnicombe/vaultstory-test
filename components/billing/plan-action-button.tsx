"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import type { PluginListenerHandle } from "@capacitor/core";

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
  currency?: string;
}) {
  const [isNativeApp, setIsNativeApp] = useState(false);
  const [nativeLoading, setNativeLoading] = useState(false);
  const [nativeError, setNativeError] = useState<string | null>(null);
  const variant = props.highlight ? "secondary" : "default";
  const isStripePlan = props.planId === "premium" || props.planId === "family";

  useEffect(() => {
    setIsNativeApp(Capacitor.isNativePlatform());
  }, []);

  async function openNativeBilling(kind: "checkout" | "portal") {
    setNativeError(null);
    setNativeLoading(true);
    let listener: PluginListenerHandle | undefined;

    try {
      const response = await fetch(kind === "checkout" ? "/api/mobile-billing/checkout" : "/api/mobile-billing/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:
          kind === "checkout"
            ? JSON.stringify({ planId: props.planId, currency: props.currency ?? null })
            : undefined,
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to open billing right now.");
      }

      listener = await App.addListener("appUrlOpen", async ({ url }) => {
        if (!url?.startsWith("app.vaultstory.mobile://billing-return")) {
          return;
        }

        await Browser.close();
        await listener?.remove();
      });

      await Browser.open({
        url: data.url,
        presentationStyle: "fullscreen",
      });
      await listener.remove();
      listener = undefined;
    } catch (error) {
      if (listener) {
        await listener.remove();
        listener = undefined;
      }

      setNativeError(error instanceof Error ? error.message : "Unable to open billing right now.");
    } finally {
      setNativeLoading(false);
    }
  }

  if (isStripePlan) {
    if (isNativeApp && props.isAuthenticated) {
      if (props.isCurrent) {
        return (
          <div className="space-y-3">
            <Button className="mt-8 w-full" variant={variant} type="button" disabled={nativeLoading} onClick={() => void openNativeBilling("portal")}>
              {nativeLoading ? "Opening billing..." : "Manage billing"}
            </Button>
            {nativeError ? <p className={`text-sm ${props.highlight ? "text-white" : "text-destructive"}`}>{nativeError}</p> : null}
          </div>
        );
      }

      if (props.checkoutEnabled) {
        return (
          <div className="space-y-3">
            <Button className="mt-8 w-full" variant={variant} type="button" disabled={nativeLoading} onClick={() => void openNativeBilling("checkout")}>
              {nativeLoading ? "Opening secure checkout..." : props.ctaLabel}
            </Button>
            {nativeError ? <p className={`text-sm ${props.highlight ? "text-white" : "text-destructive"}`}>{nativeError}</p> : null}
          </div>
        );
      }
    }

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
          {props.currency ? <input type="hidden" name="currency" value={props.currency} /> : null}
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

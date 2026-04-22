import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, HeartHandshake, Gem, ShieldCheck, Users } from "lucide-react";
import type { Metadata } from "next";

import { createCheckoutSessionAction } from "@/app/actions";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getUser } from "@/lib/auth";
import { getCurrencyFromHeaders } from "@/lib/currency";
import { createStripeCheckoutUrl } from "@/lib/mobile-billing";
import { SITE_URL } from "@/lib/site";
import { getPlanPriceDisplay, getStripePriceId } from "@/lib/stripe-pricing";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Founder Offer | Lifetime Family Vault Access",
  description:
    "Claim the limited-time Vault Story founder offer: lifetime family vault access for a one-time payment with a 50GB storage cap.",
  alternates: {
    canonical: "/founder-offer",
  },
  openGraph: {
    title: "Vault Story Founder Offer",
    description:
      "Limited-time lifetime family vault access for a one-time payment with a 50GB storage cap.",
    url: `${SITE_URL}/founder-offer`,
  },
};

const founderPoints = [
  {
    title: "One-time founder price",
    body: "Secure lifetime family vault access for a single one-time payment of $99.",
    icon: Gem,
  },
  {
    title: "Family access included",
    body: "Invite up to 6 family members so the right people can help care for what matters most.",
    icon: Users,
  },
  {
    title: "Clear founder terms",
    body: "Includes lifetime founder access with a 50GB storage cap, available for a limited time.",
    icon: ShieldCheck,
  },
];

type FounderOfferSearchParams = Record<string, string | string[] | undefined>;

function getSearchValue(value: string | string[] | undefined) {
  return typeof value === "string" ? value : null;
}

export default async function FounderOfferPage(props: {
  searchParams?: Promise<FounderOfferSearchParams>;
}) {
  const user = await getUser();
  const isAuthenticated = Boolean(user);
  const [requestHeaders, searchParams] = await Promise.all([
    headers(),
    props.searchParams ?? Promise.resolve({}),
  ]);
  const detectedCurrency = getCurrencyFromHeaders(requestHeaders, null);
  const founderDisplay = await getPlanPriceDisplay("lifetime", detectedCurrency);
  const founderCheckoutEnabled = Boolean(getStripePriceId("lifetime", detectedCurrency));
  const autoCheckout = getSearchValue(searchParams.checkout) === "1";
  const billingCanceled = getSearchValue(searchParams.billingCanceled) === "1";
  const billingError = getSearchValue(searchParams.billingError);
  const founderAuthNext = "/founder-offer?checkout=1";

  if (user && founderCheckoutEnabled && autoCheckout && !billingCanceled && !billingError) {
    const checkoutUrl = await createStripeCheckoutUrl({
      user,
      planId: "lifetime",
      currency: detectedCurrency,
      returnMode: "web",
      webCancelPath: "/founder-offer",
    });
    redirect(checkoutUrl);
  }

  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <section className="page-wrap section-space">
          <Card className="overflow-hidden border-white/60 bg-[linear-gradient(135deg,rgba(255,252,247,0.97),rgba(242,233,223,0.94))] shadow-[0_26px_72px_rgba(66,46,31,0.1)]">
            <CardContent className="relative p-8 sm:p-10 lg:p-14">
              <div className="hero-orb absolute right-[-4rem] top-[-2rem] hidden h-48 w-48 rounded-full opacity-60 lg:block" />
              <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div className="space-y-6">
                  <Badge className="w-fit bg-secondary/88">Founder offer</Badge>
                  <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                    Lifetime family vault access for a one-time $99.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                    A special founder offer for families who want one private place to preserve memories, invite loved ones, and keep meaningful stories safe for the future.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {founderPoints.map((point) => {
                      const Icon = point.icon;

                      return (
                        <div
                          key={point.title}
                          className="rounded-[26px] border border-white/70 bg-white/76 p-5 shadow-[0_16px_34px_rgba(143,71,43,0.08)]"
                        >
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/20 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <h2 className="mt-4 text-lg font-semibold text-foreground">{point.title}</h2>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">{point.body}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Card className="overflow-hidden border-[#e7d4c6] bg-[linear-gradient(180deg,rgba(255,250,245,0.98),rgba(247,239,230,0.96))] shadow-[0_24px_64px_rgba(143,71,43,0.12)]">
                  <CardContent className="space-y-6 p-7 sm:p-8">
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-primary/80">Founder offer</p>
                      <div className="flex items-end gap-3">
                        <span className="font-display text-6xl leading-none text-foreground">
                          {founderDisplay?.priceLabel ?? "$99"}
                        </span>
                        <span className="pb-2 text-base text-muted-foreground">{founderDisplay?.cadence ?? "one-time"}</span>
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">
                        Claim lifetime family vault access with a single payment and start building a shared archive designed to last.
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-[#ecd8cb] bg-white/80 p-5">
                      <p className="text-sm font-semibold text-foreground">What happens next</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {isAuthenticated
                          ? "You are signed in, so you can continue straight to the founder checkout from here."
                          : "Create your account to lock in the founder offer, or log in if you already have one and want to continue with checkout."}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {isAuthenticated ? (
                        <>
                          {founderCheckoutEnabled ? (
                            <form action={createCheckoutSessionAction}>
                              <input type="hidden" name="planId" value="lifetime" />
                              <input type="hidden" name="currency" value={detectedCurrency} />
                              <input type="hidden" name="cancelPath" value="/founder-offer" />
                              <input type="hidden" name="errorPath" value="/founder-offer" />
                              <Button className="h-12 w-full">
                                Continue to founder checkout
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </form>
                          ) : (
                            <Button className="h-12 w-full" disabled>
                              Founder checkout coming soon
                            </Button>
                          )}
                          <Button asChild variant="outline" className="h-12 w-full">
                            <Link href="/dashboard">Back to dashboard</Link>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button asChild className="h-12 w-full">
                            <Link href={`/signup?plan=lifetime&next=${encodeURIComponent(founderAuthNext)}`}>
                              Create account to claim founder offer
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="h-12 w-full">
                            <Link href={`/login?next=${encodeURIComponent(founderAuthNext)}`}>Already have an account? Log in</Link>
                          </Button>
                        </>
                      )}
                    </div>

                    <div className="rounded-[24px] bg-primary/7 px-4 py-4 text-sm leading-7 text-muted-foreground">
                      <p className="inline-flex items-center gap-2 font-medium text-foreground">
                        <HeartHandshake className="h-4 w-4 text-primary" />
                        Why families choose this offer
                      </p>
                      <p className="mt-2">
                        It is a simple way to secure family access for the long term, without ongoing monthly fees, while keeping the archive intentionally sized.
                      </p>
                    </div>

                    <p className="text-center text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Limited time offer. T&amp;C&apos;s apply.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

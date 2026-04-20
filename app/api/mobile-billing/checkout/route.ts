import { NextResponse } from "next/server";

import { createStripeCheckoutUrl } from "@/lib/mobile-billing";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in again before starting checkout." }, { status: 401 });
    }

    const body = (await request.json()) as { planId?: string; currency?: string | null };
    const planId = body.planId === "family" ? "family" : body.planId === "lifetime" ? "lifetime" : "premium";
    const url = await createStripeCheckoutUrl({
      user,
      planId,
      currency: body.currency ?? null,
      returnMode: "app",
    });

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start Stripe checkout.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

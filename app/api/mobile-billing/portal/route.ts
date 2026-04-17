import { NextResponse } from "next/server";

import { createStripeBillingPortalUrl } from "@/lib/mobile-billing";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in again before opening billing." }, { status: 401 });
    }

    const url = await createStripeBillingPortalUrl({
      userId: user.id,
      returnMode: "app",
    });

    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to open Stripe billing portal.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

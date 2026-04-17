import { NextRequest, NextResponse } from "next/server";

import { getAppUrl } from "@/lib/app-url";
import { createClient } from "@/lib/supabase/server";

function shouldUseRequestOrigin(origin: string) {
  return /localhost|127\.0\.0\.1|10\.0\.2\.2/i.test(origin);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = requestUrl.searchParams.get("next") || "/dashboard";
  const safeNextPath = nextPath.startsWith("/") ? nextPath : "/dashboard";
  let appUrl = requestUrl.origin;

  if (!shouldUseRequestOrigin(requestUrl.origin)) {
    try {
      appUrl = getAppUrl();
    } catch {
      appUrl = requestUrl.origin;
    }
  }

  if (!code) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Unable to complete sign in. Please try again.")}`, appUrl),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, appUrl));
  }

  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (data?.nextLevel === "aal2" && data.currentLevel !== "aal2") {
    const mfaUrl = new URL("/auth/mfa", appUrl);
    mfaUrl.searchParams.set("next", safeNextPath);
    return NextResponse.redirect(mfaUrl);
  }

  return NextResponse.redirect(new URL(safeNextPath, appUrl));
}

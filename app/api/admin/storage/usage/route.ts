import { NextResponse } from "next/server";

import { getEffectiveStorageQuotaGb, getMembershipLabel } from "@/lib/billing";
import { getTotalStorageUsageBytes } from "@/lib/storage";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const CACHE_TTL_MS = 5 * 60 * 1000;
const usageCache = new Map<string, { timestamp: number; payload: { allowed: boolean; quotaGb: number; usedBytes: number; label: string } }>();

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ allowed: false, message: "Please log in again." }, { status: 401 });
    }

    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (!adminProfile?.is_admin) {
      return NextResponse.json({ allowed: false, message: "Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId") ?? "";

    if (!targetUserId) {
      return NextResponse.json({ allowed: false, message: "Missing user id." }, { status: 400 });
    }

    const cached = usageCache.get(targetUserId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(cached.payload, {
        headers: { "Cache-Control": "private, max-age=300" },
      });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("membership_plan,membership_status,storage_quota_gb")
      .eq("id", targetUserId)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    const quotaGb = getEffectiveStorageQuotaGb(profile?.membership_plan, profile?.membership_status, profile?.storage_quota_gb);
    const usedBytes = await getTotalStorageUsageBytes(targetUserId);

    const payload = {
      allowed: true,
      quotaGb,
      usedBytes,
      label: getMembershipLabel(profile?.membership_plan),
    };

    usageCache.set(targetUserId, { timestamp: Date.now(), payload });

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "private, max-age=300" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load storage usage.";
    return NextResponse.json({ allowed: false, message }, { status: 500 });
  }
}

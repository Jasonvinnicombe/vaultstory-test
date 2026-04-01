import { NextResponse } from "next/server";

import { getEffectiveStorageQuotaGb, getMembershipLabel } from "@/lib/billing";
import { getTotalStorageUsageBytes } from "@/lib/storage";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ allowed: false, message: "Please log in again before uploading files." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const additionalBytesRaw = typeof body?.additionalBytes === "number" ? body.additionalBytes : Number(body?.additionalBytes ?? 0);
    const additionalBytes = Number.isFinite(additionalBytesRaw) && additionalBytesRaw > 0 ? additionalBytesRaw : 0;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("membership_plan,membership_status,storage_quota_gb")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    const quotaGb = getEffectiveStorageQuotaGb(profile?.membership_plan, profile?.membership_status, profile?.storage_quota_gb);
    if (!Number.isFinite(quotaGb)) {
      return NextResponse.json({ allowed: true, quotaGb, usedBytes: 0 });
    }

    const usedBytes = await getTotalStorageUsageBytes(user.id);
    const quotaBytes = quotaGb * 1024 * 1024 * 1024;

    if (usedBytes + additionalBytes > quotaBytes) {
      return NextResponse.json(
        {
          allowed: false,
          message: `${getMembershipLabel(profile?.membership_plan)} includes ${quotaGb}GB of storage. Free up space or upgrade before uploading more.`,
          quotaGb,
          usedBytes,
        },
        { status: 403 },
      );
    }

    return NextResponse.json({ allowed: true, quotaGb, usedBytes });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify storage quota.";
    return NextResponse.json({ allowed: false, message }, { status: 500 });
  }
}

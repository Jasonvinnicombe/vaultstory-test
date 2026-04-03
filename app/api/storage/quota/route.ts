import { NextResponse } from "next/server";

import { formatDowngradeGraceDate, getEffectiveStorageQuotaGb, getMembershipLabel, isWithinDowngradeGrace } from "@/lib/billing";
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
      .select("membership_plan,membership_status,storage_quota_gb,downgrade_grace_until")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    const typedProfile = profile as {
      membership_plan?: string | null;
      membership_status?: string | null;
      storage_quota_gb?: number | null;
      downgrade_grace_until?: string | null;
    } | null;
    const quotaGb = getEffectiveStorageQuotaGb(typedProfile?.membership_plan, typedProfile?.membership_status, typedProfile?.storage_quota_gb);
    if (!Number.isFinite(quotaGb)) {
      return NextResponse.json({ allowed: true, quotaGb, usedBytes: 0, inDowngradeGrace: false });
    }

    const usedBytes = await getTotalStorageUsageBytes(user.id);
    const quotaBytes = quotaGb * 1024 * 1024 * 1024;
    const inDowngradeGrace = isWithinDowngradeGrace(typedProfile?.downgrade_grace_until);
    const overQuota = usedBytes > quotaBytes;
    const wouldExceedQuota = usedBytes + additionalBytes > quotaBytes;

    if (wouldExceedQuota) {
      const graceDate = formatDowngradeGraceDate(typedProfile?.downgrade_grace_until);
      const baseMessage = `${getMembershipLabel(typedProfile?.membership_plan)} includes ${quotaGb}GB of storage. Free up space or upgrade before uploading more.`;
      const message = overQuota && graceDate
        ? inDowngradeGrace
          ? `Your paid plan has ended and you are above the free storage limit. Delete files or resume your subscription by ${graceDate} to get back under ${quotaGb}GB.`
          : `Your downgrade grace period ended on ${graceDate}. Delete files or resume your subscription to get back under ${quotaGb}GB before uploading more.`
        : baseMessage;

      return NextResponse.json({
        allowed: false,
        message,
        quotaGb,
        usedBytes,
        overQuota,
        inDowngradeGrace,
        downgradeGraceUntil: typedProfile?.downgrade_grace_until ?? null,
      });
    }

    return NextResponse.json({
      allowed: true,
      quotaGb,
      usedBytes,
      overQuota,
      inDowngradeGrace,
      downgradeGraceUntil: typedProfile?.downgrade_grace_until ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify storage quota.";
    return NextResponse.json({ allowed: false, message }, { status: 500 });
  }
}
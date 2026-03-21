import { NextResponse } from "next/server";

import { getEffectiveStorageQuotaGb, getMembershipLabel } from "@/lib/billing";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const STORAGE_BUCKETS = ["avatars", "vault-covers", "entry-assets"];
const STORAGE_PAGE_SIZE = 100;

type StorageListFile = {
  id?: string;
  name?: string;
  metadata?: unknown;
};

function extractObjectSizeBytes(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") {
    return 0;
  }

  const rawSize = (metadata as { size?: number | string }).size;
  const size = typeof rawSize === "string" ? Number.parseInt(rawSize, 10) : rawSize;
  return typeof size === "number" && Number.isFinite(size) && size > 0 ? size : 0;
}

async function getBucketUsageBytes(bucketId: string, userId: string) {
  let usedBytes = 0;
  let offset = 0;

  while (true) {
    const { data, error } = await supabaseAdmin.storage.from(bucketId).list(userId, {
      limit: STORAGE_PAGE_SIZE,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      throw new Error(error.message);
    }

    const files = (data ?? []) as StorageListFile[];
    usedBytes += files.reduce((total, file) => total + extractObjectSizeBytes(file.metadata), 0);

    if (files.length < STORAGE_PAGE_SIZE) {
      break;
    }

    offset += STORAGE_PAGE_SIZE;
  }

  return usedBytes;
}

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

    const usedBytesByBucket = await Promise.all(STORAGE_BUCKETS.map((bucketId) => getBucketUsageBytes(bucketId, user.id)));
    const usedBytes = usedBytesByBucket.reduce((total, bytes) => total + bytes, 0);
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

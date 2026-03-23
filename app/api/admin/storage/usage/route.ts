import { NextResponse } from "next/server";

import { getEffectiveStorageQuotaGb, getMembershipLabel } from "@/lib/billing";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const STORAGE_BUCKETS = ["avatars", "vault-covers", "entry-assets"];
const STORAGE_PAGE_SIZE = 100;
const CACHE_TTL_MS = 5 * 60 * 1000;
const usageCache = new Map<string, { timestamp: number; payload: { allowed: boolean; quotaGb: number; usedBytes: number; label: string } }>();

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
  async function listFolderBytes(prefix: string) {
    let usedBytes = 0;
    let offset = 0;

    while (true) {
      const { data, error } = await supabaseAdmin.storage.from(bucketId).list(prefix, {
        limit: STORAGE_PAGE_SIZE,
        offset,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) {
        throw new Error(error.message);
      }

      const files = (data ?? []) as StorageListFile[];

      for (const file of files) {
        const size = extractObjectSizeBytes(file.metadata);
        if (size > 0) {
          usedBytes += size;
          continue;
        }

        if (file.id == null && file.name) {
          const nestedPrefix = `${prefix}/${file.name}`;
          usedBytes += await listFolderBytes(nestedPrefix);
        }
      }

      if (files.length < STORAGE_PAGE_SIZE) {
        break;
      }

      offset += STORAGE_PAGE_SIZE;
    }

    return usedBytes;
  }

  return listFolderBytes(userId);
}

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
    const usedBytesByBucket = await Promise.all(STORAGE_BUCKETS.map((bucketId) => getBucketUsageBytes(bucketId, targetUserId)));
    const usedBytes = usedBytesByBucket.reduce((total, bytes) => total + bytes, 0);

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

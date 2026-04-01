import { createSignedR2ObjectUrl, deleteR2Object, getPublicR2ObjectUrl, isR2Configured, isR2ObjectKey, listR2PrefixBytes } from "@/lib/r2";
import { supabaseAdmin } from "@/lib/supabase/admin";

const STORAGE_BUCKETS = ["avatars", "vault-covers", "entry-assets"] as const;
const STORAGE_PAGE_SIZE = 100;

type StorageListFile = {
  id?: string;
  name?: string;
  size?: number | string;
  metadata?: unknown;
};

function extractObjectSizeBytes(file: StorageListFile) {
  const candidates: unknown[] = [];

  if (file.size != null) {
    candidates.push(file.size);
  }

  if (file.metadata && typeof file.metadata === "object") {
    const meta = file.metadata as Record<string, unknown>;
    candidates.push(meta.size, meta.contentLength, meta["content-length"], meta.length, meta.fileSize);
  }

  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number.parseInt(value, 10);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }

  return 0;
}

async function getLegacySupabaseBucketUsageBytes(bucketId: string, userId: string) {
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
        const size = extractObjectSizeBytes(file);
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

export async function getStorageObjectUrl(path: string | null | undefined, options: {
  bucket: typeof STORAGE_BUCKETS[number];
  expiresIn?: number;
  publicUrl?: boolean;
}) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (isR2ObjectKey(path) && isR2Configured()) {
    if (options.publicUrl) {
      return getPublicR2ObjectUrl(path) ?? createSignedR2ObjectUrl(path, options.expiresIn);
    }

    return createSignedR2ObjectUrl(path, options.expiresIn);
  }

  const { data, error } = await supabaseAdmin.storage
    .from(options.bucket)
    .createSignedUrl(path, options.expiresIn ?? 60 * 10);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}

export async function deleteStorageObject(path: string | null | undefined, options: { bucket: typeof STORAGE_BUCKETS[number] }) {
  if (!path || /^https?:\/\//i.test(path)) {
    return;
  }

  if (isR2ObjectKey(path) && isR2Configured()) {
    await deleteR2Object(path);
    return;
  }

  await supabaseAdmin.storage.from(options.bucket).remove([path]);
}

export async function getTotalStorageUsageBytes(userId: string) {
  const usageByBucket = await Promise.all(
    STORAGE_BUCKETS.map(async (bucketId) => {
      const legacyBytes = await getLegacySupabaseBucketUsageBytes(bucketId, userId);
      const r2Bytes = isR2Configured() ? await listR2PrefixBytes(`${bucketId}/${userId}/`) : 0;
      return legacyBytes + r2Bytes;
    }),
  );

  return usageByBucket.reduce((total, bytes) => total + bytes, 0);
}

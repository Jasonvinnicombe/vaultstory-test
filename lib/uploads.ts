import {
  ACCEPTED_AUDIO_TYPES,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  FILE_LIMITS,
} from "@/lib/constants";

type StorageCapableClient = {
  storage: {
    from: (bucket: string) => {
      upload: (path: string, file: File, options: { cacheControl: string; upsert: boolean }) => Promise<{ data: { path: string } | null; error: { message: string } | null }>;
    };
  };
};

async function assertStorageQuota(additionalBytes: number) {
  if (typeof window === "undefined") {
    return;
  }

  const response = await fetch("/api/storage/quota", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ additionalBytes }),
  });

  const payload = await response.json().catch(() => null) as { allowed?: boolean; message?: string } | null;

  if (!response.ok || payload?.allowed === false) {
    throw new Error(payload?.message ?? "This upload would exceed your storage allowance.");
  }
}

export function validateAsset(file: File, kind: "cover" | "photo" | "audio" | "video") {
  if (kind === "cover" || kind === "photo") {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("Images must be JPG, PNG, or WebP");
    }
    if (file.size > FILE_LIMITS.image) {
      throw new Error("Image is too large. Maximum size is 10MB.");
    }
  }

  if (kind === "audio") {
    if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
      throw new Error("Audio must be MP3, WAV, M4A, or WebM");
    }
    if (file.size > FILE_LIMITS.audio) {
      throw new Error("Audio file is too large. Maximum size is 25MB.");
    }
  }

  if (kind === "video") {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      throw new Error("Video must be MP4, MOV, or WebM");
    }
    if (file.size > FILE_LIMITS.video) {
      throw new Error("Video file is too large. Maximum size is 20GB.");
    }
  }
}

export function getAssetKind(file: File): "photo" | "audio" | "video" {
  if (ACCEPTED_IMAGE_TYPES.includes(file.type)) return "photo";
  if (ACCEPTED_AUDIO_TYPES.includes(file.type)) return "audio";
  if (ACCEPTED_VIDEO_TYPES.includes(file.type)) return "video";
  throw new Error("Unsupported file type.");
}

export async function uploadFileToBucket(params: {
  supabase: StorageCapableClient;
  bucket: string;
  file: File;
  path: string;
}) {
  await assertStorageQuota(params.file.size);

  const { data, error } = await params.supabase.storage.from(params.bucket).upload(params.path, params.file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error || !data) {
    const rawMessage = error?.message ?? "Upload failed.";
    const looksLikeSizeLimit = /maximum allowed size|too large|exceeds|size/i.test(rawMessage);
    if (looksLikeSizeLimit) {
      throw new Error("That file is larger than the upload limit. Try a smaller file or compress it.");
    }
    throw new Error(rawMessage);
  }

  return {
    path: data.path,
  };
}

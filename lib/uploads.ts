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

export function validateAsset(file: File, kind: "cover" | "photo" | "audio" | "video") {
  if (kind === "cover" || kind === "photo") {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("Images must be JPG, PNG, or WebP");
    }
    if (file.size > FILE_LIMITS.image) {
      throw new Error("Images must be 10MB or smaller");
    }
  }

  if (kind === "audio") {
    if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
      throw new Error("Audio must be MP3, WAV, M4A, or WebM");
    }
    if (file.size > FILE_LIMITS.audio) {
      throw new Error("Audio files must be 25MB or smaller");
    }
  }

  if (kind === "video") {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      throw new Error("Video must be MP4, MOV, or WebM");
    }
    if (file.size > FILE_LIMITS.video) {
      throw new Error("Video files must be 10GB or smaller");
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
  const { data, error } = await params.supabase.storage.from(params.bucket).upload(params.path, params.file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error || !data) {
    throw new Error(error?.message ?? "Upload failed.");
  }

  return {
    path: data.path,
  };
}

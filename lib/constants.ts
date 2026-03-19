export const VAULT_TYPES = [
  { value: "self", label: "Self" },
  { value: "child", label: "Child" },
  { value: "partner", label: "Partner" },
  { value: "family", label: "Family" },
] as const;

export const MEMBER_ROLES = [
  { value: "owner", label: "Owner" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
] as const;

export const ENTRY_TYPES = [
  { value: "text", label: "Text letter" },
  { value: "photo", label: "Photo upload" },
  { value: "audio", label: "Audio note" },
  { value: "video", label: "Video upload" },
  { value: "bundle", label: "Mixed memory bundle" },
] as const;

export const UNLOCK_TYPES = [
  { value: "date", label: "Exact date" },
  { value: "age_milestone", label: "Age milestone" },
  { value: "relative_duration", label: "Relative duration" },
  { value: "manual_milestone", label: "Manual milestone" },
  { value: "draft", label: "Save as draft" },
] as const;

export const RELATIVE_UNITS = [
  { value: "months", label: "Months" },
  { value: "years", label: "Years" },
] as const;

export const MOODS = [
  "Hopeful",
  "Curious",
  "Tender",
  "Ambitious",
  "Grateful",
  "Restless",
  "Grounded",
] as const;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_AUDIO_TYPES = ["audio/mpeg", "audio/mp4", "audio/wav", "audio/webm"];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export const FILE_LIMITS = {
  image: 10 * 1024 * 1024,
  audio: 25 * 1024 * 1024,
  video: 10 * 1024 * 1024 * 1024,
};

export const UPCOMING_UNLOCK_WINDOW_DAYS = 30;

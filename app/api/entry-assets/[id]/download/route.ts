import path from "node:path";

import { NextRequest } from "next/server";

import { hasPaidFeatureAccess } from "@/lib/billing";
import { getEntryStatus } from "@/lib/entries";
import { getStorageObjectUrl } from "@/lib/storage";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function sanitizeBaseName(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return cleaned || "vault-story-memory";
}

function inferExtension(filePath: string, contentType: string | null, fileType: string) {
  const rawExt = path.extname(filePath || "").replace(/^\./, "").toLowerCase();
  if (rawExt) {
    return rawExt;
  }

  const normalizedType = (contentType || fileType || "").toLowerCase();
  if (normalizedType.includes("jpeg") || normalizedType.includes("jpg")) return "jpg";
  if (normalizedType.includes("png")) return "png";
  if (normalizedType.includes("webp")) return "webp";
  if (normalizedType.includes("gif")) return "gif";
  if (normalizedType.includes("mp4")) return "mp4";
  if (normalizedType.includes("quicktime") || normalizedType.includes("mov")) return "mov";
  if (normalizedType.includes("webm")) return "webm";
  if (normalizedType.includes("mpeg") || normalizedType.includes("mp3")) return "mp3";
  if (normalizedType.includes("wav")) return "wav";
  if (normalizedType.includes("m4a") || normalizedType.includes("mp4a")) return "m4a";

  return fileType === "video" ? "mp4" : fileType === "audio" ? "mp3" : "jpg";
}

function buildFilename(title: string, filePath: string, contentType: string | null, fileType: string) {
  const baseName = sanitizeBaseName(title);
  const extension = inferExtension(filePath, contentType, fileType);
  return `${baseName}.${extension}`;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const preview = request.nextUrl.searchParams.get("preview") === "1";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle();
  const typedProfile = profile as { is_admin?: boolean } | null;
  const adminPreview = Boolean(typedProfile?.is_admin && preview);
  const reader = (adminPreview ? supabaseAdmin : supabase) as typeof supabaseAdmin;

  const { data: asset } = await reader.from("entry_assets").select("id, entry_id, file_url, file_type").eq("id", id).maybeSingle();
  if (!asset) {
    return new Response("Not found", { status: 404 });
  }

  const { data: entry } = await reader
    .from("vault_entries")
    .select("id, vault_id, title, unlock_type, unlock_at, milestone_label, milestone_achieved_at")
    .eq("id", asset.entry_id)
    .maybeSingle();

  if (!entry) {
    return new Response("Not found", { status: 404 });
  }

  const { data: vault } = await reader.from("vaults").select("owner_user_id").eq("id", entry.vault_id).maybeSingle();
  const { data: ownerProfile } = vault
    ? await supabaseAdmin
      .from("profiles")
      .select("membership_plan,membership_status")
      .eq("id", vault.owner_user_id)
      .maybeSingle()
    : { data: null };

  const hasPremiumUnlockEntitlement = hasPaidFeatureAccess(ownerProfile?.membership_plan, ownerProfile?.membership_status);
  const status = getEntryStatus(entry, { hasPremiumUnlockEntitlement });
  if (!(status === "unlocked" || adminPreview)) {
    return new Response("Forbidden", { status: 403 });
  }

  const signedUrl = await getStorageObjectUrl(asset.file_url, { bucket: "entry-assets", expiresIn: 60 * 10 });
  if (!signedUrl) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(signedUrl, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return new Response("Unable to fetch asset", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type");
  const filename = buildFilename(entry.title, asset.file_url, contentType, asset.file_type);

  const headers = new Headers();
  headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("X-Content-Type-Options", "nosniff");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
}
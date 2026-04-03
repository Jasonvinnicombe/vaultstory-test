import { redirect } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getStorageObjectUrl } from "@/lib/storage";
import type { Database } from "@/types/database";

const ROOT_ADMIN_EMAIL = "jasonvinnicombe2@gmail.com";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type AdminInviteRow = Database["public"]["Tables"]["admin_invites"]["Row"];
type VaultInviteRow = Database["public"]["Tables"]["vault_invites"]["Row"];

async function syncAdminInvite(profile: ProfileRow | null) {
  if (!profile?.email || profile.is_admin) {
    return profile;
  }

  const normalizedEmail = profile.email.trim().toLowerCase();
  const shouldBeAdmin = normalizedEmail === ROOT_ADMIN_EMAIL;

  const { data: pendingInvite } = await supabaseAdmin
    .from("admin_invites")
    .select("id")
    .eq("email", normalizedEmail)
    .eq("status", "pending")
    .maybeSingle<Pick<AdminInviteRow, "id">>();

  if (!shouldBeAdmin && !pendingInvite?.id) {
    return profile;
  }

  const { error: promoteError } = await supabaseAdmin
    .from("profiles")
    .update({ is_admin: true })
    .eq("id", profile.id);

  if (promoteError) {
    return profile;
  }

  if (pendingInvite?.id) {
    await supabaseAdmin
      .from("admin_invites")
      .update({ status: "accepted" })
      .eq("id", pendingInvite.id);
  }

  return { ...profile, is_admin: true };
}

async function syncVaultInvites(profile: ProfileRow | null) {
  if (!profile?.email) {
    return;
  }

  const normalizedEmail = profile.email.trim().toLowerCase();
  const { data: pendingInvites, error: pendingInvitesError } = await supabaseAdmin
    .from("vault_invites")
    .select("id,vault_id,role")
    .eq("email", normalizedEmail)
    .eq("status", "pending") as {
      data: Pick<VaultInviteRow, "id" | "vault_id" | "role">[] | null;
      error: { message: string } | null;
    };

  if (pendingInvitesError || !pendingInvites?.length) {
    return;
  }

  for (const invite of pendingInvites) {
    await supabaseAdmin
      .from("vault_members")
      .upsert({ vault_id: invite.vault_id, user_id: profile.id, role: invite.role }, { onConflict: "vault_id,user_id" });

    await supabaseAdmin
      .from("vault_invites")
      .update({ status: "accepted" })
      .eq("id", invite.id);
  }
}

export async function getUser() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Supabase user lookup timed out.")), 1500);
      }),
    ]);

    return result.data.user;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function getProfile() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle<ProfileRow>();
  await syncVaultInvites(data);
  const profile = await syncAdminInvite(data);

  const avatarPreviewUrl = profile?.avatar_url
    ? await getStorageObjectUrl(profile.avatar_url, { bucket: "avatars", expiresIn: 60 * 10 })
    : null;

  return { user, profile, avatarPreviewUrl };
}

export async function requireAdmin() {
  const result = await getProfile();

  if (!result.profile?.is_admin) {
    redirect("/dashboard");
  }

  return result;
}
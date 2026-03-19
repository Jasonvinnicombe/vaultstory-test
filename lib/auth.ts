import { redirect } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

const ROOT_ADMIN_EMAIL = "jasonvinnicombe2@gmail.com";

async function syncAdminInvite(profile: { id: string; email: string; is_admin: boolean } | null) {
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
    .maybeSingle();

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
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile = await syncAdminInvite(data);

  const avatarPreviewUrl = profile?.avatar_url
    ? (await supabaseAdmin.storage.from("avatars").createSignedUrl(profile.avatar_url, 60 * 10)).data?.signedUrl ?? null
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

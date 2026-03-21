"use server";

import { canInviteAnotherFamilyMember, canUseFamilyInvites, getFamilyInviteUpgradeMessage, getFamilyMemberLimitMessage } from "@/lib/billing";
export async function signOutAction() {
  const { redirect } = await import("next/navigation");
  const { createClient } = await import("@/lib/supabase/server");

  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login");
}

export async function completeMilestoneAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { createClient } = await import("@/lib/supabase/server");

  const entryId = String(formData.get("entryId") ?? "");
  const vaultId = String(formData.get("vaultId") ?? "");
  if (!entryId || !vaultId) throw new Error("Missing milestone context.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized.");

  const { error } = await supabase.from("vault_entries").update({ milestone_achieved_at: new Date().toISOString() }).eq("id", entryId);
  if (error) throw new Error(error.message);

  revalidatePath(`/entries/${entryId}`);
  revalidatePath(`/vaults/${vaultId}`);
  revalidatePath("/dashboard");
}

export async function saveRealityReflectionAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { createClient } = await import("@/lib/supabase/server");

  const entryId = String(formData.get("entryId") ?? "");
  const vaultId = String(formData.get("vaultId") ?? "");
  const realityText = String(formData.get("realityText") ?? "").trim();
  if (!entryId || !vaultId || realityText.length < 3) throw new Error("Reflection is required.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized.");

  const { error } = await supabase.from("vault_entries").update({ reality_text: realityText }).eq("id", entryId).eq("user_id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath(`/entries/${entryId}`);
  revalidatePath(`/vaults/${vaultId}`);
  revalidatePath("/dashboard");
}

export async function inviteVaultMemberAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { redirect } = await import("next/navigation");
  const { createClient } = await import("@/lib/supabase/server");
  const { supabaseAdmin } = await import("@/lib/supabase/admin");
  const { sendVaultInviteEmail } = await import("@/lib/email");

  const vaultId = String(formData.get("vaultId") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "viewer").trim();

  const redirectWithMessage = (message: string, type: "inviteError" | "inviteSuccess") => {
    redirect(`/vaults/${vaultId}/settings?${type}=${encodeURIComponent(message)}`);
  };

  if (!vaultId || !email) {
    redirectWithMessage("Enter an email address before sending the invite.", "inviteError");
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirectWithMessage("Sign in again to manage family members.", "inviteError");
    }

    const [{ data: vault }, { data: profile }] = await Promise.all([
      supabase.from("vaults").select("*").eq("id", vaultId).maybeSingle(),
      supabase.from("profiles").select("membership_plan,membership_status").eq("id", user.id).maybeSingle(),
    ]);
    if (!vault || vault.owner_user_id !== user.id) {
      redirectWithMessage("Only the vault owner can send invites.", "inviteError");
    }

    if (!canUseFamilyInvites(profile?.membership_plan, profile?.membership_status)) {
      redirectWithMessage(getFamilyInviteUpgradeMessage(), "inviteError");
    }

    const { data: existingInvite, error: inviteLookupError } = await supabase
      .from("vault_invites")
      .select("id,status")
      .eq("vault_id", vaultId)
      .eq("email", email)
      .maybeSingle();

    if (inviteLookupError) {
      throw inviteLookupError;
    }

    const { data: profileMatch } = await supabaseAdmin.from("profiles").select("id,email,full_name").eq("email", email).maybeSingle();
    const { data: existingMember } = profileMatch?.id
      ? await supabase
          .from("vault_members")
          .select("id")
          .eq("vault_id", vaultId)
          .eq("user_id", profileMatch.id)
          .maybeSingle()
      : { data: null };
    const [{ count: memberCount }, { count: pendingInviteCount }] = await Promise.all([
      supabase.from("vault_members").select("id", { head: true, count: "exact" }).eq("vault_id", vaultId),
      supabase.from("vault_invites").select("id", { head: true, count: "exact" }).eq("vault_id", vaultId).eq("status", "pending"),
    ]);

    const consumesNewSlot = profileMatch?.id
      ? !existingMember && existingInvite?.status !== "pending"
      : !existingInvite?.id;

    if (consumesNewSlot && !canInviteAnotherFamilyMember(profile?.membership_plan, profile?.membership_status, memberCount ?? 0, pendingInviteCount ?? 0)) {
      redirectWithMessage(getFamilyMemberLimitMessage(), "inviteError");
    }

    let successMessage = "Invite saved. It will stay pending until they join.";
    let inviteStatus: "accepted" | "pending" = "pending";

    if (profileMatch?.id) {
      const { error: memberError } = await supabase
        .from("vault_members")
        .upsert({ vault_id: vaultId, user_id: profileMatch.id, role }, { onConflict: "vault_id,user_id" });

      if (memberError) {
        throw memberError;
      }

      if (existingInvite?.id) {
        const { error } = await supabase
          .from("vault_invites")
          .update({ role, status: "accepted", invited_by_user_id: user.id })
          .eq("id", existingInvite.id);
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("vault_invites")
          .insert({ vault_id: vaultId, email, role, invited_by_user_id: user.id, status: "accepted" });
        if (error) {
          throw error;
        }
      }

      inviteStatus = "accepted";
      successMessage = `${email} was added to this vault.`;
    } else {
      if (existingInvite?.id) {
        const { error } = await supabase
          .from("vault_invites")
          .update({ role, status: "pending", invited_by_user_id: user.id })
          .eq("id", existingInvite.id);
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("vault_invites")
          .insert({ vault_id: vaultId, email, role, invited_by_user_id: user.id, status: "pending" });
        if (error) {
          throw error;
        }
      }
    }

    const emailResult = await sendVaultInviteEmail({
      to: email,
      vaultId,
      vaultName: vault.name,
      inviterName: user.user_metadata.full_name ?? user.email ?? "Someone close to you",
      role,
    });

    if (emailResult.status === "sent") {
      successMessage = inviteStatus === "accepted"
        ? `${email} was added to this vault and notified by email.`
        : `Invitation emailed to ${email}.`;
    } else if (emailResult.reason === "not-configured") {
      successMessage = inviteStatus === "accepted"
        ? `${email} was added to this vault. Add Resend settings to send the email too.`
        : `Invite saved for ${email}. Add Resend settings to send the email too.`;
    }

    revalidatePath(`/vaults/${vaultId}/settings`);
    redirectWithMessage(successMessage, "inviteSuccess");
  } catch (error) {
    const { isRedirectError } = await import("next/dist/client/components/redirect-error");

    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Something went wrong while sending the invite.";
    const friendlyMessage = message.includes("vault_invites")
      ? "Family invites need the collaboration migration in Supabase before they can be sent."
      : message;

    redirectWithMessage(friendlyMessage, "inviteError");
  }
}

export async function updateVaultMemberRoleAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { createClient } = await import("@/lib/supabase/server");

  const vaultId = String(formData.get("vaultId") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  const role = String(formData.get("role") ?? "viewer");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized.");

  const { data: vault } = await supabase.from("vaults").select("owner_user_id").eq("id", vaultId).maybeSingle();
  if (!vault || vault.owner_user_id !== user.id) throw new Error("Only owners can manage members.");

  const { error } = await supabase.from("vault_members").update({ role }).eq("id", memberId);
  if (error) throw new Error(error.message);

  revalidatePath(`/vaults/${vaultId}/settings`);
}

export async function removeVaultMemberAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { createClient } = await import("@/lib/supabase/server");

  const vaultId = String(formData.get("vaultId") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  const inviteId = String(formData.get("inviteId") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized.");

  const { data: vault } = await supabase.from("vaults").select("owner_user_id").eq("id", vaultId).maybeSingle();
  if (!vault || vault.owner_user_id !== user.id) throw new Error("Only owners can manage members.");

  if (memberId) {
    const { error } = await supabase.from("vault_members").delete().eq("id", memberId);
    if (error) throw new Error(error.message);
  }
  if (inviteId) {
    const { error } = await supabase.from("vault_invites").delete().eq("id", inviteId);
    if (error) throw new Error(error.message);
  }

  revalidatePath(`/vaults/${vaultId}/settings`);
}

export async function deleteVaultAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { redirect } = await import("next/navigation");
  const { createClient } = await import("@/lib/supabase/server");
  const { supabaseAdmin } = await import("@/lib/supabase/admin");

  const vaultId = String(formData.get("vaultId") ?? "");

  const redirectWithMessage = (message: string, type: "deleteError" | "deleteSuccess") => {
    const target = type === "deleteSuccess"
      ? `/dashboard?deleteSuccess=${encodeURIComponent(message)}`
      : `/vaults/${vaultId}/settings?${type}=${encodeURIComponent(message)}`;
    redirect(target);
  };

  if (!vaultId) {
    redirect("/dashboard");
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirectWithMessage("Sign in again before deleting this vault.", "deleteError");
    }

    const { data: vault, error: vaultError } = await supabaseAdmin
      .from("vaults")
      .select("id, owner_user_id, cover_image_url, name")
      .eq("id", vaultId)
      .eq("owner_user_id", user.id)
      .maybeSingle();

    if (vaultError) {
      throw vaultError;
    }

    if (!vault) {
      redirectWithMessage("Only the vault owner can delete this vault.", "deleteError");
    }

    const { data: entryRows, error: entryRowsError } = await supabaseAdmin
      .from("vault_entries")
      .select("id")
      .eq("vault_id", vaultId);

    if (entryRowsError) {
      throw entryRowsError;
    }

    const entryIds = (entryRows ?? []).map((entry) => entry.id);

    if (vault.cover_image_url) {
      await supabaseAdmin.storage.from("vault-covers").remove([vault.cover_image_url]);
    }

    if (entryIds.length > 0) {
      const { data: entryAssets, error: entryAssetsError } = await supabaseAdmin
        .from("entry_assets")
        .select("file_url")
        .in("entry_id", entryIds);

      if (entryAssetsError) {
        throw entryAssetsError;
      }

      const assetPaths = (entryAssets ?? [])
        .map((asset) => asset.file_url)
        .filter((path): path is string => Boolean(path));

      if (assetPaths.length > 0) {
        await supabaseAdmin.storage.from("entry-assets").remove(assetPaths);
      }
    }

    const { error: deleteError } = await supabaseAdmin.from("vaults").delete().eq("id", vaultId);
    if (deleteError) {
      throw deleteError;
    }

    revalidatePath("/dashboard");
    redirectWithMessage(`${vault.name} was deleted.`, "deleteSuccess");
  } catch (error) {
    const { isRedirectError } = await import("next/dist/client/components/redirect-error");

    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Something went wrong while deleting this vault.";
    redirectWithMessage(message, "deleteError");
  }
}

export async function createCheckoutSessionAction(formData: FormData) {
  const { redirect } = await import("next/navigation");
  const { createClient } = await import("@/lib/supabase/server");
  const { env } = await import("@/lib/env");
  const { getStripe } = await import("@/lib/stripe");
  const { upsertStripeCustomer } = await import("@/lib/billing");

  const redirectWithMessage = (message: string) => {
    redirect(`/settings?billingError=${encodeURIComponent(message)}`);
  };

  try {
    const requestedPlan = String(formData.get("planId") ?? "premium").toLowerCase();
    const selectedPlan = requestedPlan === "family" ? "family" : "premium";
    const selectedPriceId = selectedPlan === "family" ? env.STRIPE_FAMILY_PRICE_ID : env.STRIPE_PREMIUM_PRICE_ID;

    if (!env.STRIPE_SECRET_KEY || !selectedPriceId) {
      redirectWithMessage(selectedPlan === "family"
        ? "Family checkout is not configured yet. Add STRIPE_FAMILY_PRICE_ID first."
        : "Stripe is not configured yet. Add STRIPE_PREMIUM_PRICE_ID first.");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login?next=/settings");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id,email,full_name,membership_plan,stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    const email = profile?.email ?? user.email;
    if (!email) {
      redirectWithMessage("We could not find an email address for your account.");
    }

    if (profile?.membership_plan === selectedPlan) {
      redirectWithMessage(`Your account is already on ${selectedPlan === "family" ? "Family" : "Premium"}. Use Manage billing instead.`);
    }

    if (profile?.membership_plan && profile.membership_plan !== "free") {
      redirectWithMessage("Plan changes for existing paid memberships should go through billing management so you do not end up with two subscriptions.");
    }

    const stripe = getStripe();
    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name: profile?.full_name ?? user.user_metadata.full_name ?? undefined,
        metadata: { supabaseUserId: user.id },
      });

      customerId = customer.id;
      await upsertStripeCustomer({
        userId: user.id,
        email,
        fullName: profile?.full_name ?? user.user_metadata.full_name ?? null,
        stripeCustomerId: customer.id,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      success_url: `${env.NEXT_PUBLIC_APP_URL}/settings?billingSuccess=1&billingPlan=${selectedPlan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/pricing?billingCanceled=1`,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      metadata: {
        supabaseUserId: user.id,
        membershipPlan: selectedPlan,
      },
      subscription_data: {
        metadata: {
          supabaseUserId: user.id,
          membershipPlan: selectedPlan,
        },
      },
    });

    if (!session.url) {
      redirectWithMessage("Stripe did not return a checkout URL.");
    }

    redirect(session.url);
  } catch (error) {
    const { isRedirectError } = await import("next/dist/client/components/redirect-error");

    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unable to start Stripe checkout.";
    redirect(`/settings?billingError=${encodeURIComponent(message)}`);
  }
}

export async function createBillingPortalSessionAction() {
  const { redirect } = await import("next/navigation");
  const { createClient } = await import("@/lib/supabase/server");
  const { env } = await import("@/lib/env");
  const { getStripe } = await import("@/lib/stripe");

  const redirectWithMessage = (message: string) => {
    redirect(`/settings?billingError=${encodeURIComponent(message)}`);
  };

  try {
    if (!env.STRIPE_SECRET_KEY) {
      redirectWithMessage("Stripe is not configured yet. Add STRIPE_SECRET_KEY first.");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login?next=/settings");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.stripe_customer_id) {
      redirectWithMessage("There is no Stripe billing account attached to this profile yet.");
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    redirect(session.url);
  } catch (error) {
    const { isRedirectError } = await import("next/dist/client/components/redirect-error");

    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unable to open Stripe billing portal.";
    redirect(`/settings?billingError=${encodeURIComponent(message)}`);
  }
}
const ROOT_ADMIN_EMAIL = "jasonvinnicombe2@gmail.com";

async function requireCurrentAdmin() {
  const { createClient } = await import("@/lib/supabase/server");
  const { supabaseAdmin } = await import("@/lib/supabase/admin");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id,email,full_name,is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    throw new Error("Only admins can manage users.");
  }

  return { user, profile };
}

export async function updateUserAccessAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { redirect } = await import("next/navigation");
  const { supabaseAdmin } = await import("@/lib/supabase/admin");

  const targetUserId = String(formData.get("targetUserId") ?? "");
  const targetEmail = String(formData.get("targetEmail") ?? "").trim().toLowerCase();
  const membershipPlan = String(formData.get("membershipPlan") ?? "free").trim().toLowerCase();
  const membershipStatus = String(formData.get("membershipStatus") ?? "active").trim().toLowerCase();
  const adminAccess = String(formData.get("adminAccess") ?? "standard").trim().toLowerCase();
  const rawStorageQuota = String(formData.get("storageQuotaGb") ?? "").trim();
  const storageQuotaGb = rawStorageQuota ? Number.parseInt(rawStorageQuota, 10) : null;

  const redirectWithMessage = (message: string, type: "adminError" | "adminSuccess") => {
    redirect(`/admin/users?${type}=${encodeURIComponent(message)}`);
  };

  if (!targetUserId || !targetEmail) {
    redirectWithMessage("Choose a valid user before saving changes.", "adminError");
  }

  try {
    const { profile: currentAdmin } = await requireCurrentAdmin();
    const nextIsAdmin = adminAccess === "admin";

    if (targetEmail === ROOT_ADMIN_EMAIL && !nextIsAdmin) {
      redirectWithMessage("The root admin account must keep admin access.", "adminError");
    }

    const normalizedStorageQuota = storageQuotaGb !== null && Number.isFinite(storageQuotaGb) && storageQuotaGb > 0
      ? storageQuotaGb
      : null;

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        membership_plan: membershipPlan,
        membership_status: membershipStatus,
        is_admin: nextIsAdmin,
        storage_quota_gb: normalizedStorageQuota,
      })
      .eq("id", targetUserId);

    if (error) {
      throw error;
    }

    revalidatePath("/admin/users");
    if (currentAdmin.id === targetUserId) {
      revalidatePath("/dashboard");
      revalidatePath("/settings");
    }
    redirectWithMessage(`Updated access for ${targetEmail}.`, "adminSuccess");
  } catch (error) {
    const { isRedirectError } = await import("next/dist/client/components/redirect-error");

    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unable to update user access.";
    redirectWithMessage(message, "adminError");
  }
}

export async function inviteAdminAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { redirect } = await import("next/navigation");
  const { supabaseAdmin } = await import("@/lib/supabase/admin");
  const { sendAdminInviteEmail } = await import("@/lib/email");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const redirectWithMessage = (message: string, type: "adminError" | "adminSuccess") => {
    redirect(`/admin/users?${type}=${encodeURIComponent(message)}`);
  };

  if (!email) {
    redirectWithMessage("Enter an email address before inviting an admin.", "adminError");
  }

  try {
    const { user, profile } = await requireCurrentAdmin();

    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id,email,is_admin")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile?.is_admin) {
      redirectWithMessage(`${email} already has admin access.`, "adminSuccess");
    }

    if (existingProfile?.id) {
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", existingProfile.id);

      if (error) {
        throw error;
      }

      const emailResult = await sendAdminInviteEmail({
        to: email,
        recipientName: null,
        inviterName: profile.full_name ?? profile.email,
      });

      revalidatePath("/admin/users");
      const suffix = emailResult.status === "sent" ? " They were notified by email." : "";
      redirectWithMessage(`${email} was granted admin access.${suffix}`, "adminSuccess");
    }

    const { data: existingInvite } = await supabaseAdmin
      .from("admin_invites")
      .select("id")
      .eq("email", email)
      .eq("status", "pending")
      .maybeSingle();

    if (existingInvite?.id) {
      const emailResult = await sendAdminInviteEmail({
        to: email,
        recipientName: null,
        inviterName: profile.full_name ?? profile.email,
      });

      revalidatePath("/admin/users");
      const suffix = emailResult.status === "sent" ? " The invite email was sent again." : "";
      redirectWithMessage(`${email} already has a pending admin invite.${suffix}`, "adminSuccess");
    }

    const { error: insertError } = await supabaseAdmin.from("admin_invites").insert({
      email,
      invited_by_user_id: user.id,
      status: "pending",
    });

    if (insertError) {
      throw insertError;
    }

    const emailResult = await sendAdminInviteEmail({
      to: email,
      recipientName: null,
      inviterName: profile.full_name ?? profile.email,
    });

    revalidatePath("/admin/users");
    const successMessage = emailResult.status === "sent"
      ? `Admin invitation emailed to ${email}.`
      : `Admin invite saved for ${email}. Add Resend settings to send the email too.`;

    redirectWithMessage(successMessage, "adminSuccess");
  } catch (error) {
    const { isRedirectError } = await import("next/dist/client/components/redirect-error");

    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unable to invite this admin.";
    redirectWithMessage(message, "adminError");
  }
}

export async function removeAdminInviteAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { redirect } = await import("next/navigation");
  const { supabaseAdmin } = await import("@/lib/supabase/admin");

  const inviteId = String(formData.get("inviteId") ?? "");

  const redirectWithMessage = (message: string, type: "adminError" | "adminSuccess") => {
    redirect(`/admin/users?${type}=${encodeURIComponent(message)}`);
  };

  if (!inviteId) {
    redirectWithMessage("Choose a pending admin invite first.", "adminError");
  }

  try {
    await requireCurrentAdmin();

    const { error } = await supabaseAdmin.from("admin_invites").delete().eq("id", inviteId);
    if (error) {
      throw error;
    }

    revalidatePath("/admin/users");
    redirectWithMessage("Pending admin invite removed.", "adminSuccess");
  } catch (error) {
    const { isRedirectError } = await import("next/dist/client/components/redirect-error");

    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unable to remove admin invite.";
    redirectWithMessage(message, "adminError");
  }
}

export async function deleteUserAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { redirect } = await import("next/navigation");
  const { supabaseAdmin } = await import("@/lib/supabase/admin");

  const targetUserId = String(formData.get("targetUserId") ?? "");
  const targetEmail = String(formData.get("targetEmail") ?? "").trim().toLowerCase();

  const redirectWithMessage = (message: string, type: "adminError" | "adminSuccess") => {
    redirect(`/admin/users?${type}=${encodeURIComponent(message)}`);
  };

  if (!targetUserId || !targetEmail) {
    redirectWithMessage("Choose a valid user before deleting this account.", "adminError");
  }

  try {
    const { user } = await requireCurrentAdmin();

    if (targetEmail === ROOT_ADMIN_EMAIL) {
      redirectWithMessage("The root admin account cannot be deleted.", "adminError");
    }

    if (user.id === targetUserId) {
      redirectWithMessage("You cannot delete the admin account you are currently using.", "adminError");
    }

    const { error: inviteError } = await supabaseAdmin.from("admin_invites").delete().eq("email", targetEmail);
    if (inviteError) {
      throw inviteError;
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
    if (authError) {
      throw authError;
    }

    revalidatePath("/admin/users");
    redirectWithMessage(`${targetEmail} was deleted.`, "adminSuccess");
  } catch (error) {
    const { isRedirectError } = await import("next/dist/client/components/redirect-error");

    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unable to delete this user.";
    redirectWithMessage(message, "adminError");
  }
}

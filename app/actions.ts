"use server";

import type { User } from "@supabase/supabase-js";

import { canInviteAnotherFamilyMember, canUseFamilyInvites, getFamilyInviteUpgradeMessage, getFamilyMemberLimitMessage } from "@/lib/billing";
import type { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type VaultRow = Database["public"]["Tables"]["vaults"]["Row"];
type VaultMemberRow = Database["public"]["Tables"]["vault_members"]["Row"];
type VaultInviteRow = Database["public"]["Tables"]["vault_invites"]["Row"];
type EntryRow = Database["public"]["Tables"]["vault_entries"]["Row"];
type EntryAssetRow = Database["public"]["Tables"]["entry_assets"]["Row"];
type AdminInviteRow = Database["public"]["Tables"]["admin_invites"]["Row"];

async function requireAuthenticatedUser() {
  const { createClient } = await import("@/lib/supabase/server");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  return { supabase, user: user as User };
}
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

  const { supabase, user } = await requireAuthenticatedUser();

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle<Pick<ProfileRow, "is_admin">>();
  if (profile?.is_admin) throw new Error("Admins cannot unlock customer milestones.");

  const { error } = await supabase.from("vault_entries").update({ milestone_achieved_at: new Date().toISOString() } as never).eq("id", entryId);
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

  const { supabase, user } = await requireAuthenticatedUser();

  const { error } = await supabase.from("vault_entries").update({ reality_text: realityText } as never).eq("id", entryId).eq("user_id", user.id);
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

  const redirectWithMessage = (message: string, type: "inviteError" | "inviteSuccess")=> {
    redirect(`/vaults/${vaultId}/settings?${type}=${encodeURIComponent(message)}`);
  };

  if (!vaultId || !email) {
    redirectWithMessage("Enter an email address before sending the invite.", "inviteError");
  }

  try {
    const { supabase, user } = await requireAuthenticatedUser();

    const [{ data: vault }, { data: profile }] = await Promise.all([
      supabase.from("vaults").select("*").eq("id", vaultId).maybeSingle<VaultRow>(),
      supabase.from("profiles").select("membership_plan,membership_status").eq("id", user.id).maybeSingle<Pick<ProfileRow, "membership_plan" | "membership_status">>(),
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
      .maybeSingle<Pick<VaultInviteRow, "id" | "status">>();

    if (inviteLookupError) {
      throw inviteLookupError;
    }

    const { data: profileMatch } = await supabaseAdmin.from("profiles").select("id,email,full_name").eq("email", email).maybeSingle<Pick<ProfileRow, "id" | "email" | "full_name">>();
    const { data: existingMember } = profileMatch?.id
      ? await supabase
          .from("vault_members")
          .select("id")
          .eq("vault_id", vaultId)
          .eq("user_id", profileMatch.id)
          .maybeSingle<Pick<VaultMemberRow, "id">>()
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
        .upsert({ vault_id: vaultId, user_id: profileMatch.id, role } as never, { onConflict: "vault_id,user_id" });

      if (memberError) {
        throw memberError;
      }

      if (existingInvite?.id) {
        const { error } = await supabase
          .from("vault_invites")
          .update({ role, status: "accepted", invited_by_user_id: user.id } as never)
          .eq("id", existingInvite.id);
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("vault_invites")
          .insert({ vault_id: vaultId, email, role, invited_by_user_id: user.id, status: "accepted" } as never);
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
          .update({ role, status: "pending", invited_by_user_id: user.id } as never)
          .eq("id", existingInvite.id);
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("vault_invites")
          .insert({ vault_id: vaultId, email, role, invited_by_user_id: user.id, status: "pending" } as never);
        if (error) {
          throw error;
        }
      }
    }
    const confirmedVault = vault!;

    const emailResult = await sendVaultInviteEmail({
      to: email,
      vaultId,
      vaultName: confirmedVault.name,
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

  const { supabase, user } = await requireAuthenticatedUser();

  const { data: vault } = await supabase.from("vaults").select("owner_user_id").eq("id", vaultId).maybeSingle<Pick<VaultRow, "owner_user_id">>();
  if (!vault || vault.owner_user_id !== user.id) throw new Error("Only owners can manage members.");

  const { error } = await supabase.from("vault_members").update({ role } as never).eq("id", memberId);
  if (error) throw new Error(error.message);

  revalidatePath(`/vaults/${vaultId}/settings`);
}

export async function removeVaultMemberAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { createClient } = await import("@/lib/supabase/server");

  const vaultId = String(formData.get("vaultId") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  const inviteId = String(formData.get("inviteId") ?? "");

  const { supabase, user } = await requireAuthenticatedUser();

  const { data: vault } = await supabase.from("vaults").select("owner_user_id").eq("id", vaultId).maybeSingle<Pick<VaultRow, "owner_user_id">>();
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

  const redirectWithMessage = (message: string, type: "deleteError" | "deleteSuccess"): never => {
    const target = type === "deleteSuccess"
      ? `/dashboard?deleteSuccess=${encodeURIComponent(message)}`
      : `/vaults/${vaultId}/settings?${type}=${encodeURIComponent(message)}`;
    return redirect(target);
  };

  if (!vaultId) {
    redirect("/dashboard");
  }

  try {
    const { user } = await requireAuthenticatedUser();

    const { data: vault, error: vaultError } = await supabaseAdmin
      .from("vaults")
      .select("id, owner_user_id, cover_image_url, name")
      .eq("id", vaultId)
      .eq("owner_user_id", user.id)
      .maybeSingle<Pick<VaultRow, "id" | "owner_user_id" | "cover_image_url" | "name">>();

    if (vaultError) {
      throw vaultError;
    }

    if (!vault) {
      redirectWithMessage("Only the vault owner can delete this vault.", "deleteError");
    }

    const { data: entryRows, error: entryRowsError } = await supabaseAdmin
      .from("vault_entries")
      .select("id")
      .eq("vault_id", vaultId) as { data: Pick<EntryRow, "id">[] | null; error: { message: string } | null };

    if (entryRowsError) {
      throw entryRowsError;
    }

    const entryIds = (entryRows ?? []).map((entry) => entry.id);
    const confirmedVault = vault!;

    const { deleteStorageObject } = await import("@/lib/storage");

    if (confirmedVault.cover_image_url) {
      await deleteStorageObject(confirmedVault.cover_image_url, { bucket: "vault-covers" });
    }

    if (entryIds.length > 0) {
      const { data: entryAssets, error: entryAssetsError } = await supabaseAdmin
        .from("entry_assets")
        .select("file_url")
        .in("entry_id", entryIds) as { data: Pick<EntryAssetRow, "file_url">[] | null; error: { message: string } | null };

      if (entryAssetsError) {
        throw entryAssetsError;
      }

      const assetPaths = (entryAssets ?? [])
        .map((asset) => asset.file_url)
        .filter((path): path is string => Boolean(path));

      if (assetPaths.length > 0) {
        await Promise.all(assetPaths.map((assetPath) => deleteStorageObject(assetPath, { bucket: "entry-assets" })));
      }
    }

    const { error: deleteError } = await supabaseAdmin.from("vaults").delete().eq("id", vaultId);
    if (deleteError) {
      throw deleteError;
    }

    revalidatePath("/dashboard");
    redirectWithMessage(`${confirmedVault.name} was deleted.`, "deleteSuccess");
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
  const { headers } = await import("next/headers");
  const { createClient } = await import("@/lib/supabase/server");
  const { env } = await import("@/lib/env");
  const { getCurrencyFromHeaders } = await import("@/lib/currency");
  const { getStripe } = await import("@/lib/stripe");
  const { getStripePriceId } = await import("@/lib/stripe-pricing");
  const { upsertStripeCustomer } = await import("@/lib/billing");

  const redirectWithMessage = (message: string): never => {
    return redirect(`/settings?billingError=${encodeURIComponent(message)}`);
  };

  try {
    const { user } = await requireAuthenticatedUser();
    const requestedPlan = String(formData.get("planId") ?? "premium").toLowerCase();
    const selectedPlan = requestedPlan === "family" ? "family" : "premium";
    const currencyOverride = String(formData.get("currency") ?? "").trim().toUpperCase();
    const detectedCurrency = getCurrencyFromHeaders(await headers(), currencyOverride || null);
    const selectedPriceId = getStripePriceId(selectedPlan, detectedCurrency);

    if (!env.STRIPE_SECRET_KEY || !selectedPriceId) {
      redirectWithMessage(selectedPlan === "family"
        ? `Family checkout is not configured yet for ${detectedCurrency}. Add the matching STRIPE_FAMILY_PRICE_ID environment variable first.`
        : `Stripe is not configured yet for ${detectedCurrency}. Add the matching STRIPE_PREMIUM_PRICE_ID environment variable first.`);
    }

    const stripePriceId = selectedPriceId!;

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("id,email,full_name,membership_plan,stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle<Pick<ProfileRow, "id" | "email" | "full_name" | "membership_plan" | "stripe_customer_id">>();

    const email = profile?.email ?? user.email;
    if (!email) {
      redirectWithMessage("We could not find an email address for your account.");
    }

    const resolvedEmail = email!;

    if (profile?.membership_plan === selectedPlan) {
      redirectWithMessage(`Your account is already on ${selectedPlan === "family" ? "Family" : "Premium"}. Use Manage billing instead.`);
    }

    if (profile?.membership_plan && profile.membership_plan !== "free") {
      redirectWithMessage("Plan changes for existing paid memberships should go through billing management so you do not end up with two subscriptions.");
    }

    const appUrl = env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      redirectWithMessage("NEXT_PUBLIC_APP_URL is missing.");
    }

    const stripe = getStripe();
    let customerId = profile?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: resolvedEmail,
        name: profile?.full_name ?? user.user_metadata.full_name ?? undefined,
        metadata: { supabaseUserId: user.id },
      });

      customerId = customer.id;
      await upsertStripeCustomer({
        userId: user.id,
        email: resolvedEmail,
        fullName: profile?.full_name ?? user.user_metadata.full_name ?? null,
        stripeCustomerId: customer.id,
      });
    }

    if (!customerId) {
      redirectWithMessage("Stripe customer setup failed.");
    }

    const stripeCustomerId = customerId!;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      client_reference_id: user.id,
      success_url: `${appUrl}/settings?billingSuccess=1&billingPlan=${selectedPlan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing?billingCanceled=1`,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        supabaseUserId: user.id,
        membershipPlan: selectedPlan,
      },
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          supabaseUserId: user.id,
          membershipPlan: selectedPlan,
        },
      },
    });

    const checkoutUrl: string = session.url as string;
    if (!checkoutUrl) {
      redirectWithMessage("Stripe did not return a checkout URL.");
    }

    redirect(checkoutUrl);
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

  const redirectWithMessage = (message: string): never => {
    return redirect(`/settings?billingError=${encodeURIComponent(message)}`);
  };

  try {
    const { user } = await requireAuthenticatedUser();
    if (!env.STRIPE_SECRET_KEY) {
      redirectWithMessage("Stripe is not configured yet. Add STRIPE_SECRET_KEY first.");
    }

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle<Pick<ProfileRow, "stripe_customer_id">>();

    const customerId = profile?.stripe_customer_id;
    if (!customerId) {
      redirectWithMessage("There is no Stripe billing account attached to this profile yet.");
    }

    const appUrl = env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      redirectWithMessage("NEXT_PUBLIC_APP_URL is missing.");
    }

    const billingCustomerId = customerId!;

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: billingCustomerId,
      return_url: `${appUrl}/settings`,
    });

    redirect(session.url as string);
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

  const redirectWithMessage = (message: string, type: "adminError" | "adminSuccess")=> {
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

  const redirectWithMessage = (message: string, type: "adminError" | "adminSuccess")=> {
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
      .maybeSingle<Pick<ProfileRow, "id" | "email" | "is_admin">>();

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

  const redirectWithMessage = (message: string, type: "adminError" | "adminSuccess")=> {
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

  const redirectWithMessage = (message: string, type: "adminError" | "adminSuccess")=> {
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
export async function triggerUnlockNotificationsAction(formData: FormData) {
  const { revalidatePath } = await import("next/cache");
  const { redirect } = await import("next/navigation");
  const { getAppUrl } = await import("@/lib/app-url");

  const mode = String(formData.get("mode") ?? "dry-run").trim().toLowerCase();
  const dryRun = mode !== "send";

  const redirectWithMessage = (message: string, type: "unlockError" | "unlockSuccess")=> {
    redirect(`/admin/users?${type}=${encodeURIComponent(message)}`);
  };

  try {
    await requireCurrentAdmin();

    const secret = process.env.UNLOCK_NOTIFICATIONS_CRON_SECRET?.trim();
    if (!secret) {
      redirectWithMessage("Add UNLOCK_NOTIFICATIONS_CRON_SECRET before running unlock notifications.", "unlockError");
    }

    const url = new URL("/api/notifications/unlocks", getAppUrl());
    url.searchParams.set("secret", secret!);
    if (dryRun) {
      url.searchParams.set("dryRun", "1");
    }

    const response = await fetch(url, { method: "GET", cache: "no-store" });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error || "Unable to run unlock notifications.");
    }

    revalidatePath("/admin/users");

    if (dryRun) {
      redirectWithMessage(`Unlock email preview found ${result.plannedEmails ?? 0} pending email${result.plannedEmails === 1 ? "" : "s"}.`, "unlockSuccess");
    }

    redirectWithMessage(`Unlock email send completed. Sent ${result.emailsSent ?? 0} email${result.emailsSent === 1 ? "" : "s"}.`, "unlockSuccess");
  } catch (error) {
    const { isRedirectError } = await import("next/dist/client/components/redirect-error");

    if (isRedirectError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unable to run unlock notifications.";
    redirectWithMessage(message, "unlockError");
  }
}





































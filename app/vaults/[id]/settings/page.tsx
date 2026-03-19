import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { DeleteVaultForm } from "@/components/settings/delete-vault-form";
import { VaultMembersManager } from "@/components/settings/vault-members-manager";
import { VaultSettingsForm } from "@/components/settings/vault-settings-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { canUseFamilyInvites, getFamilyInviteUpgradeMessage } from "@/lib/billing";
import { getProfile } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export default async function VaultSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ inviteSuccess?: string; inviteError?: string; deleteError?: string; deleteSuccess?: string }>;
}) {
  const [{ id }, resolvedSearchParams, { profile, user, avatarPreviewUrl }] = await Promise.all([params, searchParams ?? Promise.resolve({}), getProfile()]);
  const supabase = await createClient();

  const [{ data: vault }, { data: members }] = await Promise.all([
    supabase.from("vaults").select("*").eq("id", id).maybeSingle(),
    supabase.from("vault_members").select("*").eq("vault_id", id),
  ]);

  const { data: invites, error: invitesError } = await supabase
    .from("vault_invites")
    .select("*")
    .eq("vault_id", id)
    .order("created_at", { ascending: false });

  const safeInvites = invitesError ? [] : invites ?? [];
  const inviteFeedback = resolvedSearchParams.inviteError
    ? { type: "error" as const, message: resolvedSearchParams.inviteError }
    : resolvedSearchParams.inviteSuccess
      ? { type: "success" as const, message: resolvedSearchParams.inviteSuccess }
      : null;
  const deleteFeedback = resolvedSearchParams.deleteError
    ? { type: "error" as const, message: resolvedSearchParams.deleteError }
    : resolvedSearchParams.deleteSuccess
      ? { type: "success" as const, message: resolvedSearchParams.deleteSuccess }
      : null;

  if (!vault) notFound();
  if (vault.owner_user_id !== user.id) notFound();

  const coverImagePreviewUrl = vault.cover_image_url
    ? (await supabaseAdmin.storage.from("vault-covers").createSignedUrl(vault.cover_image_url, 60 * 10)).data?.signedUrl ?? null
    : null;

  const memberRows = await Promise.all(
    (members ?? []).map(async (member) => {
      const { data: memberProfile } = await supabaseAdmin
        .from("profiles")
        .select("email, full_name")
        .eq("id", member.user_id)
        .maybeSingle();

      return {
        id: member.id,
        role: member.role,
        email: memberProfile?.email ?? "No email available",
        fullName: memberProfile?.full_name ?? null,
      };
    }),
  );

  return (
    <AppShell fullName={profile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="section-stack">
        <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
          <CardContent className="flex flex-col gap-5 p-8 sm:p-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge className="mb-5 bg-secondary/85">Vault settings</Badge>
              <h1 className="max-w-3xl text-balance font-display text-4xl text-foreground sm:text-5xl">Manage {vault.name}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Refine the vault details, update the cover, and decide who gets to help care for these memories.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full lg:w-auto">
              <Link href={`/vaults/${vault.id}`}>Back to vault</Link>
            </Button>
          </CardContent>
        </Card>

        <VaultSettingsForm
          vaultId={vault.id}
          ownerUserId={vault.owner_user_id}
          vaultType={vault.vault_type}
          vaultName={vault.name}
          subjectName={vault.subject_name ?? ""}
          subjectBirthdate={vault.subject_birthdate ?? null}
          description={vault.description ?? null}
          coverImageUrl={vault.cover_image_url ?? null}
          coverImagePreviewUrl={coverImagePreviewUrl}
        />

        <VaultMembersManager
          vaultId={vault.id}
          members={memberRows}
          invites={safeInvites.map((invite) => ({
            id: invite.id,
            email: invite.email,
            role: invite.role,
            status: invite.status,
          }))}
          canInvite={canUseFamilyInvites(profile?.membership_plan, profile?.membership_status)}
          inviteUpgradeMessage={canUseFamilyInvites(profile?.membership_plan, profile?.membership_status) ? null : getFamilyInviteUpgradeMessage()}
          feedback={inviteFeedback}
        />

        <DeleteVaultForm vaultId={vault.id} vaultName={vault.name} feedback={deleteFeedback} />
      </div>
    </AppShell>
  );
}

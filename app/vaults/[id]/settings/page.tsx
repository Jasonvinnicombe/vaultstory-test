import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { DeleteVaultForm } from "@/components/settings/delete-vault-form";
import { VaultMembersManager } from "@/components/settings/vault-members-manager";
import { VaultSettingsForm } from "@/components/settings/vault-settings-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { canInviteAnotherFamilyMember, canUseFamilyInvites, getFamilyInviteUpgradeMessage, getFamilyMemberLimitMessage } from "@/lib/billing";
import { getProfile } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getStorageObjectUrl } from "@/lib/storage";
import type { Database } from "@/types/database";

type VaultSettingsSearchParams = {
  inviteSuccess?: string;
  inviteError?: string;
  deleteError?: string;
  deleteSuccess?: string;
};

type VaultRow = Database["public"]["Tables"]["vaults"]["Row"];
type VaultMemberRow = Database["public"]["Tables"]["vault_members"]["Row"];
type VaultInviteRow = Database["public"]["Tables"]["vault_invites"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export default async function VaultSettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<VaultSettingsSearchParams>;
}) {
  const [{ id }, rawSearchParams, { profile, user, avatarPreviewUrl }] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({}),
    getProfile(),
  ]);
  const resolvedSearchParams = rawSearchParams as VaultSettingsSearchParams;
  const supabase = await createClient();

  const [{ data: vault }, { data: members }] = await Promise.all([
    supabase.from("vaults").select("*").eq("id", id).maybeSingle<VaultRow>(),
    supabase.from("vault_members").select("*").eq("vault_id", id) as unknown as { data: VaultMemberRow[] | null },
  ]);

  const { data: invites, error: invitesError } = await supabase
    .from("vault_invites")
    .select("*")
    .eq("vault_id", id)
    .order("created_at", { ascending: false }) as unknown as { data: VaultInviteRow[] | null; error: { message: string } | null };

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

  const confirmedVault = vault;
  const coverImagePreviewUrl = confirmedVault.cover_image_url
    ? await getStorageObjectUrl(confirmedVault.cover_image_url, { bucket: "vault-covers", expiresIn: 60 * 10 })
    : null;

  const memberRows = await Promise.all(
    (members ?? []).map(async (member) => {
      const { data: memberProfile } = await supabaseAdmin
        .from("profiles")
        .select("email, full_name")
        .eq("id", member.user_id)
        .maybeSingle<Pick<ProfileRow, "email" | "full_name">>();

      return {
        id: member.id,
        role: member.role,
        email: memberProfile?.email ?? "No email available",
        fullName: memberProfile?.full_name ?? null,
      };
    }),
  );

  const canUseInvites = canUseFamilyInvites(profile?.membership_plan, profile?.membership_status);
  const canInviteMore = canInviteAnotherFamilyMember(
    profile?.membership_plan,
    profile?.membership_status,
    memberRows.length,
    safeInvites.filter((invite) => invite.status === "pending").length,
  );

  return (
    <AppShell fullName={profile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="section-stack">
        <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
          <CardContent className="flex flex-col gap-5 p-8 sm:p-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge className="mb-5 bg-secondary/85">Vault settings</Badge>
              <h1 className="max-w-3xl text-balance font-display text-4xl text-foreground sm:text-5xl">Manage {confirmedVault.name}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Refine the vault details, update the cover, and decide who gets to help care for these memories.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full lg:w-auto">
              <Link href={`/vaults/${confirmedVault.id}`}>Back to vault</Link>
            </Button>
          </CardContent>
        </Card>

        <VaultSettingsForm
          vaultId={confirmedVault.id}
          ownerUserId={confirmedVault.owner_user_id}
          vaultType={confirmedVault.vault_type}
          vaultName={confirmedVault.name}
          subjectName={confirmedVault.subject_name ?? ""}
          subjectBirthdate={confirmedVault.subject_birthdate ?? null}
          description={confirmedVault.description ?? null}
          coverImageUrl={confirmedVault.cover_image_url ?? null}
          coverImagePreviewUrl={coverImagePreviewUrl}
        />

        <VaultMembersManager
          vaultId={confirmedVault.id}
          members={memberRows}
          invites={safeInvites.map((invite) => ({
            id: invite.id,
            email: invite.email,
            role: invite.role,
            status: invite.status,
          }))}
          canInvite={canUseInvites && canInviteMore}
          inviteUpgradeMessage={!canUseInvites ? getFamilyInviteUpgradeMessage() : !canInviteMore ? getFamilyMemberLimitMessage() : null}
          feedback={inviteFeedback}
        />

        <DeleteVaultForm vaultId={confirmedVault.id} vaultName={confirmedVault.name} feedback={deleteFeedback} />
      </div>
    </AppShell>
  );
}

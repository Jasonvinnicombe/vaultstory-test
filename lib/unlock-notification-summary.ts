import { hasPaidFeatureAccess } from "@/lib/billing";
import { getEntryStatus } from "@/lib/entries";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Json } from "@/types/database";

type EntryRow = {
  id: string;
  vault_id: string;
  title: string;
  created_at: string;
  unlock_type: string;
  unlock_at: string | null;
  milestone_label: string | null;
  milestone_achieved_at: string | null;
  is_deleted?: boolean | null;
};

type VaultRow = {
  id: string;
  name: string;
  subject_name: string | null;
  owner_user_id: string;
};

type MemberRow = {
  vault_id: string;
  user_id: string;
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  notification_preferences: Json | null;
  membership_plan?: string;
  membership_status?: string;
};

type NotificationLogRow = {
  entry_id: string;
  recipient_user_id: string;
};

export type UnlockNotificationSummary = {
  unlockedEntries: number;
  pendingEmails: number;
  sentEmails: number;
  previewRecipients: Array<{
    entryId: string;
    entryTitle: string;
    vaultName: string;
    recipientEmail: string;
  }>;
};

function notificationsEnabled(preferences: Json | null) {
  if (!preferences || typeof preferences !== "object" || Array.isArray(preferences)) {
    return true;
  }

  const unlockDigest = (preferences as Record<string, Json | undefined>).unlockDigest;
  return unlockDigest !== false;
}

function isMissingNotificationLogTable(message: string) {
  return /entry_unlock_notifications/i.test(message) && /(schema cache|could not find the table)/i.test(message);
}

export async function getUnlockNotificationSummary(): Promise<UnlockNotificationSummary> {
  const { data: entries, error: entriesError } = await supabaseAdmin
    .from("vault_entries")
    .select("id,vault_id,title,created_at,unlock_type,unlock_at,milestone_label,milestone_achieved_at,is_deleted");

  if (entriesError) {
    throw new Error(entriesError.message);
  }

  const availableEntries = (entries ?? []).filter((entry: EntryRow) => entry.is_deleted !== true);
  const vaultIds = [...new Set(availableEntries.map((entry) => entry.vault_id))];

  const [{ data: vaults, error: vaultsError }, { data: members, error: membersError }] = await Promise.all([
    supabaseAdmin.from("vaults").select("id,name,subject_name,owner_user_id").in("id", vaultIds),
    supabaseAdmin.from("vault_members").select("vault_id,user_id").in("vault_id", vaultIds),
  ]);

  if (vaultsError) throw new Error(vaultsError.message);
  if (membersError) throw new Error(membersError.message);

  const ownerIds = [...new Set((vaults ?? []).map((vault: VaultRow) => vault.owner_user_id))];
  const { data: ownerProfiles, error: ownerProfilesError } = await supabaseAdmin
    .from("profiles")
    .select("id,membership_plan,membership_status")
    .in("id", ownerIds);

  if (ownerProfilesError) {
    throw new Error(ownerProfilesError.message);
  }

  const ownerProfileById = new Map((ownerProfiles ?? []).map((profile) => [profile.id, profile]));
  const vaultById = new Map((vaults ?? []).map((vault: VaultRow) => [vault.id, vault]));
  const unlockedEntries = availableEntries.filter((entry) => {
    const vault = vaultById.get(entry.vault_id);
    const ownerProfile = vault ? ownerProfileById.get(vault.owner_user_id) : null;
    const hasPremiumUnlockEntitlement = hasPaidFeatureAccess(ownerProfile?.membership_plan, ownerProfile?.membership_status);
    return getEntryStatus(entry, { hasPremiumUnlockEntitlement }) === "unlocked";
  });

  if (!unlockedEntries.length) {
    return { unlockedEntries: 0, pendingEmails: 0, sentEmails: 0, previewRecipients: [] };
  }

  const entryIds = unlockedEntries.map((entry) => entry.id);
  const recipientIds = new Set<string>();
  const recipientsByVault = new Map<string, Set<string>>();

  for (const vault of vaults ?? []) {
    recipientsByVault.set(vault.id, new Set([vault.owner_user_id]));
    recipientIds.add(vault.owner_user_id);
  }

  for (const member of members ?? []) {
    if (!recipientsByVault.has(member.vault_id)) {
      recipientsByVault.set(member.vault_id, new Set());
    }

    recipientsByVault.get(member.vault_id)?.add(member.user_id);
    recipientIds.add(member.user_id);
  }

  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("id,email,full_name,notification_preferences")
    .in("id", [...recipientIds]);

  if (profilesError) {
    throw new Error(profilesError.message);
  }

  const profileById = new Map((profiles ?? []).map((profile: ProfileRow) => [profile.id, profile]));

  let sentKeys = new Set<string>();
  const { data: sentLogs, error: sentLogsError } = await supabaseAdmin
    .from("entry_unlock_notifications")
    .select("entry_id,recipient_user_id")
    .in("entry_id", entryIds);

  if (sentLogsError) {
    if (!isMissingNotificationLogTable(sentLogsError.message)) {
      throw new Error(sentLogsError.message);
    }
  } else {
    sentKeys = new Set((sentLogs ?? []).map((row: NotificationLogRow) => `${row.entry_id}:${row.recipient_user_id}`));
  }

  let pendingEmails = 0;
  const previewRecipients: UnlockNotificationSummary["previewRecipients"] = [];

  for (const entry of unlockedEntries) {
    const vault = vaultById.get(entry.vault_id);
    if (!vault) continue;

    for (const recipientUserId of recipientsByVault.get(entry.vault_id) ?? new Set<string>()) {
      const key = `${entry.id}:${recipientUserId}`;
      if (sentKeys.has(key)) continue;

      const profile = profileById.get(recipientUserId);
      if (!profile?.email) continue;
      if (!notificationsEnabled(profile.notification_preferences)) continue;

      pendingEmails += 1;

      if (previewRecipients.length < 8) {
        previewRecipients.push({
          entryId: entry.id,
          entryTitle: entry.title,
          vaultName: vault.name,
          recipientEmail: profile.email,
        });
      }
    }
  }

  return {
    unlockedEntries: unlockedEntries.length,
    pendingEmails,
    sentEmails: sentKeys.size,
    previewRecipients,
  };
}
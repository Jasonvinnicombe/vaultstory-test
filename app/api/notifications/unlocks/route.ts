import { NextRequest, NextResponse } from "next/server";

import { hasPaidFeatureAccess } from "@/lib/billing";
import { sendUnlockReadyEmail } from "@/lib/email";
import { getEntryStatus } from "@/lib/entries";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStorageObjectUrl } from "@/lib/storage";
import type { Json } from "@/types/database";

export const dynamic = "force-dynamic";

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
  cover_image_url: string | null;
};

type MemberRow = {
  vault_id: string;
  user_id: string;
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  timezone: string | null;
  notification_preferences: Json | null;
  membership_plan?: string;
  membership_status?: string;
};

type UnlockNotificationRunOptions = {
  dryRun?: boolean;
};

function isAuthorized(request: NextRequest) {
  const cronSecret = process.env.UNLOCK_NOTIFICATIONS_CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  const authHeader = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-cron-secret");
  const querySecret = request.nextUrl.searchParams.get("secret");
  const bearerSecret = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  return [bearerSecret, headerSecret, querySecret].some((value) => value === cronSecret);
}

function notificationsEnabled(preferences: Json | null) {
  if (!preferences || typeof preferences !== "object" || Array.isArray(preferences)) {
    return true;
  }

  const unlockDigest = (preferences as Record<string, Json | undefined>).unlockDigest;
  return unlockDigest !== false;
}

function formatUnlockedAt(unlockedAt: string, timezone?: string | null) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: timezone || "UTC",
  }).format(new Date(unlockedAt));
}

function isMissingNotificationLogTable(message: string) {
  return /entry_unlock_notifications/i.test(message) && /(schema cache|could not find the table)/i.test(message);
}

async function runUnlockNotifications({ dryRun = false }: UnlockNotificationRunOptions = {}) {
  const { data: entries, error: entriesError } = await supabaseAdmin
    .from("vault_entries")
    .select("id,vault_id,title,created_at,unlock_type,unlock_at,milestone_label,milestone_achieved_at,is_deleted");

  if (entriesError) {
    throw new Error(entriesError.message);
  }

  const availableEntries = (entries ?? []).filter((entry: EntryRow) => entry.is_deleted !== true);
  const vaultIds = [...new Set(availableEntries.map((entry) => entry.vault_id))];

  const [{ data: vaults, error: vaultsError }, { data: members, error: membersError }] = await Promise.all([
    supabaseAdmin.from("vaults").select("id,name,subject_name,owner_user_id,cover_image_url").in("id", vaultIds),
    supabaseAdmin.from("vault_members").select("vault_id,user_id").in("vault_id", vaultIds),
  ]);

  if (vaultsError) {
    throw new Error(vaultsError.message);
  }

  if (membersError) {
    throw new Error(membersError.message);
  }

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

  if (unlockedEntries.length === 0) {
    return {
      dryRun,
      processedEntries: 0,
      emailsSent: 0,
      plannedEmails: 0,
      skippedAlreadySent: 0,
      skippedPreferences: 0,
      skippedMissingProfile: 0,
      skippedEmailNotConfigured: 0,
      notificationLogAvailable: true,
      previewRecipients: [] as Array<Record<string, string>>,
      failures: [] as string[],
    };
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
    .select("id,email,full_name,timezone,notification_preferences")
    .in("id", [...recipientIds]);

  if (profilesError) {
    throw new Error(profilesError.message);
  }

  let notificationLogAvailable = true;
  let sentKeys = new Set<string>();

  const { data: sentLogs, error: sentLogsError } = await supabaseAdmin
    .from("entry_unlock_notifications")
    .select("entry_id,recipient_user_id")
    .in("entry_id", entryIds);

  if (sentLogsError) {
    if (isMissingNotificationLogTable(sentLogsError.message)) {
      notificationLogAvailable = false;
      if (!dryRun) {
        throw new Error("Missing entry_unlock_notifications table. Apply supabase migration 20260315_future_memory_vault_unlock_notifications.sql before sending unlock emails.");
      }
    } else {
      throw new Error(sentLogsError.message);
    }
  } else {
    sentKeys = new Set((sentLogs ?? []).map((row) => `${row.entry_id}:${row.recipient_user_id}`));
  }

  const profileById = new Map((profiles ?? []).map((profile: ProfileRow) => [profile.id, profile]));

  let emailsSent = 0;
  let plannedEmails = 0;
  let skippedAlreadySent = 0;
  let skippedPreferences = 0;
  let skippedMissingProfile = 0;
  let skippedEmailNotConfigured = 0;
  const failures: string[] = [];
  const rowsToInsert: Array<{ entry_id: string; recipient_user_id: string; recipient_email: string }> = [];
  const previewRecipients: Array<Record<string, string>> = [];

  for (const entry of unlockedEntries) {
    const vault = vaultById.get(entry.vault_id);
    if (!vault) {
      continue;
    }

    const recipientSet = recipientsByVault.get(entry.vault_id) ?? new Set<string>();
    const unlockedAt = entry.milestone_achieved_at || entry.unlock_at || entry.created_at;
    const coverImageUrl = vault.cover_image_url
      ? await getStorageObjectUrl(vault.cover_image_url, { bucket: "vault-covers", expiresIn: 60 * 60 * 24 * 7 })
      : null;

    for (const recipientUserId of recipientSet) {
      const key = `${entry.id}:${recipientUserId}`;
      if (sentKeys.has(key)) {
        skippedAlreadySent += 1;
        continue;
      }

      const profile = profileById.get(recipientUserId);
      if (!profile?.email) {
        skippedMissingProfile += 1;
        continue;
      }

      if (!notificationsEnabled(profile.notification_preferences)) {
        skippedPreferences += 1;
        continue;
      }

      if (dryRun) {
        plannedEmails += 1;
        if (previewRecipients.length < 20) {
          previewRecipients.push({
            entryId: entry.id,
            entryTitle: entry.title,
            vaultId: vault.id,
            vaultName: vault.name,
            recipientUserId,
            recipientEmail: profile.email,
            unlockedAt: formatUnlockedAt(unlockedAt, profile.timezone),
          });
        }
        continue;
      }

      try {
        const result = await sendUnlockReadyEmail({
          to: profile.email,
          recipientName: profile.full_name,
          vaultId: vault.id,
          vaultName: vault.name,
          entryId: entry.id,
          entryTitle: entry.title,
          unlockedAt: formatUnlockedAt(unlockedAt, profile.timezone),
          subjectName: vault.subject_name,
          coverImageUrl,
        });

        if (result.status === "skipped") {
          skippedEmailNotConfigured += 1;
          continue;
        }

        rowsToInsert.push({
          entry_id: entry.id,
          recipient_user_id: recipientUserId,
          recipient_email: profile.email,
        });
        sentKeys.add(key);
        emailsSent += 1;
      } catch (error) {
        failures.push(`${profile.email}: ${error instanceof Error ? error.message : "Email delivery failed."}`);
      }
    }
  }

  if (!dryRun && rowsToInsert.length > 0) {
    const { error: insertError } = await supabaseAdmin.from("entry_unlock_notifications").insert(rowsToInsert);
    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  return {
    dryRun,
    processedEntries: unlockedEntries.length,
    emailsSent,
    plannedEmails,
    skippedAlreadySent,
    skippedPreferences,
    skippedMissingProfile,
    skippedEmailNotConfigured,
    notificationLogAvailable,
    previewRecipients,
    failures,
  };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = ["1", "true", "yes"].includes((request.nextUrl.searchParams.get("dryRun") ?? "").toLowerCase());

  try {
    const result = await runUnlockNotifications({ dryRun });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to process unlock notifications.", dryRun },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
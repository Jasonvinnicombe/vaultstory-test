const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

function loadEnvFile(file) {
  const env = {};
  const text = fs.readFileSync(file, 'utf8');

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const index = line.indexOf('=');
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    env[key] = value.replace(/^['"]|['"]$/g, '');
  }

  return env;
}

function getEntryStatus(entry) {
  if (entry.milestone_achieved_at) return 'unlocked';
  if (!entry.unlock_at) return 'locked';
  return new Date(entry.unlock_at).getTime() <= Date.now() ? 'unlocked' : 'locked';
}

function isMissingNotificationLogTable(message) {
  return /entry_unlock_notifications/i.test(message) && /(schema cache|could not find the table)/i.test(message);
}

(async () => {
  const env = loadEnvFile('.env.local');
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'RESEND_FROM_EMAIL', 'UNLOCK_NOTIFICATIONS_CRON_SECRET'];
  const missing = required.filter((key) => !env[key]);

  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: entries, error: entriesError } = await supabase
    .from('vault_entries')
    .select('id,vault_id,title,created_at,unlock_type,unlock_at,milestone_label,milestone_achieved_at')
    .limit(200);

  if (entriesError) throw entriesError;

  const unlockedEntries = (entries ?? []).filter((entry) => getEntryStatus(entry) === 'unlocked');
  const vaultIds = [...new Set(unlockedEntries.map((entry) => entry.vault_id))];

  const [{ data: vaults, error: vaultsError }, { data: members, error: membersError }] = await Promise.all([
    vaultIds.length
      ? supabase.from('vaults').select('id,name,subject_name,owner_user_id').in('id', vaultIds)
      : Promise.resolve({ data: [], error: null }),
    vaultIds.length
      ? supabase.from('vault_members').select('vault_id,user_id').in('vault_id', vaultIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (vaultsError) throw vaultsError;
  if (membersError) throw membersError;

  const recipientIds = new Set();
  const recipientsByVault = new Map();

  for (const vault of vaults ?? []) {
    recipientsByVault.set(vault.id, new Set([vault.owner_user_id]));
    recipientIds.add(vault.owner_user_id);
  }

  for (const member of members ?? []) {
    if (!recipientsByVault.has(member.vault_id)) recipientsByVault.set(member.vault_id, new Set());
    recipientsByVault.get(member.vault_id).add(member.user_id);
    recipientIds.add(member.user_id);
  }

  const { data: profiles, error: profilesError } = recipientIds.size
    ? await supabase.from('profiles').select('id,email,full_name,timezone,notification_preferences').in('id', [...recipientIds])
    : { data: [], error: null };

  if (profilesError) throw profilesError;

  let notificationLogAvailable = true;
  let existingLogs = [];
  if (unlockedEntries.length) {
    const { data, error } = await supabase
      .from('entry_unlock_notifications')
      .select('entry_id,recipient_user_id')
      .in('entry_id', unlockedEntries.map((entry) => entry.id));

    if (error) {
      if (isMissingNotificationLogTable(error.message)) {
        notificationLogAvailable = false;
      } else {
        throw error;
      }
    } else {
      existingLogs = data ?? [];
    }
  }

  const sentKeys = new Set(existingLogs.map((row) => `${row.entry_id}:${row.recipient_user_id}`));
  const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const vaultById = new Map((vaults ?? []).map((vault) => [vault.id, vault]));

  const previewRecipients = [];
  let plannedEmails = 0;

  for (const entry of unlockedEntries) {
    const vault = vaultById.get(entry.vault_id);
    if (!vault) continue;

    for (const recipientUserId of recipientsByVault.get(entry.vault_id) ?? []) {
      const key = `${entry.id}:${recipientUserId}`;
      if (sentKeys.has(key)) continue;
      const profile = profileById.get(recipientUserId);
      if (!profile?.email) continue;
      if (profile.notification_preferences && profile.notification_preferences.unlockDigest === false) continue;

      plannedEmails += 1;
      if (previewRecipients.length < 10) {
        previewRecipients.push({
          entryId: entry.id,
          entryTitle: entry.title,
          vaultName: vault.name,
          recipientEmail: profile.email,
          unlockedAt: entry.milestone_achieved_at || entry.unlock_at || entry.created_at,
        });
      }
    }
  }

  console.log(JSON.stringify({
    envConfigured: true,
    unlockedEntries: unlockedEntries.length,
    notificationLogAvailable,
    plannedEmails,
    previewRecipients,
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

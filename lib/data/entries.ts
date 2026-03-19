import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { getEntryStatus, isUnlocked, type VaultEntry } from "@/lib/entries";

export const getDashboardEntries = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vault_entries")
    .select("*, entry_assets(*)")
    .eq("user_id", userId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const entries = (data ?? []) as VaultEntry[];

  const total = entries.length;
  const unlocked = entries.filter((entry) => isUnlocked(entry));
  const locked = entries.filter((entry) => getEntryStatus(entry) === "locked");
  const soon = entries.filter((entry) => getEntryStatus(entry) === "soon");

  return {
    entries,
    stats: {
      total,
      unlocked: unlocked.length,
      locked: locked.length,
      soon: soon.length,
      nextUnlock:
        [...entries]
          .filter((entry) => !isUnlocked(entry) && entry.unlock_at)
          .sort((a, b) => new Date(a.unlock_at!).getTime() - new Date(b.unlock_at!).getTime())[0] ?? null,
      recentUnlocked: unlocked.slice(0, 3),
    },
  };
});

export const getEntryById = cache(async (id: string, userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vault_entries")
    .select("*, entry_assets(*)")
    .eq("id", id)
    .eq("user_id", userId)
    .eq("is_deleted", false)
    .maybeSingle();

  if (error) throw error;

  return data as VaultEntry | null;
});


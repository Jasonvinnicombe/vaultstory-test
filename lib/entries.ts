import { addDays, formatDistanceToNowStrict, isBefore, isWithinInterval, parseISO } from "date-fns";

import { UPCOMING_UNLOCK_WINDOW_DAYS } from "@/lib/constants";
import { resolveAgeMilestoneUnlock, resolveRelativeUnlock } from "@/lib/date";
import { formatTags } from "@/lib/utils";
import type { Database } from "@/types/database";

export type VaultEntry = Database["public"]["Tables"]["vault_entries"]["Row"] & {
  entry_assets?: Database["public"]["Tables"]["entry_assets"]["Row"][];
};

export type EntryStatus = "draft" | "locked" | "soon" | "unlocked";

export function resolveUnlockAt(input: {
  unlockType: VaultEntry["unlock_type"] | "age_milestone" | "draft";
  unlockAt?: string | null;
  relativeAmount?: number;
  relativeUnit?: "months" | "years";
  subjectBirthdate?: string | null;
  ageMilestone?: number;
}) {
  if (input.unlockType === "date") {
    return input.unlockAt ? new Date(input.unlockAt) : null;
  }

  if (input.unlockType === "relative_duration" && input.relativeAmount && input.relativeUnit) {
    return resolveRelativeUnlock(input.relativeAmount, input.relativeUnit);
  }

  if (input.unlockType === "age_milestone" && input.subjectBirthdate && input.ageMilestone) {
    return resolveAgeMilestoneUnlock(input.subjectBirthdate, input.ageMilestone);
  }

  return null;
}

export function isDraftEntry(entry: Pick<VaultEntry, "unlock_type" | "unlock_at" | "milestone_label" | "milestone_achieved_at">) {
  return (
    entry.unlock_type === "manual_milestone" &&
    !entry.unlock_at &&
    !entry.milestone_label &&
    !entry.milestone_achieved_at
  );
}

export function getEntryStatus(entry: Pick<VaultEntry, "unlock_type" | "unlock_at" | "milestone_label" | "milestone_achieved_at">): EntryStatus {
  if (entry.milestone_achieved_at) return "unlocked";
  if (isDraftEntry(entry)) return "draft";
  if (!entry.unlock_at) return "locked";

  const unlockDate = parseISO(entry.unlock_at);
  const now = new Date();

  if (isBefore(unlockDate, now) || unlockDate.getTime() <= now.getTime()) {
    return "unlocked";
  }

  if (isWithinInterval(unlockDate, { start: now, end: addDays(now, UPCOMING_UNLOCK_WINDOW_DAYS) })) {
    return "soon";
  }

  return "locked";
}

export function isUnlocked(entry: Pick<VaultEntry, "unlock_type" | "unlock_at" | "milestone_label" | "milestone_achieved_at">) {
  return getEntryStatus(entry) === "unlocked";
}

export function normalizeTags(tags?: string) {
  return formatTags(tags ?? "");
}

export function getCountdownParts(unlockAt: string | null) {
  if (!unlockAt) {
    return null;
  }

  const target = parseISO(unlockAt);
  const now = new Date();

  if (target.getTime() <= now.getTime()) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalMs = target.getTime() - now.getTime();
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);

  return { totalMs, days, hours, minutes, seconds };
}

export function getRecordedAgoLabel(createdAt: string) {
  return formatDistanceToNowStrict(parseISO(createdAt), { addSuffix: true });
}

import { Badge } from "@/components/ui/badge";
import { getEntryStatus, type EntryStatus } from "@/lib/entries";
import type { Database } from "@/types/database";

type EntryRow = Database["public"]["Tables"]["vault_entries"]["Row"];

const labels: Record<EntryStatus, string> = {
  draft: "Draft",
  locked: "Locked",
  soon: "Upcoming",
  unlocked: "Unlocked",
};

const variants: Record<EntryStatus, "outline" | "secondary" | "default"> = {
  draft: "secondary",
  locked: "default",
  soon: "secondary",
  unlocked: "default",
};

export function EntryStatusBadge({ entry }: { entry: Pick<EntryRow, "unlock_type" | "unlock_at" | "milestone_label" | "milestone_achieved_at"> }) {
  const status = getEntryStatus(entry);

  return <Badge variant={variants[status]} className={status === "locked" ? "heartbeat-pulse bg-secondary text-slate-900 shadow-[0_10px_30px_rgba(230,184,106,0.35)] ring-1 ring-secondary/70" : undefined}>{labels[status]}</Badge>;
}



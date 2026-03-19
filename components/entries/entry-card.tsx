import Link from "next/link";
import { CalendarClock } from "lucide-react";

import { EntryStatusBadge } from "@/components/entries/entry-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/date";
import { getEntryStatus } from "@/lib/entries";
import type { Database } from "@/types/database";

type EntryCardProps = { entry: Database["public"]["Tables"]["vault_entries"]["Row"]; timeline?: boolean };

export function EntryCard({ entry, timeline = false }: EntryCardProps) {
  const status = getEntryStatus(entry);
  const unlockLabel = status === "draft"
    ? "Draft - keep editing until you're ready to seal it"
    : entry.unlock_at
      ? formatDateTime(entry.unlock_at)
      : entry.milestone_label ?? "Manual unlock";

  return (
    <div className={timeline ? "relative pl-9 sm:pl-12" : ""}>
      {timeline ? (
        <>
          <div className="absolute left-3 top-0 h-full w-px bg-[linear-gradient(180deg,rgba(164,136,110,0.45),rgba(164,136,110,0.05))]" />
          <div className="absolute left-0 top-7 flex h-7 w-7 items-center justify-center rounded-full border-4 border-background bg-primary shadow-[0_10px_22px_rgba(61,41,28,0.14)]" />
        </>
      ) : null}
      <Link href={`/entries/${entry.id}`}>
        <Card className="glass-panel transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_58px_rgba(66,46,31,0.11)]">
          <CardContent className="p-6 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground sm:text-[1.02rem]">{entry.title}</h3>
                <p className="flex items-center gap-2 text-sm leading-7 text-muted-foreground"><CalendarClock className="h-4 w-4" />{unlockLabel}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {entry.mood ? <Badge variant="secondary">{entry.mood}</Badge> : null}
                <EntryStatusBadge entry={entry} />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

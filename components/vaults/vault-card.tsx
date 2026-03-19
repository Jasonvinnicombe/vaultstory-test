import Link from "next/link";
import { CalendarClock, FolderLock, PencilLine, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type VaultCardProps = {
  id: string;
  name: string;
  vaultType: string;
  subjectName: string | null;
  entryCount: number;
  nextUnlockDate: string | null;
  coverImagePreviewUrl: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "No unlock scheduled";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function VaultCard({ id, name, vaultType, subjectName, entryCount, nextUnlockDate, coverImagePreviewUrl }: VaultCardProps) {
  return (
    <Card className="h-full border-white/60 bg-card/85 transition-transform hover:-translate-y-0.5 hover:shadow-glow">
      <CardContent className="space-y-5 p-6">
        <Link href={`/vaults/${id}`} className="group block rounded-[24px] outline-none transition focus-visible:ring-2 focus-visible:ring-ring/80">
          {coverImagePreviewUrl ? (
            <div className="mb-5 overflow-hidden rounded-[24px] border border-white/50 bg-muted/40 shadow-[0_12px_30px_rgba(66,46,31,0.08)]">
              <img
                src={coverImagePreviewUrl}
                alt={`${name} cover image`}
                className="h-28 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            </div>
          ) : null}

          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl text-foreground">{name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{subjectName ? `${vaultType} for ${subjectName}` : vaultType}</p>
            </div>
            <Badge variant="secondary">{vaultType}</Badge>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <FolderLock className="h-4 w-4" />
              <span>{entryCount} entries</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{subjectName ?? "Private vault"}</span>
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              <span>Next unlock: {formatDate(nextUnlockDate)}</span>
            </div>
          </div>
        </Link>

        <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost" className="justify-start px-0 hover:bg-transparent">
            <Link href={`/vaults/${id}`}>Open vault</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/vaults/${id}/settings`}><PencilLine className="h-4 w-4" />Edit vault</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

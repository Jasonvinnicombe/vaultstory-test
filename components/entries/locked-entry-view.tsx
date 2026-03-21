import { CalendarClock, LockKeyhole } from "lucide-react";

import { CountdownTimer } from "@/components/entries/countdown-timer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/date";
import { getRecordedAgoLabel } from "@/lib/entries";

export function LockedEntryView(props: { title: string; createdAt: string; unlockAt: string | null; milestoneLabel: string | null; canCompleteMilestone: boolean; milestoneForm?: React.ReactNode }) {
  return (
    <Card className="overflow-hidden border-white/12 bg-[radial-gradient(circle_at_18%_20%,rgba(113,157,255,0.18),transparent_28%),radial-gradient(circle_at_82%_14%,rgba(230,184,106,0.14),transparent_22%),radial-gradient(circle_at_50%_120%,rgba(117,203,255,0.16),transparent_34%),linear-gradient(180deg,rgba(17,28,52,0.98),rgba(28,44,82,0.96)_58%,rgba(38,58,106,0.94))] text-white shadow-[0_34px_92px_rgba(30,42,68,0.28)]">
      <CardContent className="space-y-8 p-8 sm:p-9 lg:p-11">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="section-stack max-w-2xl">
            <p className="text-sm uppercase tracking-[0.22em] text-white/72">Locked memory</p>
            <h1 className="text-balance font-display text-4xl lg:text-5xl">{props.title}</h1>
            <p className="text-sm leading-7 text-white/88">Recorded {getRecordedAgoLabel(props.createdAt)}</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/12 bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"><LockKeyhole className="h-7 w-7 text-secondary" /></div>
        </div>

        <div className="grid gap-4 rounded-[30px] border border-white/16 bg-white/10 p-6 md:grid-cols-2">
          <div><p className="text-xs uppercase tracking-[0.2em] text-white/70">Created</p><p className="mt-2 text-sm leading-7 text-white/94">{formatDateTime(props.createdAt)}</p></div>
          <div><p className="text-xs uppercase tracking-[0.2em] text-white/70">Unlocks</p><p className="mt-2 text-sm leading-7 text-white/94">{props.unlockAt ? formatDateTime(props.unlockAt) : props.milestoneLabel ?? "Manual milestone"}</p></div>
        </div>

        <div className="space-y-4"><p className="inline-flex items-center gap-2 text-sm text-white/88"><CalendarClock className="h-4 w-4" />Countdown to reveal</p><CountdownTimer unlockAt={props.unlockAt} /></div>

        {props.canCompleteMilestone ? <div className="rounded-[30px] border border-white/16 bg-white/10 p-6"><p className="text-sm leading-7 text-white/92">This entry opens with a manual milestone. Mark it complete when the moment truly arrives.</p><div className="mt-4">{props.milestoneForm}</div></div> : null}
        {!props.canCompleteMilestone && !props.unlockAt ? <Button variant="secondary" disabled>Waiting for milestone completion</Button> : null}
      </CardContent>
    </Card>
  );
}

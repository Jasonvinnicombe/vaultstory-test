import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, FilePenLine, LockKeyhole } from "lucide-react";

import { EntryStatusBadge } from "@/components/entries/entry-status-badge";
import { LockedEntryView } from "@/components/entries/locked-entry-view";
import { MilestoneCompleteForm } from "@/components/entries/milestone-complete-form";
import { ReflectionForm } from "@/components/entries/reflection-form";
import { RevealExperience } from "@/components/entries/reveal-experience";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProfile } from "@/lib/auth";
import { formatDateTime } from "@/lib/date";
import { getEntryStatus, isDraftEntry } from "@/lib/entries";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { profile, user, avatarPreviewUrl }] = await Promise.all([params, getProfile()]);
  const supabase = await createClient();

  const { data: entry } = await supabase.from("vault_entries").select("*").eq("id", id).maybeSingle();
  if (!entry) notFound();

  const [{ data: vault }, { data: assetRows }, { data: tagRows }] = await Promise.all([
    supabase.from("vaults").select("*").eq("id", entry.vault_id).maybeSingle(),
    supabase.from("entry_assets").select("*").eq("entry_id", id),
    supabase.from("entry_tags").select("*").eq("entry_id", id),
  ]);

  if (!vault) notFound();

  const signedAssets = await Promise.all(
    (assetRows ?? []).map(async (asset) => {
      const signedUrl =
        (await supabaseAdmin.storage.from("entry-assets").createSignedUrl(asset.file_url, 60 * 10)).data
          ?.signedUrl ?? null;

      return {
        id: asset.id,
        fileUrl: signedUrl ?? asset.file_url,
        fileType: asset.file_type,
      };
    }),
  );

  const tags = (tagRows ?? []).map((tag) => tag.tag);
  const status = getEntryStatus(entry);
  const canCompleteMilestone =
    entry.unlock_type === "manual_milestone" && !entry.milestone_achieved_at && !isDraftEntry(entry);

  return (
    <AppShell fullName={profile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="space-y-6 sm:space-y-7">
        <Card className="overflow-hidden border-white/60 bg-card/84 shadow-[0_24px_64px_rgba(66,46,31,0.1)]">
          <CardContent className="flex flex-col gap-5 p-7 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
            <div className="section-stack max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="w-fit bg-secondary/88">Memory reveal</Badge>
                <EntryStatusBadge entry={entry} />
              </div>
              <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">{entry.title}</h1>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                Inside {vault.name} for {vault.subject_name ?? "the future"}.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">
                  <CalendarClock className="h-4 w-4" />
                  {status === "draft"
                    ? "Draft - not sealed yet"
                    : entry.unlock_at
                      ? formatDateTime(entry.unlock_at)
                      : entry.milestone_label ?? "Manual milestone"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">
                  Recorded {formatDateTime(entry.created_at)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={`/vaults/${vault.id}`}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to vault
                </Link>
              </Button>
              {status === "draft" ? (
                <Button asChild>
                  <Link href={`/entries/${entry.id}/edit`}>
                    <FilePenLine className="h-4 w-4" />
                    Continue editing
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={`/vaults/${vault.id}/entries/new`}>Add another memory</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {status === "draft" ? (
          <Card className="overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(243,236,227,0.8))] shadow-[0_24px_64px_rgba(66,46,31,0.1)]">
            <CardContent className="space-y-6 p-8 sm:p-10">
              <div className="section-stack max-w-3xl">
                <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Draft memory</p>
                <h2 className="text-balance font-display text-4xl text-foreground sm:text-5xl">Save now. Seal when it feels complete.</h2>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                  This entry is still unsealed, so you can come back, add more media, refine the message, and only choose the unlock moment when you're ready.
                </p>
              </div>

              {entry.content_text ? (
                <div className="rounded-[30px] border border-white/65 bg-background/76 p-6 sm:p-8">
                  <p className="whitespace-pre-wrap text-base leading-8 text-foreground/86">{entry.content_text}</p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/entries/${entry.id}/edit`}>
                    <FilePenLine className="h-4 w-4" />
                    Continue editing
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/entries/${entry.id}/edit?step=2`}>
                    <LockKeyhole className="h-4 w-4" />
                    Seal this entry
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : status !== "unlocked" ? (
          <LockedEntryView
            title={entry.title}
            createdAt={entry.created_at}
            unlockAt={entry.unlock_at}
            milestoneLabel={entry.milestone_label}
            canCompleteMilestone={canCompleteMilestone}
            milestoneForm={
              canCompleteMilestone ? (
                <MilestoneCompleteForm entryId={entry.id} vaultId={entry.vault_id} />
              ) : undefined
            }
          />
        ) : (
          <RevealExperience
            title={entry.title}
            createdAt={entry.created_at}
            contentText={entry.content_text}
            mood={entry.mood}
            tags={tags}
            predictionText={entry.prediction_text}
            realityText={entry.reality_text}
            assets={signedAssets}
            reflectionForm={
              entry.reality_text ? undefined : <ReflectionForm entryId={entry.id} vaultId={entry.vault_id} />
            }
          />
        )}
      </div>
    </AppShell>
  );
}

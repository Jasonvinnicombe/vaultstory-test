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
import { formatDowngradeGraceDate, hasPaidFeatureAccess } from "@/lib/billing";
import { getProfile } from "@/lib/auth";
import { formatDateTime } from "@/lib/date";
import { getEntryStatus, isDraftEntry, isPremiumUnlockBlocked } from "@/lib/entries";
import { getStorageObjectUrl } from "@/lib/storage";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type EntryRow = Database["public"]["Tables"]["vault_entries"]["Row"];
type VaultRow = Database["public"]["Tables"]["vaults"]["Row"];
type AssetRow = Database["public"]["Tables"]["entry_assets"]["Row"];
type TagRow = Database["public"]["Tables"]["entry_tags"]["Row"];

export default async function EntryPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ preview?: string }> }) {
  const [{ id }, rawSearchParams, { profile, user, avatarPreviewUrl }] = await Promise.all([params, searchParams ?? Promise.resolve({}), getProfile()]);
  const resolvedSearchParams = rawSearchParams as { preview?: string };
  const supabase = (profile?.is_admin ? supabaseAdmin : await createClient()) as typeof supabaseAdmin;

  const { data: entry } = await supabase.from("vault_entries").select("*").eq("id", id).maybeSingle();
  const typedEntry = entry as EntryRow | null;
  if (!typedEntry) notFound();

  const [{ data: vault }, { data: assetRows }, { data: tagRows }] = await Promise.all([
    supabase.from("vaults").select("*").eq("id", typedEntry.vault_id).maybeSingle(),
    supabase.from("entry_assets").select("*").eq("entry_id", id),
    supabase.from("entry_tags").select("*").eq("entry_id", id),
  ]);

  const typedVault = vault as VaultRow | null;
  const typedAssets = (assetRows ?? []) as AssetRow[];
  const typedTags = (tagRows ?? []) as TagRow[];
  if (!typedVault) notFound();

  const { data: ownerProfile } = await supabaseAdmin
    .from("profiles")
    .select("membership_plan,membership_status,downgrade_grace_until")
    .eq("id", typedVault.owner_user_id)
    .maybeSingle();

  const fallbackProfile = profile as { full_name?: string | null; membership_plan?: string | null; membership_status?: string | null } | null;
  const hasPremiumUnlockEntitlement = hasPaidFeatureAccess(ownerProfile?.membership_plan ?? fallbackProfile?.membership_plan, ownerProfile?.membership_status ?? fallbackProfile?.membership_status);
  const tags = typedTags.map((tag) => tag.tag);
  const status = getEntryStatus(typedEntry, { hasPremiumUnlockEntitlement });
  const premiumUnlockBlocked = isPremiumUnlockBlocked(typedEntry, { hasPremiumUnlockEntitlement });
  const adminPreview = Boolean(profile?.is_admin && resolvedSearchParams.preview === "1" && status !== "draft");
  const downloadQuery = adminPreview ? "?preview=1" : "";
  const graceDate = formatDowngradeGraceDate(ownerProfile?.downgrade_grace_until);

  const signedAssets = (
    await Promise.all(
      typedAssets.map(async (asset) => {
        if (/^https?:\/\//i.test(asset.file_url)) {
          return {
            id: asset.id,
            fileUrl: asset.file_url,
            fileType: asset.file_type,
            downloadUrl: `/api/entry-assets/${asset.id}/download${downloadQuery}`,
          };
        }

        try {
          const fileUrl = await getStorageObjectUrl(asset.file_url, { bucket: "entry-assets", expiresIn: 60 * 10 });

          if (!fileUrl) {
            return null;
          }

          return {
            id: asset.id,
            fileUrl,
            fileType: asset.file_type,
            downloadUrl: `/api/entry-assets/${asset.id}/download${downloadQuery}`,
          };
        } catch {
          return null;
        }
      }),
    )
  ).filter((asset): asset is { id: string; fileUrl: string; fileType: string; downloadUrl: string } => Boolean(asset));

  const canCompleteMilestone =
    typedEntry.unlock_type === "manual_milestone" &&
    !typedEntry.milestone_achieved_at &&
    !isDraftEntry(typedEntry) &&
    !profile?.is_admin &&
    hasPremiumUnlockEntitlement;

  const shouldReveal = status === "unlocked" || adminPreview;
  const restrictionMessage = premiumUnlockBlocked
    ? graceDate
      ? `This milestone unlock is paused because the subscription attached to this vault is no longer active. Resume Premium or Family, and once the intended unlock condition is satisfied, this memory can open again. Downgraded accounts have until ${graceDate} to remove files that exceed the free storage allowance.`
      : "This milestone unlock is paused because the subscription attached to this vault is no longer active. Resume Premium or Family, and once the intended unlock condition is satisfied, this memory can open again."
    : null;

  return (
    <AppShell fullName={fallbackProfile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="space-y-6 sm:space-y-7">
        <Card className="overflow-hidden border-white/60 bg-card/84 shadow-[0_24px_64px_rgba(66,46,31,0.1)]">
          <CardContent className="flex flex-col gap-5 p-7 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
            <div className="section-stack max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="w-fit bg-secondary/88">Memory reveal</Badge>
                <EntryStatusBadge entry={typedEntry} hasPremiumUnlockEntitlement={hasPremiumUnlockEntitlement} />
              </div>
              <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">{typedEntry.title}</h1>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                Inside {typedVault.name} for {typedVault.subject_name ?? "the future"}.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">
                  <CalendarClock className="h-4 w-4" />
                  {status === "draft"
                    ? "Draft - not sealed yet"
                    : premiumUnlockBlocked
                      ? "Subscription required to reopen this unlock"
                      : typedEntry.unlock_at
                        ? formatDateTime(typedEntry.unlock_at)
                        : typedEntry.milestone_label ?? "Manual milestone"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">
                  Recorded {formatDateTime(typedEntry.created_at)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={`/vaults/${typedVault.id}`}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to vault
                </Link>
              </Button>
              {status === "draft" ? (
                <Button asChild>
                  <Link href={`/entries/${typedEntry.id}/edit`}>
                    <FilePenLine className="h-4 w-4" />
                    Continue editing
                  </Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link href={`/vaults/${typedVault.id}/entries/new`}>Add another memory</Link>
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

              {typedEntry.content_text ? (
                <div className="rounded-[30px] border border-white/65 bg-background/76 p-6 sm:p-8">
                  <p className="whitespace-pre-wrap text-base leading-8 text-foreground/86">{typedEntry.content_text}</p>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/entries/${typedEntry.id}/edit`}>
                    <FilePenLine className="h-4 w-4" />
                    Continue editing
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={`/entries/${typedEntry.id}/edit?step=2`}>
                    <LockKeyhole className="h-4 w-4" />
                    Seal this entry
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : !shouldReveal ? (
          <LockedEntryView
            title={typedEntry.title}
            createdAt={typedEntry.created_at}
            unlockAt={typedEntry.unlock_at}
            milestoneLabel={typedEntry.milestone_label}
            canCompleteMilestone={canCompleteMilestone}
            milestoneForm={
              canCompleteMilestone ? (
                <MilestoneCompleteForm entryId={typedEntry.id} vaultId={typedEntry.vault_id} />
              ) : undefined
            }
            adminPreviewHref={profile?.is_admin ? `/entries/${typedEntry.id}?preview=1` : undefined}
            adminPreviewLabel="Preview entry as admin"
            restrictionMessage={restrictionMessage}
          />
        ) : (
          <>
            {adminPreview ? (
              <Card className="border-white/60 bg-secondary/40">
                <div className="flex h-12 items-center px-5 text-left text-sm text-foreground">
                  Admin preview only. This does not unlock the entry for the customer.
                </div>
              </Card>
            ) : null}
            <RevealExperience
              title={typedEntry.title}
              createdAt={typedEntry.created_at}
              contentText={typedEntry.content_text}
              mood={typedEntry.mood}
              tags={tags}
              predictionText={typedEntry.prediction_text}
              realityText={typedEntry.reality_text}
              assets={signedAssets}
              reflectionForm={
                adminPreview ? undefined : typedEntry.reality_text ? undefined : <ReflectionForm entryId={typedEntry.id} vaultId={typedEntry.vault_id} initialValue={typedEntry.reality_text ?? ""} />
              }
            />
          </>
        )}
      </div>
    </AppShell>
  );
}
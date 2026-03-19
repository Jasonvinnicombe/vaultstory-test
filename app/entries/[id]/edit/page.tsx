import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import { EntryCreateForm } from "@/components/forms/entry-create-form";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMembershipLabel } from "@/lib/billing";
import { getProfile } from "@/lib/auth";
import { getEntryStatus } from "@/lib/entries";
import { createClient } from "@/lib/supabase/server";

export default async function EditDraftEntryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ step?: string }>;
}) {
  const [{ id }, resolvedSearchParams, { profile, user, avatarPreviewUrl }] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({}),
    getProfile(),
  ]);
  const supabase = await createClient();

  const { data: entry } = await supabase.from("vault_entries").select("*").eq("id", id).maybeSingle();
  if (!entry) {
    notFound();
  }

  if (getEntryStatus(entry) !== "draft") {
    redirect(`/entries/${id}`);
  }

  const [{ data: vault }, { data: tagRows }, { data: assetRows }] = await Promise.all([
    supabase.from("vaults").select("id, name, subject_name, subject_birthdate").eq("id", entry.vault_id).maybeSingle(),
    supabase.from("entry_tags").select("tag").eq("entry_id", id),
    supabase.from("entry_assets").select("id, file_url").eq("entry_id", id),
  ]);

  if (!vault) {
    notFound();
  }

  const startStep = Number.parseInt(resolvedSearchParams.step ?? "0", 10);

  return (
    <AppShell fullName={profile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="section-stack">
        <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
          <CardContent className="p-8 sm:p-10">
            <Badge className="mb-5 bg-secondary/85">Draft editing</Badge>
            <h1 className="max-w-3xl text-balance font-display text-4xl text-foreground sm:text-5xl">Keep shaping this memory for {vault.subject_name ?? vault.name}.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Add more while it is still open, then seal it with the unlock moment when you're ready.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Your current plan is <strong className="text-foreground">{getMembershipLabel(profile?.membership_plan)}</strong>.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={`/entries/${entry.id}`}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to draft
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/entries/${entry.id}/edit?step=2`}>
                  <LockKeyhole className="h-4 w-4" />
                  Go to sealing step
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <EntryCreateForm
          vaultId={vault.id}
          subjectBirthdate={vault.subject_birthdate}
          currentPlan={profile?.membership_plan ?? "free"}
          entryId={entry.id}
          startStep={startStep}
          existingEntryType={entry.entry_type}
          initialValues={{
            title: entry.title,
            message: entry.content_text ?? "",
            unlockType: "draft",
            mood: entry.mood ?? "",
            tags: (tagRows ?? []).map((tag) => tag.tag).join(", "),
            predictionText: entry.prediction_text ?? "",
          }}
          existingAssets={(assetRows ?? []).map((asset) => ({
            id: asset.id,
            label: asset.file_url.split("/").pop() ?? asset.file_url,
          }))}
        />
      </div>
    </AppShell>
  );
}

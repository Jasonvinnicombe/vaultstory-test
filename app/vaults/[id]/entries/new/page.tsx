import { notFound } from "next/navigation";

import { EntryCreateForm } from "@/components/forms/entry-create-form";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMembershipLabel } from "@/lib/billing";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function NewEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { profile, user, avatarPreviewUrl }] = await Promise.all([params, getProfile()]);
  const supabase = await createClient();
  const { data: vault } = await supabase.from("vaults").select("id, name, subject_name, subject_birthdate").eq("id", id).maybeSingle();

  if (!vault) {
    notFound();
  }

  return (
    <AppShell fullName={profile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="section-stack">
        <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
          <CardContent className="p-8 sm:p-10">
            <Badge className="mb-5 bg-secondary/85">Entry creation</Badge>
            <h1 className="max-w-3xl text-balance font-display text-4xl text-foreground sm:text-5xl">Create a memory for {vault.subject_name ?? vault.name}.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Capture the message, media, and timing for the exact moment this memory should return inside {vault.name}.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Your current plan is <strong className="text-foreground">{getMembershipLabel(profile?.membership_plan)}</strong>. Rich media, family invites, and milestone unlocks unlock on paid plans.
            </p>
          </CardContent>
        </Card>
        <EntryCreateForm vaultId={vault.id} subjectBirthdate={vault.subject_birthdate} currentPlan={profile?.membership_plan ?? "free"} />
      </div>
    </AppShell>
  );
}

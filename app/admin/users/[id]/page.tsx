import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { getEffectiveStorageQuotaGb, getMembershipLabel } from "@/lib/billing";
import { supabaseAdmin } from "@/lib/supabase/admin";

function formatDate(value: string | null | undefined) {
  if (!value) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatStorageLabel(value: number) {
  if (!Number.isFinite(value)) {
    return "Unlimited storage";
  }

  return `${value}GB storage`;
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, { profile, user, avatarPreviewUrl }] = await Promise.all([params, requireAdmin()]);

  const { data: targetUser } = await supabaseAdmin
    .from("profiles")
    .select("id,email,full_name,is_admin,membership_plan,membership_status,storage_quota_gb,created_at")
    .eq("id", id)
    .maybeSingle();

  if (!targetUser) {
    notFound();
  }

  const [{ count: ownedVaultCount }, { count: memberVaultCount }, { count: entryCount }, { data: ownedVaults }] = await Promise.all([
    supabaseAdmin.from("vaults").select("id", { head: true, count: "exact" }).eq("owner_user_id", id),
    supabaseAdmin.from("vault_members").select("id", { head: true, count: "exact" }).eq("user_id", id),
    supabaseAdmin.from("vault_entries").select("id", { head: true, count: "exact" }).eq("user_id", id),
    supabaseAdmin.from("vaults").select("id,name,subject_name,created_at").eq("owner_user_id", id).order("created_at", { ascending: false }).limit(6),
  ]);

  const effectiveStorage = getEffectiveStorageQuotaGb(
    targetUser.membership_plan,
    targetUser.membership_status,
    targetUser.storage_quota_gb,
  );

  return (
    <AppShell
      fullName={profile?.full_name ?? user.user_metadata.full_name ?? null}
      email={user.email ?? ""}
      isAdmin={profile?.is_admin ?? false}
      avatarUrl={avatarPreviewUrl}
    >
      <div className="section-stack">
        <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
          <CardContent className="flex flex-col gap-5 p-8 sm:p-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge className="mb-5 bg-secondary/85">User detail</Badge>
              <h1 className="max-w-3xl text-balance font-display text-4xl text-foreground sm:text-5xl">{targetUser.full_name ?? targetUser.email}</h1>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">{targetUser.email}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">Plan: {getMembershipLabel(targetUser.membership_plan)}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">Status: {targetUser.membership_status.replace("_", " ")}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">{formatStorageLabel(effectiveStorage)}</span>
                {targetUser.is_admin ? <span className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-primary-foreground">Admin</span> : null}
              </div>
            </div>
            <Button asChild variant="outline"><Link href="/admin/users">Back to users</Link></Button>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="glass-panel"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Joined</p><p className="mt-2 font-display text-3xl">{formatDate(targetUser.created_at)}</p></CardContent></Card>
          <Card className="glass-panel"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Owned vaults</p><p className="mt-2 font-display text-3xl">{ownedVaultCount ?? 0}</p></CardContent></Card>
          <Card className="glass-panel"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Collaborating in</p><p className="mt-2 font-display text-3xl">{memberVaultCount ?? 0}</p></CardContent></Card>
          <Card className="glass-panel"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Entries created</p><p className="mt-2 font-display text-3xl">{entryCount ?? 0}</p></CardContent></Card>
        </section>

        <Card className="border-white/60 bg-card/88 shadow-[0_20px_64px_rgba(66,46,31,0.08)]">
          <CardContent className="space-y-4 p-8">
            <div className="section-stack">
              <h2 className="font-display text-3xl text-foreground">Access summary</h2>
              <p className="text-sm leading-7 text-muted-foreground">This gives you a quick view of how the account is currently configured.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-border/70 bg-background/80 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Membership</p>
                <p className="mt-3 text-lg font-medium text-foreground">{getMembershipLabel(targetUser.membership_plan)}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">Status: {targetUser.membership_status.replace("_", " ")}</p>
              </div>
              <div className="rounded-[28px] border border-border/70 bg-background/80 p-5">
                <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Storage</p>
                <p className="mt-3 text-lg font-medium text-foreground">{formatStorageLabel(effectiveStorage)}</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{targetUser.storage_quota_gb ? "Custom override is active for this user." : "Using the plan default storage allowance."}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/60 bg-card/88 shadow-[0_20px_64px_rgba(66,46,31,0.08)]">
          <CardContent className="space-y-4 p-8">
            <div className="section-stack">
              <h2 className="font-display text-3xl text-foreground">Recent owned vaults</h2>
              <p className="text-sm leading-7 text-muted-foreground">A quick look at the vaults this person owns directly.</p>
            </div>
            <div className="space-y-3">
              {(ownedVaults ?? []).length ? (
                ownedVaults!.map((vault) => (
                  <div key={vault.id} className="flex flex-col gap-3 rounded-[24px] border border-border/70 bg-background/80 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-medium text-foreground">{vault.name}</p>
                      <p className="mt-1 text-sm leading-7 text-muted-foreground">{vault.subject_name ?? "Private subject"} · Created {formatDate(vault.created_at)}</p>
                    </div>
                    <Button asChild variant="outline"><Link href={`/vaults/${vault.id}`}>Open vault</Link></Button>
                  </div>
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-border/70 bg-background/65 p-6 text-sm leading-7 text-muted-foreground">
                  This user does not own any vaults yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

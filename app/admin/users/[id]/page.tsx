import Link from "next/link";
import { notFound } from "next/navigation";

import { updateUserAccessAction } from "@/app/actions";
import { AppShell } from "@/components/layout/app-shell";
import { StorageUsageInline } from "@/components/admin/storage-usage-inline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { getEffectiveStorageQuotaGb, getMembershipLabel } from "@/lib/billing";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ROOT_ADMIN_EMAIL = "jasonvinnicombe2@gmail.com";
const planOptions = ["free", "premium", "family", "lifetime"] as const;
const statusOptions = ["active", "trialing", "inactive", "canceled", "past_due"] as const;

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

export default async function AdminUserDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ adminSuccess?: string; adminError?: string }>;
}) {
  const [{ id }, resolvedSearchParams, { profile, user, avatarPreviewUrl }] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({}),
    requireAdmin(),
  ]);

  const { data: targetUser } = await supabaseAdmin
    .from("profiles")
    .select("id,email,full_name,is_admin,membership_plan,membership_status,storage_quota_gb,created_at")
    .eq("id", id)
    .maybeSingle();

  if (!targetUser) {
    notFound();
  }

  const feedback = resolvedSearchParams.adminError
    ? { type: "error" as const, message: resolvedSearchParams.adminError }
    : resolvedSearchParams.adminSuccess
      ? { type: "success" as const, message: resolvedSearchParams.adminSuccess }
      : null;

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
  const isRootAdmin = targetUser.email.toLowerCase() === ROOT_ADMIN_EMAIL;

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
                {isRootAdmin ? <span className="inline-flex items-center gap-2 rounded-full bg-secondary/88 px-3 py-1.5 text-primary">Root admin</span> : null}
              </div>
            </div>
            <Button asChild variant="outline"><Link href="/admin/users">Back to users</Link></Button>
          </CardContent>
        </Card>

        {feedback ? (
          <Card className={feedback.type === "error" ? "border-red-200 bg-red-50/90" : "border-emerald-200 bg-emerald-50/90"}>
            <CardContent className="p-5 text-sm leading-7 text-foreground">{feedback.message}</CardContent>
          </Card>
        ) : null}

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
              <p className="text-sm leading-7 text-muted-foreground">Review how the account is configured, then update plan access, billing state, storage, or admin permissions here.</p>
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
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Current storage usage: <StorageUsageInline userId={targetUser.id} />
                </p>
              </div>
            </div>

            <form action={updateUserAccessAction} className="grid gap-4 pt-2 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] 2xl:items-end">
              <input type="hidden" name="targetUserId" value={targetUser.id} />
              <input type="hidden" name="targetEmail" value={targetUser.email} />
              <input type="hidden" name="redirectTo" value={`/admin/users/${targetUser.id}`} />

              <label className="space-y-2 text-sm font-medium text-foreground">
                <span className="uppercase tracking-[0.22em] text-muted-foreground">Membership plan</span>
                <select
                  name="membershipPlan"
                  defaultValue={targetUser.membership_plan}
                  className="h-14 w-full rounded-[22px] border border-border/70 bg-background px-5 text-base text-foreground outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-secondary/25"
                >
                  {planOptions.map((option) => (
                    <option key={option} value={option}>{getMembershipLabel(option)}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-foreground">
                <span className="uppercase tracking-[0.22em] text-muted-foreground">Membership status</span>
                <select
                  name="membershipStatus"
                  defaultValue={targetUser.membership_status}
                  className="h-14 w-full rounded-[22px] border border-border/70 bg-background px-5 text-base capitalize text-foreground outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-secondary/25"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option.replace("_", " ")}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-foreground">
                <span className="uppercase tracking-[0.22em] text-muted-foreground">Admin access</span>
                <select
                  name="adminAccess"
                  defaultValue={targetUser.is_admin ? "admin" : "standard"}
                  disabled={isRootAdmin}
                  className="h-14 w-full rounded-[22px] border border-border/70 bg-background px-5 text-base text-foreground outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-secondary/25 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <option value="standard">Standard user</option>
                  <option value="admin">Admin</option>
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-foreground">
                <span className="uppercase tracking-[0.22em] text-muted-foreground">Storage override (GB)</span>
                <input
                  type="number"
                  name="storageQuotaGb"
                  min="1"
                  step="1"
                  defaultValue={targetUser.storage_quota_gb ?? ""}
                  placeholder="Leave blank for plan default"
                  className="h-14 w-full rounded-[22px] border border-border/70 bg-background px-5 text-base text-foreground outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-secondary/25"
                />
              </label>

              <div className="flex gap-3 2xl:justify-end">
                <Button type="submit">Save access</Button>
              </div>
            </form>
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

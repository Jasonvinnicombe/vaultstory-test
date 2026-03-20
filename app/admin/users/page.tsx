import Link from "next/link";

import { deleteUserAction, inviteAdminAction, removeAdminInviteAction, updateUserAccessAction } from "@/app/actions";
import { AppShell } from "@/components/layout/app-shell";
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

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<{ adminSuccess?: string; adminError?: string; q?: string }>;
}) {
  const [{ profile, user, avatarPreviewUrl }, resolvedSearchParams] = await Promise.all([
    requireAdmin(),
    searchParams ?? Promise.resolve({}),
  ]);

  const [
    { data: profileRows, error: usersError },
    { data: pendingInvites, error: pendingInvitesError },
    { data: authUsersPage, error: authUsersError },
  ] = await Promise.all([
    supabaseAdmin
      .from("profiles")
      .select("id,email,full_name,is_admin,membership_plan,membership_status,storage_quota_gb,created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("admin_invites")
      .select("id,email,status,created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const profileMap = new Map((profileRows ?? []).map((entry) => [entry.id, entry]));
  const mergedUsers = (authUsersPage?.users ?? []).map((authUser) => {
    const profileEntry = profileMap.get(authUser.id);
    profileMap.delete(authUser.id);

    return {
      id: authUser.id,
      email: profileEntry?.email ?? authUser.email ?? "",
      full_name:
        profileEntry?.full_name ??
        authUser.user_metadata?.full_name ??
        authUser.user_metadata?.name ??
        authUser.email?.split("@")[0] ??
        "Unknown user",
      is_admin: profileEntry?.is_admin ?? false,
      membership_plan: profileEntry?.membership_plan ?? "free",
      membership_status: profileEntry?.membership_status ?? "active",
      storage_quota_gb: profileEntry?.storage_quota_gb ?? null,
      created_at: profileEntry?.created_at ?? authUser.created_at ?? null,
    };
  });

  const orphanedProfiles = [...profileMap.values()].map((entry) => ({
    ...entry,
    membership_plan: entry.membership_plan ?? "free",
    membership_status: entry.membership_status ?? "active",
  }));

  const users = [...mergedUsers, ...orphanedProfiles].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });

  const feedback = resolvedSearchParams.adminError
    ? { type: "error" as const, message: resolvedSearchParams.adminError }
    : resolvedSearchParams.adminSuccess
      ? { type: "success" as const, message: resolvedSearchParams.adminSuccess }
      : null;

  const dataWarning =
    usersError || pendingInvitesError || authUsersError
      ? "Some admin data could not be loaded completely. User counts may be incomplete until the Supabase connection is healthy again."
      : null;

  const query = resolvedSearchParams.q?.trim().toLowerCase() ?? "";
  const filteredUsers = users.filter((entry) => {
    if (!query) return true;
    const haystack = `${entry.full_name ?? ""} ${entry.email}`.toLowerCase();
    return haystack.includes(query);
  });
  const filteredPendingInvites = (pendingInvites ?? []).filter((invite) => {
    if (!query) return true;
    return invite.email.toLowerCase().includes(query);
  });

  return (
    <AppShell
      fullName={profile?.full_name ?? user.user_metadata.full_name ?? null}
      email={user.email ?? ""}
      isAdmin={profile?.is_admin ?? false}
      avatarUrl={avatarPreviewUrl}
    >
      <div className="section-stack">
        <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
          <CardContent className="p-8 sm:p-10">
            <Badge className="mb-5 bg-secondary/85">Admin</Badge>
            <h1 className="max-w-4xl text-balance font-display text-4xl text-foreground sm:text-5xl">Manage members, plans, storage, and admin access from one place.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Review every user, adjust their plan or status, increase custom storage whenever needed, and invite trusted admins who can help support the people using Vault Story.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">
                {users.length} total users
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">
                {users.filter((entry) => entry.is_admin).length} admins
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">
                {pendingInvites?.length ?? 0} pending admin invites
              </span>
            </div>
          </CardContent>
        </Card>

        {feedback ? (
          <Card className={feedback.type === "error" ? "border-red-200 bg-red-50/90" : "border-emerald-200 bg-emerald-50/90"}>
            <CardContent className="p-5 text-sm leading-7 text-foreground">{feedback.message}</CardContent>
          </Card>
        ) : null}

        {dataWarning ? (
          <Card className="border-amber-200 bg-amber-50/90">
            <CardContent className="p-5 text-sm leading-7 text-foreground">{dataWarning}</CardContent>
          </Card>
        ) : null}

        <Card className="border-white/60 bg-card/88 shadow-[0_20px_64px_rgba(66,46,31,0.08)]">
          <CardContent className="space-y-6 p-8">
            <div className="section-stack">
              <h2 className="font-display text-3xl text-foreground">Search users</h2>
              <p className="text-sm leading-7 text-muted-foreground">Find people by name or email before changing access.</p>
            </div>
            <form className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
              <label className="space-y-2 text-sm font-medium text-foreground">
                <span className="uppercase tracking-[0.22em] text-muted-foreground">Search</span>
                <input
                  type="search"
                  name="q"
                  defaultValue={resolvedSearchParams.q ?? ""}
                  placeholder="Search by name or email"
                  className="h-14 w-full rounded-[22px] border border-border/70 bg-background px-5 text-base text-foreground outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-secondary/25"
                />
              </label>
              <Button type="submit" className="h-14 px-7">Search</Button>
              {query ? <Button asChild type="button" variant="outline" className="h-14 px-7"><a href="/admin/users">Clear</a></Button> : null}
            </form>
            <p className="text-sm leading-7 text-muted-foreground">
              Showing <strong className="text-foreground">{filteredUsers.length}</strong> user{filteredUsers.length === 1 ? "" : "s"} and <strong className="text-foreground">{filteredPendingInvites.length}</strong> pending admin invite{filteredPendingInvites.length === 1 ? "" : "s"}.
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/60 bg-card/88 shadow-[0_20px_64px_rgba(66,46,31,0.08)]">
          <CardContent className="space-y-6 p-8">
            <div className="section-stack">
              <h2 className="font-display text-3xl text-foreground">Invite another admin</h2>
              <p className="text-sm leading-7 text-muted-foreground">Invite trusted teammates who should be able to manage users, plans, and access across the app.</p>
            </div>
            <form action={inviteAdminAction} className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <label className="space-y-2 text-sm font-medium text-foreground">
                <span className="uppercase tracking-[0.22em] text-muted-foreground">Admin email</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="admin@vaultstory.app"
                  className="h-14 w-full rounded-[22px] border border-border/70 bg-background px-5 text-base text-foreground outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-secondary/25"
                />
              </label>
              <Button type="submit" className="h-14 px-7">Send admin invite</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-white/60 bg-card/88 shadow-[0_20px_64px_rgba(66,46,31,0.08)]">
          <CardContent className="space-y-5 p-8">
            <div className="section-stack">
              <h2 className="font-display text-3xl text-foreground">Pending admin invites</h2>
              <p className="text-sm leading-7 text-muted-foreground">Anyone invited here will receive admin access automatically once they log in or create their account with the invited email.</p>
            </div>
            <div className="space-y-4">
              {filteredPendingInvites.length ? (
                filteredPendingInvites.map((invite) => (
                  <div key={invite.id} className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-background/80 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-medium text-foreground">{invite.email}</p>
                      <p className="mt-1 text-sm leading-7 text-muted-foreground">Pending since {formatDate(invite.created_at)}</p>
                    </div>
                    <form action={removeAdminInviteAction}>
                      <input type="hidden" name="inviteId" value={invite.id} />
                      <Button type="submit" variant="outline">Cancel invite</Button>
                    </form>
                  </div>
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-border/70 bg-background/65 p-6 text-sm leading-7 text-muted-foreground">
                  {query ? "No pending admin invites match that search." : "No pending admin invites right now."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <div className="section-stack">
            <h2 className="font-display text-3xl text-foreground">All users</h2>
            <p className="text-sm leading-7 text-muted-foreground">Change plan access, billing status, custom storage, and admin permissions for every account in the system.</p>
          </div>
          <div className="space-y-4">
            {filteredUsers.length ? filteredUsers.map((entry) => {
              const isRootAdmin = entry.email.toLowerCase() === ROOT_ADMIN_EMAIL;
              const effectiveStorage = getEffectiveStorageQuotaGb(entry.membership_plan, entry.membership_status, entry.storage_quota_gb);

              return (
                <Card key={entry.id} className="border-white/60 bg-card/88 shadow-[0_20px_64px_rgba(66,46,31,0.08)]">
                  <CardContent className="space-y-5 p-6 sm:p-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-2xl text-foreground">{entry.full_name ?? entry.email}</h3>
                          {entry.is_admin ? <Badge className="bg-primary text-primary-foreground">Admin</Badge> : null}
                          {isRootAdmin ? <Badge className="bg-secondary/88 text-primary">Root admin</Badge> : null}
                        </div>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{entry.email}</p>
                        <p className="text-sm leading-7 text-muted-foreground">Joined {formatDate(entry.created_at)}. Current plan: <strong className="text-foreground">{getMembershipLabel(entry.membership_plan)}</strong>.</p>
                        <p className="text-sm leading-7 text-muted-foreground">Current storage allowance: <strong className="text-foreground">{formatStorageLabel(effectiveStorage)}</strong>{entry.storage_quota_gb ? " (custom override)" : ""}.</p>
                      </div>
                      <div className="flex flex-wrap gap-3 lg:justify-end">
                        <Button asChild variant="outline"><Link href={`/admin/users/${entry.id}`}>View details</Link></Button>
                        <form action={deleteUserAction}>
                          <input type="hidden" name="targetUserId" value={entry.id} />
                          <input type="hidden" name="targetEmail" value={entry.email} />
                          <Button type="submit" variant="destructive" disabled={isRootAdmin}>Delete user</Button>
                        </form>
                      </div>
                    </div>

                    <form action={updateUserAccessAction} className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] 2xl:items-end">
                      <input type="hidden" name="targetUserId" value={entry.id} />
                      <input type="hidden" name="targetEmail" value={entry.email} />

                      <label className="space-y-2 text-sm font-medium text-foreground">
                        <span className="uppercase tracking-[0.22em] text-muted-foreground">Membership plan</span>
                        <select
                          name="membershipPlan"
                          defaultValue={entry.membership_plan}
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
                          defaultValue={entry.membership_status}
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
                          defaultValue={entry.is_admin ? "admin" : "standard"}
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
                          defaultValue={entry.storage_quota_gb ?? ""}
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
              );
            }) : (
              <Card className="border-white/60 bg-card/88 shadow-[0_20px_64px_rgba(66,46,31,0.08)]">
                <CardContent className="p-6 text-sm leading-7 text-muted-foreground">
                  No users match that search yet.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}


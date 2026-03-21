import Link from "next/link";
import { CalendarClock, FolderLock, LockKeyhole, Mailbox, Search, Sparkles, Vault } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { getProfile } from "@/lib/auth";
import { getEntryStatus } from "@/lib/entries";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { VaultCard } from "@/components/vaults/vault-card";

export default async function DashboardPage({ searchParams }: { searchParams?: Promise<{ onboarding?: string; q?: string }> }) {
  const [resolvedSearchParams, { profile, user, avatarPreviewUrl }] = await Promise.all([
    searchParams ?? Promise.resolve({}),
    getProfile(),
  ]);
  const supabase = await createClient();

  const [{ data: vaults }, { data: entries }] = await Promise.all([
    supabase.from("vaults").select("*").order("created_at", { ascending: false }),
    supabase.from("vault_entries").select("*").order("created_at", { ascending: false }),
  ]);

  const allEntries = entries ?? [];
  const lockedEntries = allEntries.filter((entry) => getEntryStatus(entry) !== "unlocked");
  const unlockedEntries = allEntries.filter((entry) => getEntryStatus(entry) === "unlocked");
  const upcomingEntries = allEntries.filter((entry) => getEntryStatus(entry) === "soon");

  const stats = [
    { label: "Vault count", value: String(vaults?.length ?? 0), icon: FolderLock },
    { label: "Entry count", value: String(allEntries.length), icon: Mailbox },
    { label: "Locked entries", value: String(lockedEntries.length), icon: LockKeyhole },
    { label: "Unlocked entries", value: String(unlockedEntries.length), icon: Sparkles },
    { label: "Upcoming unlocks", value: String(upcomingEntries.length), icon: CalendarClock },
  ];

  const vaultCards = await Promise.all(
    (vaults ?? []).map(async (vault) => {
      const relatedEntries = allEntries.filter((entry) => entry.vault_id === vault.id);
      const nextUnlock =
        relatedEntries
          .filter((entry) => entry.unlock_at && getEntryStatus(entry) !== "unlocked")
          .sort(
            (a, b) =>
              new Date(a.unlock_at ?? "").getTime() - new Date(b.unlock_at ?? "").getTime(),
          )[0] ?? null;

      const coverImagePreviewUrl = vault.cover_image_url
        ? (await supabaseAdmin.storage.from("vault-covers").createSignedUrl(vault.cover_image_url, 60 * 10)).data
            ?.signedUrl ?? null
        : null;

      return {
        id: vault.id,
        name: vault.name,
        vaultType: vault.vault_type,
        subjectName: vault.subject_name,
        entryCount: relatedEntries.length,
        nextUnlockDate: nextUnlock?.unlock_at ?? null,
        coverImagePreviewUrl,
      };
    }),
  );

  const firstVault = vaults?.[0] ?? null;
  const query = resolvedSearchParams.q?.trim().toLowerCase() ?? "";
  const filteredVaultCards = vaultCards.filter((vault) => {
    if (!query) return true;
    const haystack = `${vault.name} ${vault.vaultType} ${vault.subjectName ?? ""}`.toLowerCase();
    return haystack.includes(query);
  });

  return (
    <AppShell fullName={profile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="space-y-7 sm:space-y-8">
        <Card className="overflow-hidden border-white/60 bg-card/84 shadow-[0_24px_64px_rgba(66,46,31,0.1)]">
          <CardContent className="relative flex flex-col gap-6 p-7 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
            <div className="hero-orb absolute right-[-5rem] top-[-3rem] hidden h-52 w-52 rounded-full opacity-60 lg:block" />
            <div className="relative max-w-3xl section-stack">
              <Badge className="w-fit bg-secondary/88">Dashboard</Badge>
              <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">Your private family archive at a glance.</h1>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">Track how many vaults you have, how many entries are still locked, and which future moments are quietly approaching next.</p>
            </div>
            <Button asChild><Link href="/vaults/new">Create vault</Link></Button>
          </CardContent>
        </Card>

        {(!vaults?.length || !allEntries.length || resolvedSearchParams.onboarding === "done") ? (
          <Card className="overflow-hidden bg-primary text-primary-foreground shadow-[0_22px_56px_rgba(48,32,23,0.18)]">
            <CardContent className="grid gap-5 p-7 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
              <div className="section-stack">
                <p className="text-sm uppercase tracking-[0.22em] text-primary-foreground/68">Onboarding</p>
                <h2 className="text-balance font-display text-3xl sm:text-4xl">Build your first family time capsule in two thoughtful steps.</h2>
                <p className="text-sm leading-7 text-primary-foreground/82">Create your first vault, then add the first memory entry so the future has something meaningful waiting for it.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary"><Link href="/vaults/new?onboarding=1">1. Create first vault</Link></Button>
                <Button asChild variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10"><Link href={firstVault ? `/vaults/${firstVault.id}/entries/new?onboarding=1` : "/vaults/new?onboarding=1"}>2. Create first memory</Link></Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return <Card key={stat.label} className="glass-panel"><CardContent className="p-6"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/90 text-primary"><Icon className="h-5 w-5" /></div><p className="text-sm text-muted-foreground">{stat.label}</p><p className="mt-2 font-display text-3xl">{stat.value}</p></CardContent></Card>;
          })}
        </section>

        <section id="vaults" className="space-y-4">
          <Card className="overflow-hidden border-white/60 bg-card/86 shadow-[0_18px_48px_rgba(66,46,31,0.08)]">
            <CardContent className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <form className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
                <label className="space-y-2 text-sm font-medium text-foreground">
                  <span className="uppercase tracking-[0.22em] text-muted-foreground">Search vaults</span>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      name="q"
                      defaultValue={resolvedSearchParams.q ?? ""}
                      placeholder="Search by vault name, type, or person"
                      className="pl-11"
                    />
                  </div>
                </label>
                <Button type="submit" className="h-12 px-6">Search</Button>
                {query ? <Button asChild type="button" variant="outline" className="h-12 px-6"><a href="/dashboard#vaults">Clear</a></Button> : null}
              </form>
              <div className="flex justify-start lg:justify-end">
                <Button asChild variant="outline"><Link href="/vaults/new">New vault</Link></Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="section-stack">
              <h2 className="font-display text-3xl sm:text-4xl">Your vaults</h2>
              <p className="text-sm leading-7 text-muted-foreground">Each card shows the person it holds, how full it is, and the next moment waiting to arrive.</p>
            </div>
            {query ? <p className="text-sm leading-7 text-muted-foreground">Showing <strong className="text-foreground">{filteredVaultCards.length}</strong> vault{filteredVaultCards.length === 1 ? "" : "s"} for "{resolvedSearchParams.q}".</p> : null}
          </div>

          {vaultCards.length ? (
            filteredVaultCards.length ? (
              <div className="grid gap-4 xl:grid-cols-2">{filteredVaultCards.map((vault) => <VaultCard key={vault.id} {...vault} />)}</div>
            ) : (
              <Card className="border-white/60 bg-card/88 shadow-[0_20px_64px_rgba(66,46,31,0.08)]"><CardContent className="p-6 text-sm leading-7 text-muted-foreground">No vaults match that search yet.</CardContent></Card>
            )
          ) : <EmptyState icon={Vault} title="No vaults yet" body="Start with one vault for yourself or someone you love, then fill it with memories worth delivering later." action={<Button asChild><Link href="/vaults/new">Create your first vault</Link></Button>} />}
        </section>

        <section id="upcoming" className="space-y-4">
          <div className="section-stack"><h2 className="font-display text-3xl sm:text-4xl">Upcoming unlocks</h2><p className="text-sm leading-7 text-muted-foreground">Entries unlocking within the next 30 days.</p></div>
          <div className="grid gap-4">{upcomingEntries.length ? upcomingEntries.slice(0, 5).map((entry) => <Card key={entry.id} className="glass-panel"><CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-foreground">{entry.title}</p><p className="mt-1 text-sm leading-7 text-muted-foreground">Unlocks on {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(entry.unlock_at ?? ""))}</p></div><Button asChild variant="ghost"><Link href={`/vaults/${entry.vault_id}`}>Open vault</Link></Button></CardContent></Card>) : <EmptyState icon={CalendarClock} title="No upcoming unlocks" body="No entries are approaching their reveal yet. Once you lock memories to dates or milestones, this is where anticipation starts to build." />}</div>
        </section>

        <section className="space-y-4">
          <div className="section-stack"><h2 className="font-display text-3xl sm:text-4xl">Unlocked memories</h2><p className="text-sm leading-7 text-muted-foreground">Moments that have made it through time and are ready to revisit.</p></div>
          {unlockedEntries.length ? <div className="grid gap-4">{unlockedEntries.slice(0, 3).map((entry) => <Card key={entry.id} className="glass-panel"><CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-foreground">{entry.title}</p><p className="mt-1 text-sm leading-7 text-muted-foreground">Now unlocked inside its vault.</p></div><Button asChild variant="ghost"><Link href={`/entries/${entry.id}`}>Reveal</Link></Button></CardContent></Card>)}</div> : <EmptyState icon={Sparkles} title="No unlocked memories" body="The best part of the product is still ahead: the first time a message from your past version returns with perfect timing." />}
        </section>
      </div>
    </AppShell>
  );
}

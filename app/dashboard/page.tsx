import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  FolderLock,
  LockKeyhole,
  Mailbox,
  Mic,
  Plus,
  Search,
  Sparkles,
  Vault,
} from "lucide-react";

import { CountdownTimer } from "@/components/entries/countdown-timer";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { getProfile } from "@/lib/auth";
import { hasPaidFeatureAccess } from "@/lib/billing";
import { formatDateTime } from "@/lib/date";
import { getEntryStatus } from "@/lib/entries";
import { createClient } from "@/lib/supabase/server";
import { getStorageObjectUrl } from "@/lib/storage";
import { VaultCard } from "@/components/vaults/vault-card";
import { StorageUsageCard } from "@/components/dashboard/storage-usage";
import type { Database } from "@/types/database";

type DashboardSearchParams = { onboarding?: string; q?: string };

type VaultRow = Database["public"]["Tables"]["vaults"]["Row"];
type EntryRow = Database["public"]["Tables"]["vault_entries"]["Row"];

function formatDate(value: string | null) {
  if (!value) return "Waiting for a milestone";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getHeroCopy(firstName: string | null, totalEntries: number, upcomingCount: number) {
  if (!totalEntries) {
    return {
      eyebrow: `Welcome${firstName ? `, ${firstName}` : ""}`,
      title: "Start the story that your future will thank you for.",
      body: "Create your first vault, add a memory, and let the dashboard become the place where future moments quietly gather meaning.",
    };
  }

  if (upcomingCount > 0) {
    return {
      eyebrow: `Welcome back${firstName ? `, ${firstName}` : ""}`,
      title: "Something meaningful is already on its way.",
      body: "Your archive is alive now. Keep adding memories so the next unlock feels even more personal when it arrives.",
    };
  }

  return {
    eyebrow: `Welcome back${firstName ? `, ${firstName}` : ""}`,
    title: "Your story is growing with every memory you keep.",
    body: "This is where your private timeline starts to feel real: the memories you have saved, the moments still sealed, and the ones inching closer.",
  };
}

export default async function DashboardPage({ searchParams }: { searchParams?: Promise<DashboardSearchParams> }) {
  const [rawSearchParams, { profile, user, avatarPreviewUrl }] = await Promise.all([
    searchParams ?? Promise.resolve({}),
    getProfile(),
  ]);
  const resolvedSearchParams = rawSearchParams as DashboardSearchParams;
  const supabase = await createClient();

  const [{ data: vaults }, { data: entries }] = await Promise.all([
    supabase.from("vaults").select("*").order("created_at", { ascending: false }),
    supabase.from("vault_entries").select("*").order("created_at", { ascending: false }),
  ]);

  const typedVaults = (vaults ?? []) as VaultRow[];
  const typedEntries = (entries ?? []) as EntryRow[];
  const allEntries = typedEntries.filter((entry) => entry.is_deleted !== true);
  const hasPremiumUnlockEntitlement = hasPaidFeatureAccess(profile?.membership_plan, profile?.membership_status);

  const unlockedEntries = allEntries.filter((entry) => getEntryStatus(entry, { hasPremiumUnlockEntitlement }) === "unlocked");
  const upcomingEntries = allEntries.filter((entry) => getEntryStatus(entry, { hasPremiumUnlockEntitlement }) === "soon");
  const nextUnlockEntry =
    [...allEntries]
      .filter((entry) => getEntryStatus(entry, { hasPremiumUnlockEntitlement }) !== "unlocked" && entry.unlock_at)
      .sort((a, b) => new Date(a.unlock_at ?? "").getTime() - new Date(b.unlock_at ?? "").getTime())[0] ?? null;

  const stats = [
    { label: "Memories saved", value: String(allEntries.length), icon: Mailbox },
    { label: "Vaults", value: String(typedVaults.length), icon: FolderLock },
    { label: "Unlocking soon", value: String(upcomingEntries.length), icon: CalendarClock },
    { label: "Already revealed", value: String(unlockedEntries.length), icon: Sparkles },
  ];

  const vaultCards = await Promise.all(
    typedVaults.map(async (vault) => {
      const relatedEntries = allEntries.filter((entry) => entry.vault_id === vault.id);
      const nextUnlock =
        relatedEntries
          .filter((entry) => entry.unlock_at && getEntryStatus(entry, { hasPremiumUnlockEntitlement }) !== "unlocked")
          .sort(
            (a, b) =>
              new Date(a.unlock_at ?? "").getTime() - new Date(b.unlock_at ?? "").getTime(),
          )[0] ?? null;

      const coverImagePreviewUrl = vault.cover_image_url
        ? await getStorageObjectUrl(vault.cover_image_url, { bucket: "vault-covers", expiresIn: 60 * 10 })
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

  const vaultById = new Map(typedVaults.map((vault) => [vault.id, vault]));
  const firstVault = typedVaults[0] ?? null;
  const query = resolvedSearchParams.q?.trim().toLowerCase() ?? "";
  const firstName = profile?.full_name?.split(" ")[0] ?? user.user_metadata.full_name?.split(" ")[0] ?? null;
  const heroCopy = getHeroCopy(firstName, allEntries.length, upcomingEntries.length);

  const filteredVaultCards = vaultCards.filter((vault) => {
    if (!query) return true;
    const haystack = `${vault.name} ${vault.vaultType} ${vault.subjectName ?? ""}`.toLowerCase();
    return haystack.includes(query);
  });

  const timelineEntries = [...allEntries]
    .sort((a, b) => {
      const aStatus = getEntryStatus(a, { hasPremiumUnlockEntitlement });
      const bStatus = getEntryStatus(b, { hasPremiumUnlockEntitlement });
      const priority = { soon: 0, unlocked: 1, locked: 2, draft: 3 } as const;
      const priorityDelta = priority[aStatus] - priority[bStatus];
      if (priorityDelta !== 0) return priorityDelta;

      const aTime = a.unlock_at ? new Date(a.unlock_at).getTime() : new Date(a.created_at).getTime();
      const bTime = b.unlock_at ? new Date(b.unlock_at).getTime() : new Date(b.created_at).getTime();
      return aTime - bTime;
    })
    .slice(0, 6)
    .map((entry) => {
      const status = getEntryStatus(entry, { hasPremiumUnlockEntitlement });
      const vault = vaultById.get(entry.vault_id);

      return {
        id: entry.id,
        title: entry.title,
        vaultName: vault?.name ?? "Vault",
        subjectName: vault?.subject_name ?? null,
        href: `/entries/${entry.id}`,
        status,
        statusLabel:
          status === "soon"
            ? "Unlocking soon"
            : status === "unlocked"
              ? "Ready to revisit"
              : status === "draft"
                ? "Still being shaped"
                : "Locked for later",
        detail:
          status === "draft"
            ? `Recorded ${formatDateTime(entry.created_at)}`
            : entry.unlock_at
              ? `Unlocks ${formatDateTime(entry.unlock_at)}`
              : entry.milestone_label ?? "Waiting for milestone completion",
      };
    });

  const quickActions = [
    {
      title: "Write a memory",
      description: "Create a new letter, photo story, or future note.",
      href: firstVault ? `/vaults/${firstVault.id}/entries/new` : "/vaults/new",
      icon: Plus,
    },
    {
      title: "Record a voice note",
      description: "Capture the feeling of the moment while it is fresh.",
      href: firstVault ? `/vaults/${firstVault.id}/entries/new` : "/vaults/new",
      icon: Mic,
    },
    {
      title: "Create another vault",
      description: "Start a private space for someone new.",
      href: "/vaults/new",
      icon: Vault,
    },
  ];

  return (
    <AppShell fullName={profile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="space-y-7 sm:space-y-8">
        <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.9fr)]">
          <div className="space-y-3">
            <Card className="overflow-hidden border-white/60 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.72),rgba(255,255,255,0.16)_24%,transparent_44%),radial-gradient(circle_at_88%_14%,rgba(230,184,106,0.18),transparent_22%),linear-gradient(135deg,rgba(255,251,246,0.96),rgba(246,238,228,0.9)_52%,rgba(238,231,221,0.86))] shadow-[0_28px_82px_rgba(66,46,31,0.12)]">
              <CardContent className="relative flex flex-col gap-6 p-7 sm:p-8 lg:p-10">
                <div className="hero-orb absolute right-[-4rem] top-[-3rem] hidden h-48 w-48 rounded-full opacity-60 lg:block" />
                <div className="relative section-stack max-w-3xl">
                  <Badge className="w-fit bg-secondary/88">Dashboard</Badge>
                  <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">{heroCopy.eyebrow}</p>
                  <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">{heroCopy.title}</h1>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{heroCopy.body}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3 rounded-[34px] border border-white/60 bg-white/30 p-5 shadow-[0_18px_48px_rgba(66,46,31,0.06)] backdrop-blur-sm sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex h-full min-h-[196px] flex-col rounded-[28px] border border-white/65 bg-white/58 p-5 shadow-[0_18px_38px_rgba(66,46,31,0.06)] backdrop-blur-sm">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(30,42,68,0.16)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="mt-4 min-h-[56px]">
                        <p className="text-[11px] uppercase leading-[1.35] tracking-[0.12em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]">{stat.label}</p>
                      </div>
                      <p className="mt-auto font-display text-3xl leading-none text-foreground">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="relative flex flex-wrap gap-2">
                <Button asChild>
                  <Link href={firstVault ? `/vaults/${firstVault.id}/entries/new` : "/vaults/new"}>
                    Create memory
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/vaults/new">Create vault</Link>
                </Button>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-white/12 bg-[radial-gradient(circle_at_18%_18%,rgba(113,157,255,0.22),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(230,184,106,0.16),transparent_24%),linear-gradient(180deg,rgba(16,28,52,0.98),rgba(28,44,82,0.96)_58%,rgba(42,63,110,0.92))] text-white shadow-[0_30px_86px_rgba(30,42,68,0.26)]">
            <CardContent className="space-y-6 p-7 sm:p-8">
              <div className="section-stack">
                <p className="text-sm uppercase tracking-[0.22em] text-white/68">Featured unlock</p>
                <h2 className="font-display text-3xl text-white">{nextUnlockEntry ? "Your next memory is already waiting." : "The next unlock starts with the next memory you save."}</h2>
                <p className="text-sm leading-7 text-white/76">{nextUnlockEntry ? "This is the closest future moment in your archive right now. Keep the anticipation alive by adding another memory today." : "Once you seal something to a date or milestone, this area becomes the emotional heartbeat of the dashboard."}</p>
              </div>

              {nextUnlockEntry ? (
                <>
                  <div className="rounded-[30px] border border-white/14 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3">
                        <Badge className="bg-secondary text-slate-900">Next unlock</Badge>
                        <div>
                          <h3 className="font-display text-3xl text-white">{nextUnlockEntry.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-white/74">Inside {vaultById.get(nextUnlockEntry.vault_id)?.name ?? "your vault"}{vaultById.get(nextUnlockEntry.vault_id)?.subject_name ? ` for ${vaultById.get(nextUnlockEntry.vault_id)?.subject_name}` : ""}.</p>
                        </div>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/16 bg-white/10 text-secondary">
                        <LockKeyhole className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="mt-5 rounded-[28px] border border-white/12 bg-black/20 p-4 text-sm text-white/78 backdrop-blur-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/54">Unlock date</p>
                      <p className="mt-2 text-base text-white">{formatDateTime(nextUnlockEntry.unlock_at)}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="inline-flex items-center gap-2 text-sm text-white/84"><CalendarClock className="h-4 w-4" />Countdown to reveal</p>
                    <CountdownTimer unlockAt={nextUnlockEntry.unlock_at} variant="inline" />
                    <Button asChild variant="secondary" className="w-full sm:w-auto">
                      <Link href={`/entries/${nextUnlockEntry.id}`}>Open entry</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="rounded-[30px] border border-dashed border-white/18 bg-white/8 p-6">
                  <p className="text-sm leading-7 text-white/78">No dated unlocks are scheduled yet. Create a vault or add an entry with an exact day so the dashboard can start counting down to something meaningful.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild variant="secondary">
                      <Link href={firstVault ? `/vaults/${firstVault.id}/entries/new` : "/vaults/new"}>Create memory</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
                      <Link href="/vaults/new">Create vault</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {(!typedVaults.length || !allEntries.length || resolvedSearchParams.onboarding === "done") ? (
          <Card className="overflow-hidden bg-primary text-primary-foreground shadow-[0_22px_56px_rgba(48,32,23,0.18)]">
            <CardContent className="grid gap-5 p-7 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
              <div className="section-stack">
                <p className="text-sm uppercase tracking-[0.22em] text-primary-foreground/68">Onboarding</p>
                <h2 className="text-balance font-display text-3xl sm:text-4xl">Build your first family time capsule in two thoughtful steps.</h2>
                <p className="text-sm leading-7 text-primary-foreground/82">Create your first vault, then add the first memory entry so the future has something meaningful waiting for it.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary"><Link href="/vaults/new?onboarding=1">1. Create first vault</Link></Button>
                <Button asChild variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10"><Link href={firstVault ? `/vaults/${firstVault.id}/entries/new?onboarding=1` : "/vaults/new?onboarding=1"}>2. Create first memory</Link></Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href} className="group">
                <Card className="glass-panel h-full border-white/60 transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_22px_54px_rgba(66,46,31,0.1)]">
                  <div className="flex h-full flex-col px-6 py-8 sm:px-7 sm:py-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/90 text-primary shadow-[0_12px_26px_rgba(30,42,68,0.08)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="mt-6 space-y-2">
                      <h2 className="font-display text-2xl text-foreground">{action.title}</h2>
                      <p className="text-sm leading-7 text-muted-foreground">{action.description}</p>
                    </div>
                    <p className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-foreground">Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="space-y-4">
            <div className="section-stack">
              <Badge className="w-fit bg-secondary/88">Story timeline</Badge>
              <h2 className="font-display text-3xl sm:text-4xl">What is moving through your archive right now</h2>
              <p className="text-sm leading-7 text-muted-foreground">A mixed feed of memories that are approaching, newly unlocked, or still waiting for their moment.</p>
            </div>

            {timelineEntries.length ? (
              <div className="grid gap-4">
                {timelineEntries.map((entry) => {
                  const statusClasses =
                    entry.status === "soon"
                      ? "border-secondary/60 bg-secondary/14 text-primary"
                      : entry.status === "unlocked"
                        ? "border-emerald-300/60 bg-emerald-50/90 text-emerald-900"
                        : entry.status === "draft"
                          ? "border-slate-300/70 bg-slate-100 text-slate-700"
                          : "border-primary/15 bg-primary/6 text-primary";
                  const accentClasses =
                    entry.status === "soon"
                      ? "from-secondary/70 via-secondary/20 to-transparent"
                      : entry.status === "unlocked"
                        ? "from-emerald-300/65 via-emerald-100/25 to-transparent"
                        : entry.status === "draft"
                          ? "from-slate-300/70 via-slate-100/25 to-transparent"
                          : "from-primary/25 via-primary/10 to-transparent";

                  return (
                    <Link key={entry.id} href={entry.href} className="group">
                      <Card className="glass-panel relative overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,241,0.96))] transition duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_20px_44px_rgba(66,46,31,0.08)]">
                        <div className={`pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${accentClasses}`} />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_72%)] opacity-55" />
                        <div className="relative flex min-h-[152px] flex-col gap-4 px-6 py-5 sm:px-7 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${statusClasses}`}>{entry.statusLabel}</span>
                              <span className="inline-flex rounded-full border border-black/5 bg-white/75 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">{entry.vaultName}</span>
                              {entry.subjectName ? (
                                <span className="inline-flex rounded-full border border-black/5 bg-black/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                                  For {entry.subjectName}
                                </span>
                              ) : null}
                            </div>
                            <div className="space-y-3">
                              <h3 className="max-w-3xl font-display text-[1.5rem] leading-tight text-foreground sm:text-[1.7rem]">{entry.title}</h3>
                              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{entry.detail}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 lg:items-end">
                            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/72 px-3 py-1.5 text-xs text-muted-foreground shadow-[0_8px_20px_rgba(66,46,31,0.04)]">
                              <CalendarClock className="h-4 w-4 text-primary/75" />
                              <span>{entry.status === "soon" ? "Approaching unlock" : entry.status === "unlocked" ? "Ready now" : entry.status === "draft" ? "In progress" : "Locked safely"}</span>
                            </div>
                            <span className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/10 bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_10px_22px_rgba(30,42,68,0.12)] transition group-hover:translate-x-1 group-hover:bg-primary/92">
                              View memory
                              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={Sparkles} title="Your timeline is ready for its first memory" body="Once you create a vault and save an entry, this area becomes the living stream of future unlocks and already-open moments." action={<Button asChild><Link href="/vaults/new">Create your first vault</Link></Button>} />
            )}
          </div>

          <div className="space-y-4">
            <StorageUsageCard />
            <Card className="overflow-hidden border-white/60 bg-card/86 shadow-[0_18px_48px_rgba(66,46,31,0.08)]">
              <CardContent className="space-y-4 p-6 sm:p-7">
                <div className="section-stack">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Gentle prompt</p>
                  <h3 className="font-display text-2xl text-foreground">Capture something today before it becomes hard to remember clearly.</h3>
                  <p className="text-sm leading-7 text-muted-foreground">The strongest dashboards do not just summarize the archive. They gently pull you back into preserving one more meaningful detail.</p>
                </div>
                <Button asChild variant="outline" className="w-full justify-between sm:w-auto">
                  <Link href={firstVault ? `/vaults/${firstVault.id}/entries/new` : "/vaults/new"}>
                    Add a memory now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="vaults" className="space-y-4">
          <Card className="overflow-hidden border-white/60 bg-card/86 shadow-[0_18px_48px_rgba(66,46,31,0.08)]">
            <CardContent className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <form className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
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
              <p className="text-sm leading-7 text-muted-foreground">Each vault still gives you the practical overview, but the dashboard now keeps the emotional momentum up top.</p>
            </div>
            {query ? <p className="text-sm leading-7 text-muted-foreground">Showing <strong className="text-foreground">{filteredVaultCards.length}</strong> vault{filteredVaultCards.length === 1 ? "" : "s"} for "{resolvedSearchParams.q}".</p> : null}
          </div>

          {typedVaults.length ? (
            filteredVaultCards.length ? (
              <div className="grid gap-4 xl:grid-cols-2">{filteredVaultCards.map((vault) => <VaultCard key={vault.id} {...vault} />)}</div>
            ) : (
              <Card className="border-white/60 bg-card/88 shadow-[0_20px_64px_rgba(66,46,31,0.08)]"><CardContent className="p-6 text-sm leading-7 text-muted-foreground">No vaults match that search yet.</CardContent></Card>
            )
          ) : <EmptyState icon={Vault} title="No vaults yet" body="Start with one vault for yourself or someone you love, then fill it with memories worth delivering later." action={<Button asChild><Link href="/vaults/new">Create your first vault</Link></Button>} />}
        </section>

        <section id="upcoming" className="space-y-4">
          <div className="section-stack">
            <h2 className="font-display text-3xl sm:text-4xl">Unlocking soon</h2>
            <p className="text-sm leading-7 text-muted-foreground">A focused view of the memories that are within the upcoming unlock window.</p>
          </div>
          <div className="grid gap-4">
            {upcomingEntries.length ? upcomingEntries.slice(0, 4).map((entry) => (
              <Card key={entry.id} className="glass-panel group relative overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,241,0.96))] shadow-[0_14px_32px_rgba(66,46,31,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(66,46,31,0.08)]">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-secondary via-secondary/20 to-transparent" />
                <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-20 w-20 rounded-full bg-secondary/8 blur-2xl" />
                <div className="relative flex min-h-[152px] flex-col gap-4 px-6 py-5 sm:px-7 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full border border-secondary/60 bg-secondary/14 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-primary">Unlocking soon</span>
                      <span className="inline-flex rounded-full border border-black/5 bg-white/75 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{vaultById.get(entry.vault_id)?.name ?? "Vault"}</span>
                      {vaultById.get(entry.vault_id)?.subject_name ? (
                        <span className="inline-flex rounded-full border border-black/5 bg-black/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          For {vaultById.get(entry.vault_id)?.subject_name}
                        </span>
                      ) : null}
                    </div>
                    <div className="space-y-3">
                      <p className="max-w-3xl font-display text-[1.5rem] leading-tight text-foreground sm:text-[1.7rem]">{entry.title}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/70 px-3 py-1.5 shadow-[0_8px_20px_rgba(66,46,31,0.04)]">
                          <CalendarClock className="h-4 w-4 text-primary/75" />
                          Unlocks {formatDate(entry.unlock_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 lg:items-end">
                    <Button asChild variant="outline" className="rounded-full border-primary/12 bg-primary/6 px-4 text-foreground shadow-[0_8px_20px_rgba(66,46,31,0.04)] hover:bg-primary hover:text-primary-foreground">
                      <Link href={`/entries/${entry.id}`}>
                        View memory
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {entry.unlock_at ? formatDateTime(entry.unlock_at) : "Waiting for a milestone"}
                    </p>
                  </div>
                </div>
              </Card>
            )) : <EmptyState icon={CalendarClock} title="No upcoming unlocks" body="No entries are approaching their reveal yet. Once you lock memories to dates or milestones, this is where anticipation starts to build." />}
          </div>
        </section>
      </div>
    </AppShell>
  );
}




































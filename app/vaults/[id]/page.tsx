import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, HeartHandshake, Sparkles } from "lucide-react";

import { EntryCard } from "@/components/entries/entry-card";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getProfile } from "@/lib/auth";
import { formatDateTime } from "@/lib/date";
import { getEntryStatus } from "@/lib/entries";
import { createClient } from "@/lib/supabase/server";

const filters = new Set(["all", "locked", "unlocked", "upcoming"]);

export default async function VaultPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<{ filter?: string }> }) {
  const [{ id }, resolvedSearchParams, { profile, user, avatarPreviewUrl }] = await Promise.all([params, searchParams ?? Promise.resolve({}), getProfile()]);
  const supabase = await createClient();
  const [{ data: vault }, { data: entries }] = await Promise.all([
    supabase.from("vaults").select("*").eq("id", id).maybeSingle(),
    supabase.from("vault_entries").select("*").eq("vault_id", id).order("created_at", { ascending: false }),
  ]);

  if (!vault) notFound();

  const filter = filters.has(resolvedSearchParams.filter ?? "all") ? (resolvedSearchParams.filter ?? "all") : "all";
  const allEntries = entries ?? [];
  const filteredEntries = allEntries.filter((entry) => {
    const status = getEntryStatus(entry);
    if (filter === "all") return true;
    if (filter === "locked") return status !== "unlocked";
    if (filter === "upcoming") return status === "soon";
    return status === filter;
  });

  const emptyStateByFilter = {
    all: {
      title: "No entries yet",
      body: "Start the timeline with a letter, photo, voice note, or video that deserves to arrive later.",
    },
    locked: {
      title: "No locked entries",
      body: "Everything in this vault is already open, or nothing has been scheduled to arrive later yet.",
    },
    unlocked: {
      title: "No unlocked entries",
      body: "Nothing has reached its reveal moment yet. Future entries will appear here once their time arrives.",
    },
    upcoming: {
      title: "No upcoming entries",
      body: "Nothing is nearing its unlock window right now. Add a closer date or milestone to build anticipation.",
    },
  } as const;

  const emptyState = emptyStateByFilter[filter];

  return (
    <AppShell fullName={profile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="space-y-6 sm:space-y-7">
        <Card className="overflow-hidden border-white/60 bg-card/84 shadow-[0_24px_64px_rgba(66,46,31,0.11)]">
          <CardContent className="relative flex flex-col gap-6 p-7 sm:p-8 lg:flex-row lg:items-end lg:justify-between lg:p-10">
            <div className="hero-orb absolute right-[-5rem] top-[-2rem] hidden h-56 w-56 rounded-full opacity-60 lg:block" />
            <div className="relative max-w-3xl section-stack">
              <Badge className="w-fit bg-secondary/88">Vault timeline</Badge>
              <h1 className="text-balance font-display text-4xl text-foreground sm:text-5xl">{vault.name}</h1>
              <p className="text-sm leading-7 text-muted-foreground sm:text-base">{vault.description || `A ${vault.vault_type} vault for ${vault.subject_name ?? "future moments"}.`}</p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">Subject: {vault.subject_name ?? "Private"}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">Type: {vault.vault_type}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary/55 px-3 py-1.5">Created: {formatDateTime(vault.created_at)}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild><Link href={`/vaults/${vault.id}/entries/new`}>New entry</Link></Button>
              <Button asChild variant="outline"><Link href={`/vaults/${vault.id}/settings`}>Settings</Link></Button>
            </div>
          </CardContent>
        </Card>

        <section className="flex flex-wrap gap-2 sm:gap-3">
          {["all", "locked", "unlocked", "upcoming"].map((item) => (
            <Button key={item} asChild variant={filter === item ? "default" : "outline"} size="sm">
              <Link href={`/vaults/${vault.id}?filter=${item}`}>{item[0].toUpperCase() + item.slice(1)}</Link>
            </Button>
          ))}
        </section>

        <section className="space-y-5">
          <div className="section-stack">
            <h2 className="font-display text-3xl sm:text-4xl">Timeline of life events</h2>
            <p className="text-sm leading-7 text-muted-foreground">A visual sequence of memories, promises, and moments waiting for their time.</p>
          </div>
          <div className="space-y-5">
            {filteredEntries.length ? filteredEntries.map((entry) => <EntryCard key={entry.id} entry={entry} timeline />) : <EmptyState icon={CalendarClock} title={emptyState.title} body={emptyState.body} action={filter === "all" ? <Button asChild><Link href={`/vaults/${vault.id}/entries/new`}>Create first entry</Link></Button> : undefined} />}
          </div>
        </section>

        {!allEntries.some((entry) => getEntryStatus(entry) === "unlocked") ? <EmptyState icon={Sparkles} title="No unlocked memories yet" body="This vault is still holding its breath. The first reveal will give the timeline emotional weight and context." /> : null}
        {!allEntries.some((entry) => getEntryStatus(entry) === "soon") ? <EmptyState icon={HeartHandshake} title="No upcoming unlocks yet" body="There is nothing close to arrival right now. Add a memory with a near-term date or milestone to create anticipation." /> : null}
      </div>
    </AppShell>
  );
}


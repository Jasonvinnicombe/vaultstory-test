import Link from "next/link";
import { ArrowRight, BookOpenText, CalendarClock, CheckCircle2, ChevronRight, FolderPlus, Sparkles, Vault } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const workflowSteps = [
  {
    step: "01",
    title: "Create the vault first",
    body: "Start by choosing who the vault is for, what to call it, and whether it needs a cover image or short description.",
    snippetTitle: "What to fill in",
    snippet: [
      "Vault type: self, child, partner, or family",
      "Vault name: something warm and recognizable",
      "Subject name: the person this archive belongs to",
      "Optional: birthdate, description, and cover image",
    ],
    clickPath: ["Sidebar", "New vault"],
    clickTitle: "Where to click first",
    clickLabel: "Open the left sidebar and choose New vault.",
    clickPrimary: "New vault",
    clickSecondary: ["Vault type", "Vault name", "Subject name"],
    icon: FolderPlus,
  },
  {
    step: "02",
    title: "Add entries inside the vault",
    body: "Each entry is one memory. It can be a letter, photo, voice note, video, or a bundle that captures a single moment well.",
    snippetTitle: "Good first entries",
    snippet: [
      "A birthday letter for a future age",
      "A photo with a note explaining why it mattered",
      "A voice note telling a family story",
      "A video message for a hard day or big milestone",
    ],
    clickPath: ["Dashboard", "Vaults", "Open vault", "Create entry"],
    clickTitle: "Where to click next",
    clickLabel: "Open an existing vault card, then choose the entry creation action for that vault.",
    clickPrimary: "Create entry",
    clickSecondary: ["Title", "Message", "Upload media"],
    icon: Vault,
  },
  {
    step: "03",
    title: "Choose when it should unlock",
    body: "Every entry needs timing. You can unlock by exact date, relative duration, age milestone, or a manual milestone depending on the plan.",
    snippetTitle: "Unlock examples",
    snippet: [
      "Exact date: June 12, 2036",
      "Relative duration: 5 years from today",
      "Age milestone: when they turn 18",
      "Manual milestone: when we move into our forever home",
    ],
    clickPath: ["Entry form", "Unlock step", "Unlock type"],
    clickTitle: "Where to set the timing",
    clickLabel: "On the entry workflow, move to the Unlock step and choose the reveal timing that makes the memory land well.",
    clickPrimary: "Unlock type",
    clickSecondary: ["Exact date", "Relative duration", "Age milestone"],
    icon: CalendarClock,
  },
  {
    step: "04",
    title: "Review, revisit, and let time do the work",
    body: "After saving, keep adding entries over time, browse your vaults from the dashboard, and watch upcoming unlocks start to gather meaning.",
    snippetTitle: "General rhythm",
    snippet: [
      "Create vault",
      "Add first entry",
      "Set unlock timing",
      "Repeat over time as life happens",
    ],
    clickPath: ["Dashboard", "Vaults", "Upcoming"],
    clickTitle: "Where to keep track",
    clickLabel: "Use Dashboard for the full archive view, Vaults to keep building, and Upcoming to watch future reveals approach.",
    clickPrimary: "Upcoming unlocks",
    clickSecondary: ["Dashboard", "Vaults", "Unlocked memories"],
    icon: Sparkles,
  },
] as const;

const entryPrompts = [
  "Write what you hope they feel when they open this.",
  "Describe the room, the season, or the life stage around this memory.",
  "Add one detail future-you or future-them would otherwise forget.",
  "If this is a prediction, explain what you think life will be like then.",
];

const workflowNotes = [
  "Free is best for starting: create the vault, add text and photo memories, and build the habit.",
  "Premium is best when you want voice notes, video, and richer unlock options.",
  "Family is best when more than one person will help preserve the archive together.",
  "Upcoming unlocks and unlocked memories become easier to track from the dashboard once a few entries exist.",
];

export default async function HowToPage() {
  const [{ profile, user, avatarPreviewUrl }, supabase] = await Promise.all([getProfile(), createClient()]);
  const { data: vaults } = await supabase.from("vaults").select("id, name").order("created_at", { ascending: false }).limit(3);

  const firstVault = vaults?.[0] ?? null;
  const createEntryHref = firstVault ? `/vaults/${firstVault.id}/entries/new` : "/vaults/new";

  return (
    <AppShell fullName={profile?.full_name ?? user.user_metadata.full_name ?? null} email={user.email ?? ""} isAdmin={profile?.is_admin ?? false} avatarUrl={avatarPreviewUrl}>
      <div className="space-y-7 sm:space-y-8">
        <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
          <CardContent className="relative p-8 sm:p-10 lg:p-12">
            <div className="hero-orb absolute right-[-4rem] top-[-2rem] hidden h-52 w-52 rounded-full opacity-60 lg:block" />
            <div className="relative section-stack max-w-4xl">
              <Badge className="w-fit bg-secondary/88">How to use Vault Story</Badge>
              <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                A simple way to build vaults, add memories, and time them well.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base lg:text-lg lg:leading-8">
                Follow this guide when you want a clear path from the first vault to the first finished entry, with less guesswork and a calmer workflow.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild>
                  <Link href="/vaults/new">
                    Start with a vault
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={createEntryHref}>{firstVault ? "Add an entry" : "Create a vault before adding entries"}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-3 lg:grid-cols-4">
          {workflowSteps.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} className="overflow-hidden border-white/60 bg-card/84 shadow-[0_18px_48px_rgba(66,46,31,0.08)]">
                <CardContent className="flex items-center gap-3 p-4 sm:p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/90 text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{item.step}</p>
                    <h2 className="mt-1 text-balance font-display text-[1.05rem] leading-[1.12] text-foreground sm:text-[1.2rem]">{item.title}</h2>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-5 2xl:grid-cols-[minmax(0,1.1fr)_360px]">
          <div className="space-y-5">
            {workflowSteps.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step} className="overflow-hidden border-white/60 bg-card/88 shadow-[0_22px_64px_rgba(66,46,31,0.1)]">
                  <CardContent className="p-7 sm:p-8">
                    <div className="grid gap-6 2xl:grid-cols-[120px_minmax(0,1fr)_320px] 2xl:items-start">
                      <div className="flex items-center gap-4 2xl:block 2xl:space-y-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/90 text-primary">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Step {item.step}</p>
                        </div>
                      </div>

                      <div className="space-y-5 2xl:min-w-0">
                        <div className="space-y-4">
                          <h3 className="text-balance font-display text-3xl leading-tight text-foreground">{item.title}</h3>
                          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                            {item.body}
                          </p>
                        </div>

                        <div className="rounded-[28px] border border-border/70 bg-background/65 p-5 shadow-[0_14px_34px_rgba(66,46,31,0.05)]">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {item.clickPath.map((segment, index) => (
                              <div key={`${item.step}-${segment}`} className="inline-flex items-center gap-2">
                                <span className="rounded-full border border-border/70 bg-card px-3 py-1 text-foreground">{segment}</span>
                                {index < item.clickPath.length - 1 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 rounded-[24px] border border-secondary/20 bg-secondary/10 p-4">
                            <p className="text-sm font-medium text-foreground">{item.clickTitle}</p>
                            <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.clickLabel}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_12px_24px_rgba(48,32,23,0.12)]">
                                {item.clickPrimary}
                              </span>
                              {item.clickSecondary.map((chip) => (
                                <span key={chip} className="inline-flex items-center rounded-full border border-border/70 bg-card px-3 py-2 text-sm text-muted-foreground">
                                  {chip}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[26px] border border-secondary/20 bg-secondary/10 p-5 text-sm leading-7 text-muted-foreground 2xl:self-start">
                        <p className="font-medium text-foreground">{item.snippetTitle}</p>
                        <div className="mt-3 space-y-3">
                          {item.snippet.map((line) => (
                            <div key={line} className="flex items-start gap-3">
                              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                              <span>{line}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-5 2xl:sticky 2xl:top-6 2xl:self-start">
            <Card className="overflow-hidden bg-primary text-primary-foreground shadow-[0_22px_56px_rgba(48,32,23,0.18)]">
              <CardContent className="p-7 sm:p-8">
                <p className="text-sm uppercase tracking-[0.22em] text-primary-foreground/68">Entry writing prompts</p>
                <h2 className="mt-3 font-display text-3xl leading-tight">Useful prompts when you do not know what to write yet.</h2>
                <div className="mt-6 space-y-3">
                  {entryPrompts.map((prompt) => (
                    <div key={prompt} className="rounded-[24px] border border-white/12 bg-white/8 px-4 py-3 text-sm leading-7 text-primary-foreground/84">
                      {prompt}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardContent className="p-7 sm:p-8">
                <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Workflow notes</p>
                <div className="mt-5 space-y-3">
                  {workflowNotes.map((note) => (
                    <div key={note} className="flex items-start gap-3 rounded-[24px] border border-border/70 bg-background/65 px-4 py-3 text-sm leading-7 text-muted-foreground">
                      <BookOpenText className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(241,235,227,0.92))] shadow-[0_22px_64px_rgba(66,46,31,0.1)]">
              <CardContent className="p-7 sm:p-8">
                <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Next actions</p>
                <div className="mt-5 space-y-3">
                  <Button asChild className="w-full justify-between">
                    <Link href="/vaults/new">
                      Create a vault
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href={createEntryHref}>
                      {firstVault ? "Create an entry" : "Create your first vault first"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href="/dashboard#upcoming">
                      See upcoming unlocks
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <Card className="glass-panel lg:col-span-2">
            <CardContent className="p-7 sm:p-8">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Quick snippets</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">Simple examples you can model your first archive on</h2>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <div className="rounded-[26px] border border-border/70 bg-background/65 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Vault example</p>
                  <p className="mt-3 text-sm leading-7 text-foreground">"Letters for Mia"</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">A private vault for future birthday letters, photos, and short videos.</p>
                </div>
                <div className="rounded-[26px] border border-border/70 bg-background/65 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Entry example</p>
                  <p className="mt-3 text-sm leading-7 text-foreground">"For your eighteenth birthday"</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">A message about who they were at 5, what you hoped for them, and what you never wanted them to forget.</p>
                </div>
                <div className="rounded-[26px] border border-border/70 bg-background/65 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Unlock example</p>
                  <p className="mt-3 text-sm leading-7 text-foreground">Age milestone: 18</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">Perfect for milestone birthdays, first school days, moving out, or big future transitions.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_22px_64px_rgba(66,46,31,0.1)]">
            <CardContent className="p-7 sm:p-8">
              <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">How to think about it</p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-foreground">The best vaults usually start small.</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                One meaningful vault and one strong first entry is enough to understand the product. You do not need a perfect family archive on day one. You just need a starting point that feels worth preserving.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
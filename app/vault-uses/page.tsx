import Image from "next/image";
import Link from "next/link";
import {
  CalendarClock,
  HeartHandshake,
  ImageIcon,
  LockKeyhole,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const vaultUses = [
  {
    id: "ages",
    title: "Age milestones",
    description: "Open the right message at 16, 18, 21, or any age that matters most.",
    image: "/images/milestones/one-year-old.jpg",
    alt: "A child smiling on the first day of school in uniform.",
  },
  {
    id: "life",
    title: "Life milestones",
    description: "Baby, new home, engagement, wedding, or any major life chapter.",
    image: "/images/milestones/first-christmas.jpg",
    alt: "A family celebrating a cozy Christmas moment.",
  },
  {
    id: "personal-journaling",
    title: "Personal journaling",
    description: "Capture private reflections and keep them ready for a later day.",
    image: "/images/milestones/sad-woman-near-sea.jpg",
    alt: "A woman journaling on a quiet beach at sunrise.",
  },
  {
    id: "family-legacy",
    title: "Family legacy",
    description: "Grandparents can leave stories and messages for future grandkids.",
    image: "/images/milestones/IMG_1372.jpeg",
    alt: "A child posing with grandparents in a living room.",
    imagePosition: "center 20%",
  },
  {
    id: "childrens-memories",
    title: "Children's memories",
    description: "Hold onto the small moments of growing up and revisit them later.",
    image: "/images/milestones/first-day-of-school.jpeg",
    alt: "A child smiling on the first day of school in uniform.",
  },
  {
    id: "future-self",
    title: "Future self notes",
    description: "Write to the version of you that you will eventually meet.",
    image: "/images/milestones/Firefly_a picture showing future self notes 911221.png",
    alt: "A person writing notes for their future self beside a board of reminders.",
  },
  {
    id: "relationship",
    title: "Relationship time capsules",
    description: "Create messages for anniversaries, hard seasons, or new beginnings.",
    image: "/images/milestones/ChatGPT Image Mar 26, 2026, 07_22_05 PM.png",
    alt: "Two couples at different life stages sharing warm moments together.",
  },
  {
    id: "social",
    title: "Social vaults",
    description: "Shared vaults for families, teams, or close friend circles.",
    image: "/images/milestones/1305f06a-7aee-424b-acd3-89df6e988cda (1).JPG",
    alt: "A group reaching inward in a circle during a shared team moment.",
  },
  {
    id: "celebrations",
    title: "Celebrations & events",
    description: "Baby showers, birthdays, retirements, and gatherings worth reliving.",
    image: "/images/milestones/IMG_5129.JPG",
    alt: "A large group gathered on temple steps during a shared event.",
  },
  {
    id: "school-leavers",
    title: "School leavers",
    description: "Graduations, end-of-year letters, and the moment childhood turns.",
    image: "/images/milestones/last-day-of-kindergarten.jpeg",
    alt: "A child holding a kindergarten graduation certificate.",
  },
  {
    id: "letters-media",
    title: "Letters, voice, and video",
    description: "Save the tone, the voice, and the room along with the memory.",
    image: "/images/milestones/Firefly_a picture showing Letters, voice, and video  911221.png",
    alt: "Illustrated icons representing letters, voice recordings, and video memories.",
  },
  {
    id: "photo-story",
    title: "Photo stories",
    description: "Pair photos with context so the future gets the full story.",
    image: "/images/milestones/ChatGPT Image Mar 26, 2026, 07_41_36 PM.png",
    alt: "A photo story card pairing an image with a written memory about buying a first home.",
    imageFit: "contain",
    imageClassName: "bg-[#080716] p-4",
    imageFilterClassName: "brightness-125 contrast-110",
  },
];

export default function VaultUsesPage() {
  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <section className="page-wrap section-space">
          <div className="section-stack max-w-4xl">
            <Badge className="w-fit bg-secondary/88">Vault uses</Badge>
            <h1 className="text-balance font-display text-5xl leading-tight text-foreground sm:text-6xl">
              The vault can hold far more than one kind of memory.
            </h1>
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">
              From age milestones to family legacy, Vault Story is built to capture the moments people never want to lose.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button asChild>
                <Link href="/signup">Start free trial</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="page-wrap pb-16 sm:pb-20 lg:pb-24">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {vaultUses.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.id} id={item.id} className="glass-panel overflow-hidden border-white/70 bg-card/90">
                  <div className={`relative aspect-[5/4] overflow-hidden ${item.imageClassName ?? ""}`.trim()}>
                    {item.image ? (
                      <Image src={item.image} alt={item.alt ?? item.title} fill className={`${item.imageFit === "contain" ? "object-contain" : "object-cover"} ${item.imageFilterClassName ?? ""}`.trim()} style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined} sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),rgba(255,255,255,0.12)),linear-gradient(135deg,rgba(30,42,68,0.92),rgba(49,63,95,0.92))]">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-secondary shadow-[0_12px_28px_rgba(18,24,40,0.2)]">
                          {Icon ? <Icon className="h-8 w-8" /> : null}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,16,24,0.04),rgba(12,16,24,0.56))]" />
                  </div>
                  <CardContent className="space-y-2 p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Vault use</p>
                    <h2 className="text-balance font-display text-2xl text-foreground">{item.title}</h2>
                    <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}




















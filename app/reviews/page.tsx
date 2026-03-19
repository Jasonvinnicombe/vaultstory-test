import Link from "next/link";
import { CalendarClock, Heart, MessageSquareQuote, Sparkles, Video } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Emily, mother of two",
    title: "It felt like I had left my daughter a piece of my calm.",
    quote:
      "When she opened a birthday video I recorded years earlier, I cried before she did. I had forgotten the exact sound of my own voice from that season of motherhood. Watching her receive it made the whole thing feel less like storage and more like love arriving on time.",
    relived:
      "She said it felt like being hugged by an older version of me and a younger version of me at the same time.",
    unlock: "Unlocked on her 18th birthday",
    icon: Video,
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    alt: "A mother and daughter watching a video memory together",
  },
  {
    name: "Marcus, preserving stories from his father",
    title: "It felt like hearing him in the room again.",
    quote:
      "My dad recorded stories before his memory started fading. Months later, when I listened back with my kids, it was the first time they heard him tell those stories in his own voice. That moment felt gentle and devastating in the best possible way.",
    relived:
      "We were not just remembering him. We were being with him for a few minutes again.",
    unlock: "Unlocked after a family gathering",
    icon: MessageSquareQuote,
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
    alt: "A family gathered together watching old memories on a screen",
  },
  {
    name: "Sophie, writing to her future self",
    title: "It felt like being understood by someone who already knew the whole backstory.",
    quote:
      "I opened a letter I wrote during a hard season and it caught me completely off guard. I had forgotten how honest I was. Reading it years later felt grounding, almost like a conversation with the version of me who survived it first.",
    relived:
      "Instead of cringing at my past self, I felt grateful to her.",
    unlock: "Unlocked 10 years later",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
    alt: "A woman reliving a saved memory on her phone",
  },
];

const feelings = [
  {
    title: "More vivid than a photo album",
    body:
      "Because memories can include voice, video, and letters, people do not just remember the moment. They feel the tone of it again.",
    icon: Heart,
  },
  {
    title: "More intentional than cloud storage",
    body:
      "Timed delivery gives memories emotional context. The right message landing on the right day changes how deeply it is felt.",
    icon: CalendarClock,
  },
  {
    title: "More personal than social media",
    body:
      "These memories are not posted for attention. They are kept for the person who matters, until the moment they matter most.",
    icon: MessageSquareQuote,
  },
];

export default function ReviewsPage() {
  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <section className="page-wrap section-space">
          <Card className="overflow-hidden border-white/60 bg-[linear-gradient(135deg,rgba(255,252,247,0.96),rgba(241,235,227,0.92))] shadow-[0_26px_72px_rgba(66,46,31,0.1)]">
            <CardContent className="relative p-8 sm:p-10 lg:p-14">
              <div className="hero-orb absolute right-[-4rem] top-[-2rem] hidden h-48 w-48 rounded-full opacity-60 lg:block" />
              <div className="relative max-w-4xl section-stack">
                <Badge className="w-fit bg-secondary/88">Reviews and reflections</Badge>
                <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                  What it feels like when a memory returns at exactly the right moment.
                </h1>
                <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Vault Story is not only about preserving memories. It is about the feeling people have when they hear a voice again, read a letter from another season of life, or realize someone loved them enough to leave a moment waiting.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild><Link href="/signup">Start your vault</Link></Button>
                  <Button asChild variant="outline"><Link href="/pricing">View pricing</Link></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="page-wrap pb-8 sm:pb-12">
          <div className="grid gap-4 md:grid-cols-3">
            {feelings.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="glass-panel">
                  <CardContent className="p-7 sm:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/90 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-2xl">{item.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="page-wrap section-space soft-divider">
          <div className="max-w-3xl section-stack">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Testimonials</p>
            <h2 className="text-balance font-display text-4xl sm:text-5xl">Stories from people reliving moments they thought were gone.</h2>
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">
              These are the kinds of responses Vault Story is designed to create: not just convenience, but emotional return.
            </p>
          </div>

          <div className="mt-10 space-y-6 lg:mt-12">
            {testimonials.map((testimonial) => {
              const Icon = testimonial.icon;
              return (
                <Card key={testimonial.name} className="overflow-hidden border-white/60 bg-card/88 shadow-[0_20px_56px_rgba(66,46,31,0.09)]">
                  <CardContent className="grid gap-6 p-7 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:p-10">
                    <div className="section-stack rounded-[30px] bg-[linear-gradient(180deg,rgba(247,241,232,0.9),rgba(240,233,223,0.72))] p-6">
                      <div className="overflow-hidden rounded-[24px] border border-white/50 shadow-[0_14px_34px_rgba(66,46,31,0.08)]">
                        <img src={testimonial.image} alt={testimonial.alt} className="h-56 w-full object-cover" />
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/90 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">{testimonial.name}</p>
                        <h3 className="mt-3 font-display text-3xl leading-tight text-foreground">{testimonial.title}</h3>
                      </div>
                      <div className="rounded-[24px] bg-white/70 p-4 text-sm leading-7 text-muted-foreground">
                        <p className="font-medium text-foreground">Moment unlocked</p>
                        <p className="mt-1">{testimonial.unlock}</p>
                      </div>
                    </div>

                    <div className="section-stack">
                      <blockquote className="font-display text-2xl leading-relaxed text-foreground sm:text-[2rem]">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="rounded-[28px] border border-secondary/18 bg-secondary/10 p-5 sm:p-6">
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">What they felt</p>
                        <p className="mt-3 text-base leading-8 text-foreground/82 sm:text-lg">{testimonial.relived}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="page-wrap pb-24 lg:pb-32">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(30,42,68,1),rgba(49,63,95,0.96))] text-white shadow-[0_28px_72px_rgba(30,42,68,0.25)]">
            <CardContent className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">Create your own future moment</p>
                <h2 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">
                  Give someone a memory they will not just see, but truly feel when it returns.
                </h2>
              </div>
              <Button asChild size="lg" variant="secondary">
                <Link href="/signup">Create Your First Vault</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}



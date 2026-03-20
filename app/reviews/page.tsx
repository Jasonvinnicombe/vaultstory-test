import Link from "next/link";
import {
  CalendarClock,
  Heart,
  MessageSquareHeart,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const reviewHighlights = [
  {
    value: "Quietly emotional",
    title: "People talk about timing first",
    body: "The strongest reactions are not about storage. They are about hearing the right voice again at the exact moment it was needed.",
    icon: CalendarClock,
  },
  {
    value: "Deeply personal",
    title: "The best memories are rarely polished",
    body: "Families mention shaky videos, ordinary rooms, and unfiltered letters because those details are what make the memory feel alive.",
    icon: Heart,
  },
  {
    value: "Private by design",
    title: "It feels more like an archive than a feed",
    body: "People want a calmer place for family history, future messages, and milestone letters than a public social product could ever offer.",
    icon: ShieldCheck,
  },
];

const testimonials = [
  {
    name: "Emily R.",
    role: "Mum of two, Melbourne",
    title: "It felt like I had sent my daughter reassurance ahead of time.",
    quote:
      "I recorded a birthday message when she was still little enough to climb into my lap every morning. By the time she opened it, so much had changed. What undid me was how ordinary the video was. The kitchen behind me, the way I laughed halfway through, the exact tone in my voice. It did not feel like old media. It felt like love arriving exactly when she was old enough to understand it.",
    reflection:
      "She watched it twice, then said, 'I did not know I needed that today.' That was the moment I understood what this is really for.",
    unlock: "Opened on her 18th birthday",
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1400&q=80",
    alt: "A mother and daughter sitting close together by a window",
    accent: "video memory",
    icon: Video,
  },
  {
    name: "Marcus T.",
    role: "Son and father, Brisbane",
    title: "My kids got to hear grandad tell the story in his own voice.",
    quote:
      "My dad started forgetting details, so we began recording the family stories while he still had them. Months later we played one back after dinner and the whole room went quiet. My children were not listening to a summary from me. They were hearing him pause, laugh, remember, and tell it himself. That changed everything.",
    reflection:
      "It was the first time family history felt present instead of secondhand.",
    unlock: "Shared after a family gathering",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=1400&q=80",
    alt: "A family gathered together indoors sharing a warm moment",
    accent: "voice note archive",
    icon: MessageSquareHeart,
  },
  {
    name: "Sophie L.",
    role: "Designer, writing to her future self",
    title: "It sounded like someone who knew the whole backstory was speaking to me.",
    quote:
      "I wrote to myself during a hard year because I wanted to remember who I was before things got easier again. When it unlocked later, I expected it to feel embarrassing. Instead it felt tender. I could hear how hard I was trying and how much I needed kindness. It did not make me cringe at my past self. It made me feel protective of her.",
    reflection:
      "That letter gave me context for my own life in a way a journal never had.",
    unlock: "Opened 8 years later",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80",
    alt: "A woman sitting quietly with a notebook in soft natural light",
    accent: "future-self letter",
    icon: Sparkles,
  },
];

const closingNotes = [
  "They mention hearing a voice they forgot they missed.",
  "They talk about how ordinary details became the most precious part.",
  "They remember the exact day a locked memory suddenly felt meant for that version of life.",
];

export default function ReviewsPage() {
  const featuredReview = testimonials[0];
  const secondaryReviews = testimonials.slice(1);
  const FeaturedIcon = featuredReview.icon;

  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <section className="page-wrap section-space">
          <Card className="overflow-hidden border-white/60 bg-[linear-gradient(135deg,rgba(255,252,247,0.97),rgba(240,234,226,0.9))] shadow-[0_26px_72px_rgba(66,46,31,0.1)]">
            <CardContent className="relative p-8 sm:p-10 lg:p-14">
              <div className="hero-orb absolute right-[-4rem] top-[-2rem] hidden h-48 w-48 rounded-full opacity-60 lg:block" />
              <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div className="section-stack max-w-4xl">
                  <Badge className="w-fit bg-secondary/88">Family reflections</Badge>
                  <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                    The best reviews do not sound like product praise. They sound like someone trying to describe a memory coming back whole.
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                    This page is built around the kinds of reactions Vault Story is meant to create: a daughter hearing her mum at the right age, a family hearing grandad tell it himself, a letter from a harder season landing with new meaning years later.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button asChild><Link href="/signup">Start your vault</Link></Button>
                    <Button asChild variant="outline"><Link href="/pricing">View pricing</Link></Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {reviewHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="rounded-[28px] border border-white/65 bg-white/62 p-5 shadow-[0_12px_30px_rgba(30,42,68,0.05)] backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/18 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary/80">{item.value}</p>
                        </div>
                        <h2 className="mt-4 font-display text-2xl leading-tight text-foreground">{item.title}</h2>
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="page-wrap pb-10 sm:pb-14">
          <Card className="overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(30,42,68,0.985),rgba(49,63,95,0.95))] text-white shadow-[0_30px_80px_rgba(30,42,68,0.25)]">
            <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:p-10">
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5">
                <img src={featuredReview.image} alt={featuredReview.alt} className="h-full min-h-[340px] w-full object-cover" />
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div className="section-stack">
                  <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.2em] text-white/62">
                    <span>{featuredReview.name}</span>
                    <span className="h-1 w-1 rounded-full bg-secondary/80" />
                    <span>{featuredReview.role}</span>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/14 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/72">
                    <FeaturedIcon className="h-3.5 w-3.5 text-secondary" />
                    {featuredReview.accent}
                  </div>

                  <h2 className="text-balance font-display text-4xl leading-tight sm:text-5xl">{featuredReview.title}</h2>

                  <blockquote className="text-base leading-8 text-white/82 sm:text-lg sm:leading-9">
                    \"{featuredReview.quote}\"
                  </blockquote>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div className="rounded-[26px] border border-white/10 bg-white/7 p-5">
                    <p className="text-sm uppercase tracking-[0.2em] text-white/56">What stayed with them</p>
                    <p className="mt-3 text-base leading-8 text-white/86">{featuredReview.reflection}</p>
                  </div>
                  <div className="rounded-[24px] border border-secondary/20 bg-secondary/14 px-5 py-4 text-sm leading-7 text-white/86">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/56">Opened</p>
                    <p className="mt-2 font-medium text-white">{featuredReview.unlock}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="page-wrap section-space soft-divider">
          <div className="max-w-3xl section-stack">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">More reflections</p>
            <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Different stories, same feeling: the memory did not just survive. It arrived with context.
            </h2>
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">
              These stories work best when the image, the words, and the timing all feel like they belong to the same life. That is what makes them land cleanly.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
            {secondaryReviews.map((testimonial) => {
              const Icon = testimonial.icon;
              return (
                <Card
                  key={testimonial.name}
                  className="overflow-hidden border-white/60 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(243,236,227,0.82))] shadow-[0_20px_56px_rgba(66,46,31,0.09)]"
                >
                  <CardContent className="p-6 sm:p-7 lg:p-8">
                    <div className="overflow-hidden rounded-[28px] border border-white/60 shadow-[0_18px_40px_rgba(30,42,68,0.08)]">
                      <img src={testimonial.image} alt={testimonial.alt} className="h-72 w-full object-cover" />
                    </div>

                    <div className="mt-6 section-stack">
                      <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                        <span>{testimonial.name}</span>
                        <span className="h-1 w-1 rounded-full bg-secondary/90" />
                        <span>{testimonial.role}</span>
                      </div>

                      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-primary/80">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                        {testimonial.accent}
                      </div>

                      <h3 className="text-balance font-display text-3xl leading-tight text-foreground">{testimonial.title}</h3>
                      <blockquote className="text-sm leading-8 text-foreground/82 sm:text-base">
                        \"{testimonial.quote}\"
                      </blockquote>

                      <div className="rounded-[24px] border border-white/70 bg-white/66 p-5">
                        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">What stayed with them</p>
                        <p className="mt-3 text-base leading-8 text-foreground/80">{testimonial.reflection}</p>
                      </div>

                      <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary/76">{testimonial.unlock}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="page-wrap pb-14 pt-2 sm:pb-18">
          <Card className="overflow-hidden border-white/60 bg-card/88 shadow-[0_20px_56px_rgba(66,46,31,0.09)]">
            <CardContent className="grid gap-8 p-7 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
              <div className="section-stack max-w-xl">
                <Badge className="w-fit bg-secondary/84">What people keep saying</Badge>
                <h2 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl">
                  The details they remember most are never the polished ones.
                </h2>
                <p className="text-base leading-8 text-muted-foreground sm:text-lg">
                  It is the room tone. The half-laugh. The way someone looked before life changed. The reason a message was saved in the first place. That is why these reviews read more like family reflections than product copy.
                </p>
              </div>

              <div className="grid gap-4">
                {closingNotes.map((note) => (
                  <div
                    key={note}
                    className="flex items-start gap-4 rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,242,235,0.76))] px-5 py-5 shadow-[0_12px_30px_rgba(30,42,68,0.05)]"
                  >
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/18 text-primary">
                      <Heart className="h-4 w-4" />
                    </div>
                    <p className="text-base leading-8 text-foreground/82">{note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="page-wrap pb-24 lg:pb-32">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(30,42,68,1),rgba(49,63,95,0.96))] text-white shadow-[0_28px_72px_rgba(30,42,68,0.25)]">
            <CardContent className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">Create your own future moment</p>
                <h2 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">
                  Save something now that a future version of someone you love will be grateful to receive.
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


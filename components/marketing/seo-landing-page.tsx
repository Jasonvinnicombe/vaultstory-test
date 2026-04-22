import Link from "next/link";
import { ArrowRight, CalendarClock, HeartHandshake, LockKeyhole, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type LandingPoint = {
  title: string;
  body: string;
  icon?: LucideIcon;
};

type LandingFaq = {
  question: string;
  answer: string;
};

export type SeoLandingPageContent = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  primaryCta?: string;
  secondaryCta?: string;
  points: LandingPoint[];
  sections: Array<{
    title: string;
    body: string;
  }>;
  faqs: LandingFaq[];
};

const fallbackIcons = [LockKeyhole, CalendarClock, HeartHandshake, MessageSquareText, ShieldCheck, Sparkles];

export function SeoLandingPage({ content }: { content: SeoLandingPageContent }) {
  const pageUrl = `${SITE_URL}/${content.slug}`;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_NAME,
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content.eyebrow,
        item: pageUrl,
      },
    ],
  };

  return (
    <div className="grain min-h-screen overflow-x-hidden">
      <JsonLd data={[faqSchema, breadcrumbSchema]} />
      <SiteHeader />
      <main>
        <section className="page-wrap section-space">
          <Card className="overflow-hidden border-white/60 bg-[linear-gradient(135deg,rgba(255,252,247,0.97),rgba(242,233,223,0.92))] shadow-[0_26px_72px_rgba(66,46,31,0.1)]">
            <CardContent className="relative p-8 sm:p-10 lg:p-14">
              <div className="hero-orb absolute right-[-4rem] top-[-2rem] hidden h-48 w-48 rounded-full opacity-60 lg:block" />
              <div className="relative grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
                <div className="section-stack max-w-4xl">
                  <Badge className="w-fit bg-secondary/88">{content.eyebrow}</Badge>
                  <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                    {content.title}
                  </h1>
                  <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                    {content.description}
                  </p>
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <Button asChild>
                      <Link href="/signup">
                        {content.primaryCta ?? "Start free"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/pricing">{content.secondaryCta ?? "View pricing"}</Link>
                    </Button>
                  </div>
                </div>

                <Card className="border-white/65 bg-white/72 shadow-[0_22px_56px_rgba(143,71,43,0.1)]">
                  <CardContent className="space-y-4 p-6 sm:p-7">
                    <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Why it matters</p>
                    <p className="text-lg leading-8 text-foreground">{content.intro}</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="page-wrap pb-10 sm:pb-14">
          <div className="grid gap-4 md:grid-cols-3">
            {content.points.map((point, index) => {
              const Icon = point.icon ?? fallbackIcons[index % fallbackIcons.length];

              return (
                <Card key={point.title} className="glass-panel">
                  <CardContent className="p-7 sm:p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/90 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-2xl leading-tight text-foreground">{point.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">{point.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="page-wrap section-space soft-divider">
          <div className="grid gap-6 lg:grid-cols-2">
            {content.sections.map((section) => (
              <Card key={section.title} className="overflow-hidden border-white/65 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(243,236,227,0.82))] shadow-[0_18px_48px_rgba(143,71,43,0.08)]">
                <CardContent className="p-7 sm:p-8">
                  <h2 className="text-balance font-display text-3xl leading-tight text-foreground">{section.title}</h2>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">{section.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="page-wrap pb-16 lg:pb-24">
          <div className="max-w-3xl section-stack">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">Common questions</p>
            <h2 className="text-balance font-display text-4xl sm:text-5xl">Helpful answers before you start.</h2>
          </div>

          <div className="mt-8 space-y-3">
            {content.faqs.map((faq) => (
              <details key={faq.question} className="group rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(247,243,237,0.82))] px-5 py-5 shadow-[0_12px_30px_rgba(143,71,43,0.05)]">
                <summary className="cursor-pointer list-none text-lg font-semibold leading-7 text-foreground">
                  {faq.question}
                </summary>
                <div className="pt-4 text-sm leading-8 text-muted-foreground sm:text-base">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="page-wrap pb-24 lg:pb-32">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(143,71,43,1),rgba(184,92,56,0.96),rgba(201,126,103,0.9))] text-white shadow-[0_28px_72px_rgba(143,71,43,0.25)]">
            <CardContent className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-white/60">Start with one memory</p>
                <h2 className="mt-4 text-balance font-display text-4xl leading-tight sm:text-5xl">
                  Create a private vault and preserve the first story your future family should not lose.
                </h2>
              </div>
              <Button asChild size="lg" variant="secondary">
                <Link href="/signup">Start free</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms & Conditions | Vault Story",
  description: "Terms & Conditions for using Vault Story.",
};

const sections = [
  {
    title: "Using Vault Story",
    body: "Vault Story is for creating, storing, and sharing private time-based memories. You agree to use the service lawfully and not upload anything abusive, infringing, deceptive, or harmful.",
  },
  {
    title: "Your account",
    body: "You are responsible for maintaining the security of your account, password, and any authenticator-based verification you enable. You must provide accurate signup details and keep your access credentials private.",
  },
  {
    title: "Your content",
    body: "You keep ownership of the memories, media, and text you upload. By using Vault Story, you give the service permission to host, process, and display that content only as needed to operate the product for you and the people you intentionally share with.",
  },
  {
    title: "Privacy and sharing",
    body: "Vault Story is designed for private archives, but you are responsible for deciding who can access a vault, who receives invitations, and what gets stored inside it. Do not upload content you do not have the right to preserve or share.",
  },
  {
    title: "Billing and paid plans",
    body: "Paid memberships renew according to the billing terms shown at checkout unless canceled. Pricing, plan limits, storage allowances, and feature access may vary by plan and can change over time with reasonable notice where required.",
  },
  {
    title: "Availability",
    body: "We aim to keep Vault Story available and secure, but the service is provided on an as-available basis. Features may evolve, and temporary downtime, maintenance, or technical issues can occur.",
  },
  {
    title: "Termination",
    body: "We may suspend or terminate accounts that misuse the platform, break the law, or create risk for other users or the service. You may stop using Vault Story at any time.",
  },
  {
    title: "Contact",
    body: "If you have questions about these Terms & Conditions, contact Vault Story through the support channel listed in the product or the team managing your deployment.",
  },
] as const;

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-5">
          <Badge className="bg-secondary/85">Terms & Conditions</Badge>
          <h1 className="max-w-4xl font-display text-5xl leading-tight text-foreground sm:text-6xl">
            The ground rules for using Vault Story.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            These terms explain the basic responsibilities around your account, your content, privacy, billing, and how Vault Story is provided.
          </p>
          <p className="text-sm text-muted-foreground">
            Creating an account means you agree to these terms. If you are signing up now, you can go back to <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">the signup page</Link> after reading them.
          </p>
        </div>

        <Card className="overflow-hidden border-white/60 bg-card/90 shadow-[0_28px_84px_rgba(66,46,31,0.12)]">
          <CardContent className="space-y-8 p-8 sm:p-10">
            {sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="font-display text-2xl text-foreground sm:text-3xl">{section.title}</h2>
                <p className="max-w-3xl text-sm leading-8 text-muted-foreground sm:text-base">{section.body}</p>
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

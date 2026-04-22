import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the Vault Story privacy policy for private family memory vaults, account data, media uploads, storage, security, and third-party services.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Vault Story Privacy Policy",
    description:
      "Privacy details for private family memory vaults, account data, media uploads, storage, security, and third-party services.",
    url: `${SITE_URL}/privacy`,
  },
};

const sections = [
  {
    title: "What we collect",
    body: "We collect the information you provide when creating an account, such as your name, email address, and the memories, media, and metadata you choose to store in Vault Story.",
  },
  {
    title: "How we use information",
    body: "We use your information to operate the service, deliver your memories on schedule, send essential account emails, and support collaboration you intentionally enable. We do not sell your personal data.",
  },
  {
    title: "Content and access",
    body: "Your vault content is private by default. Access is limited to you and the people you explicitly invite. You control what gets shared, with whom, and when.",
  },
  {
    title: "Emails and notifications",
    body: "We send service emails for account access, security, and unlock notifications you opt into. You can adjust notification preferences in Settings.",
  },
  {
    title: "Storage and security",
    body: "We use secure storage providers and access controls to protect your data. While no system can guarantee perfect security, we apply industry-standard practices to safeguard your information.",
  },
  {
    title: "Retention and deletion",
    body: "You can delete vaults, entries, and media from your account. If a paid subscription ends and the account is above the Free storage allowance, Vault Story may keep the archive intact for a limited downgrade grace period so you can delete files or resume service. Some operational logs may be retained for security, compliance, or billing requirements where applicable.",
  },
  {
    title: "Third-party services",
    body: "Vault Story relies on trusted infrastructure partners for hosting, storage, email delivery, and payments. These providers only receive the information needed to perform their service for Vault Story.",
  },
  {
    title: "Contact",
    body: "For privacy questions, contact us at support@vaultstory.app. We will respond as quickly as we can.",
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-16 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-5">
          <Badge className="bg-secondary/85">Privacy Policy</Badge>
          <h1 className="max-w-4xl font-display text-5xl leading-tight text-foreground sm:text-6xl">
            How Vault Story respects and protects your privacy.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            This policy explains what information we collect, how we use it, and the choices you have when using Vault Story.
          </p>
          <p className="text-sm text-muted-foreground">
            If you are signing up now, you can return to <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">the signup page</Link> after reading this policy.
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

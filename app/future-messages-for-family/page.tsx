import type { Metadata } from "next";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { seoLandingPages } from "@/lib/seo-landing-pages";
import { SITE_URL } from "@/lib/site";

const content = seoLandingPages["future-messages-for-family"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: {
    canonical: "/future-messages-for-family",
  },
  openGraph: {
    title: content.metaTitle,
    description: content.metaDescription,
    url: `${SITE_URL}/future-messages-for-family`,
  },
};

export default function FutureMessagesForFamilyPage() {
  return <SeoLandingPage content={content} />;
}

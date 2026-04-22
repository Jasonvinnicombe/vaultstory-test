import type { Metadata } from "next";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { seoLandingPages } from "@/lib/seo-landing-pages";
import { SITE_URL } from "@/lib/site";

const content = seoLandingPages["legacy-messages"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: {
    canonical: "/legacy-messages",
  },
  openGraph: {
    title: content.metaTitle,
    description: content.metaDescription,
    url: `${SITE_URL}/legacy-messages`,
  },
};

export default function LegacyMessagesPage() {
  return <SeoLandingPage content={content} />;
}

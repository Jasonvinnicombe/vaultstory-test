import type { Metadata } from "next";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { seoLandingPages } from "@/lib/seo-landing-pages";
import { SITE_URL } from "@/lib/site";

const content = seoLandingPages["family-memory-vault"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: {
    canonical: "/family-memory-vault",
  },
  openGraph: {
    title: content.metaTitle,
    description: content.metaDescription,
    url: `${SITE_URL}/family-memory-vault`,
  },
};

export default function FamilyMemoryVaultPage() {
  return <SeoLandingPage content={content} />;
}

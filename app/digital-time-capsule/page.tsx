import type { Metadata } from "next";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { seoLandingPages } from "@/lib/seo-landing-pages";
import { SITE_URL } from "@/lib/site";

const content = seoLandingPages["digital-time-capsule"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: {
    canonical: "/digital-time-capsule",
  },
  openGraph: {
    title: content.metaTitle,
    description: content.metaDescription,
    url: `${SITE_URL}/digital-time-capsule`,
  },
};

export default function DigitalTimeCapsulePage() {
  return <SeoLandingPage content={content} />;
}

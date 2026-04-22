import type { Metadata } from "next";

import { SeoLandingPage } from "@/components/marketing/seo-landing-page";
import { seoLandingPages } from "@/lib/seo-landing-pages";
import { SITE_URL } from "@/lib/site";

const content = seoLandingPages["voice-messages-for-loved-ones"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: {
    canonical: "/voice-messages-for-loved-ones",
  },
  openGraph: {
    title: content.metaTitle,
    description: content.metaDescription,
    url: `${SITE_URL}/voice-messages-for-loved-ones`,
  },
};

export default function VoiceMessagesForLovedOnesPage() {
  return <SeoLandingPage content={content} />;
}

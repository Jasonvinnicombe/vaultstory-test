import type { Metadata } from "next";

import "./globals.css";

import { CurrencyDetect } from "@/components/layout/currency-detect";
import { Toaster } from "@/components/ui/sonner";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Private Family Memory Vault & Digital Time Capsule`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  category: "family memory preservation",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg?v=20260414", type: "image/svg+xml" },
      { url: "/icon.svg?v=20260414", rel: "shortcut icon", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: `${SITE_NAME} | Private Family Memory Vault & Digital Time Capsule`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/Vaultstory.png",
        width: 2736,
        height: 1388,
        alt: "Vault Story private family memory vault",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Private Family Memory Vault`,
    description: SITE_DESCRIPTION,
    images: ["/Vaultstory.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans [--font-display:'Playfair_Display','Playfair Display',Georgia,serif] [--font-sans:'Inter',system-ui,-apple-system,'Segoe_UI',sans-serif]">
        <CurrencyDetect />
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}

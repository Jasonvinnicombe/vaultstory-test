import type { Metadata } from "next";

import "./globals.css";

import { CurrencyDetect } from "@/components/layout/currency-detect";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.vaultstory.app"),
  title: "Vault Story",
  description: "Capture a moment, a belief, a promise, or a prediction and send it forward in time.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg?v=20260414", type: "image/svg+xml" },
      { url: "/icon.svg?v=20260414", rel: "shortcut icon", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Vault Story",
    description: "Capture a moment, a belief, a promise, or a prediction and send it forward in time.",
    url: "https://www.vaultstory.app",
    siteName: "Vault Story",
    images: [
      {
        url: "/Vaultstory.png",
        width: 2736,
        height: 1388,
        alt: "Vault Story logo",
      },
    ],
    type: "website",
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

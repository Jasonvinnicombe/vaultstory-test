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
      { url: "/google-favicon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/google-favicon.png", rel: "shortcut icon", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/Vaultstory.png", sizes: "2736x1388", type: "image/png" }],
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

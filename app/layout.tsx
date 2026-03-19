import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Vault Story",
  description: "Capture a moment, a belief, a promise, or a prediction and send it forward in time.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans [--font-display:'Playfair_Display','Playfair Display',Georgia,serif] [--font-sans:'Inter',system-ui,-apple-system,'Segoe_UI',sans-serif]">
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}

import type { Metadata } from "next";

import { MobileHomeScreen } from "@/components/mobile/mobile-home-screen";

export const metadata: Metadata = {
  title: "Mobile home | Vault Story",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MobileHomePage() {
  return <MobileHomeScreen />;
}

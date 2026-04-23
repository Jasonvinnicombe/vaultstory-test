import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/pricing",
          "/vault-uses",
          "/reviews",
          "/faq",
          "/support",
          "/privacy",
          "/terms",
          "/founder-offer",
        ],
        disallow: [
          "/admin",
          "/api",
          "/dashboard",
          "/entries",
          "/mobile-billing",
          "/mobile-home",
          "/mobile-login",
          "/mobile-signup",
          "/node_modules",
          "/settings",
          "/vaults",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

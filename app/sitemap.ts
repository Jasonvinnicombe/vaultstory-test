import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

const publicRoutes = [
  { path: "/", priority: 1 },
  { path: "/pricing", priority: 0.9 },
  { path: "/vault-uses", priority: 0.85 },
  { path: "/faq", priority: 0.8 },
  { path: "/reviews", priority: 0.75 },
  { path: "/founder-offer", priority: 0.7 },
  { path: "/support", priority: 0.55 },
  { path: "/privacy", priority: 0.35 },
  { path: "/terms", priority: 0.35 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.path === "/" || route.path === "/pricing" ? "weekly" : "monthly",
    priority: route.priority,
  }));
}

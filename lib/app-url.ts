import { normalizeEnvValue } from "@/lib/supabase/config";
import { SITE_URL } from "@/lib/site";

export function getConfiguredAppUrl() {
  return normalizeEnvValue(process.env.APP_URL) || normalizeEnvValue(process.env.NEXT_PUBLIC_APP_URL) || SITE_URL;
}

export function getAppUrl() {
  const appUrl = getConfiguredAppUrl();

  if (!appUrl) {
    throw new Error("Missing app URL configuration. Add APP_URL or NEXT_PUBLIC_APP_URL.");
  }

  return appUrl;
}

export function resolveAppUrl(fallbackOrigin?: string) {
  return getConfiguredAppUrl() || fallbackOrigin || SITE_URL;
}

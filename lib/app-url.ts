import { normalizeEnvValue } from "@/lib/supabase/config";

export function getAppUrl() {
  const appUrl = normalizeEnvValue(process.env.APP_URL) || normalizeEnvValue(process.env.NEXT_PUBLIC_APP_URL);

  if (!appUrl) {
    throw new Error("Missing app URL configuration. Add APP_URL or NEXT_PUBLIC_APP_URL.");
  }

  return appUrl;
}

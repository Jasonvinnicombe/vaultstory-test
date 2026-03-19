import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export { hasSupabaseEnv } from "@/lib/supabase/config";

export function createClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const { anonKey, url } = getSupabaseEnv();

  return createBrowserClient<Database>(url, anonKey);
}

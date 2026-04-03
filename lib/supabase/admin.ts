import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import { normalizeEnvValue } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

type TypedSupabaseClient = SupabaseClient<Database>;

let supabaseAdminClient: TypedSupabaseClient | null = null;

function getSupabaseAdminClient(): TypedSupabaseClient {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const url = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!url || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  supabaseAdminClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return supabaseAdminClient;
}

export const supabaseAdmin = new Proxy({} as TypedSupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdminClient();
    const value = client[prop as keyof TypedSupabaseClient];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

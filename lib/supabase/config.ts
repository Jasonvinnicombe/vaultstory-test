export function normalizeEnvValue(value: string | undefined) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

export function hasSupabaseEnv() {
  return Boolean(normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL) && normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
}

export function getSupabaseEnv() {
  const url = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return { url, anonKey };
}


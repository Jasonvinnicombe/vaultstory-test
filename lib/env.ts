import { z } from "zod";

function normalizeEnvValue(value: string | undefined) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().min(1).optional(),
  UNLOCK_NOTIFICATIONS_CRON_SECRET: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PREMIUM_PRICE_ID: z.string().min(1).optional(),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

function loadEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  cachedEnv = envSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY),
    NEXT_PUBLIC_APP_URL: normalizeEnvValue(process.env.NEXT_PUBLIC_APP_URL),
    RESEND_API_KEY: normalizeEnvValue(process.env.RESEND_API_KEY),
    RESEND_FROM_EMAIL: normalizeEnvValue(process.env.RESEND_FROM_EMAIL),
    UNLOCK_NOTIFICATIONS_CRON_SECRET: normalizeEnvValue(process.env.UNLOCK_NOTIFICATIONS_CRON_SECRET),
    STRIPE_SECRET_KEY: normalizeEnvValue(process.env.STRIPE_SECRET_KEY),
    STRIPE_WEBHOOK_SECRET: normalizeEnvValue(process.env.STRIPE_WEBHOOK_SECRET),
    STRIPE_PREMIUM_PRICE_ID: normalizeEnvValue(process.env.STRIPE_PREMIUM_PRICE_ID),
  });

  return cachedEnv;
}

export const env = new Proxy({} as Env, {
  get(_target, prop: keyof Env) {
    return loadEnv()[prop];
  },
});

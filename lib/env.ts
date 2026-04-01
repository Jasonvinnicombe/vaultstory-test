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
  STRIPE_PREMIUM_PRICE_ID_AUD: z.string().min(1).optional(),
  STRIPE_PREMIUM_PRICE_ID_USD: z.string().min(1).optional(),
  STRIPE_PREMIUM_PRICE_ID_GBP: z.string().min(1).optional(),
  STRIPE_PREMIUM_PRICE_ID_EUR: z.string().min(1).optional(),
  STRIPE_FAMILY_PRICE_ID: z.string().min(1).optional(),
  STRIPE_FAMILY_PRICE_ID_AUD: z.string().min(1).optional(),
  STRIPE_FAMILY_PRICE_ID_USD: z.string().min(1).optional(),
  STRIPE_FAMILY_PRICE_ID_GBP: z.string().min(1).optional(),
  STRIPE_FAMILY_PRICE_ID_EUR: z.string().min(1).optional(),
  R2_ACCOUNT_ID: z.string().min(1).optional(),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  R2_BUCKET: z.string().min(1).optional(),
  R2_PUBLIC_BASE_URL: z.string().url().optional(),
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
    STRIPE_PREMIUM_PRICE_ID_AUD: normalizeEnvValue(process.env.STRIPE_PREMIUM_PRICE_ID_AUD),
    STRIPE_PREMIUM_PRICE_ID_USD: normalizeEnvValue(process.env.STRIPE_PREMIUM_PRICE_ID_USD),
    STRIPE_PREMIUM_PRICE_ID_GBP: normalizeEnvValue(process.env.STRIPE_PREMIUM_PRICE_ID_GBP),
    STRIPE_PREMIUM_PRICE_ID_EUR: normalizeEnvValue(process.env.STRIPE_PREMIUM_PRICE_ID_EUR),
    STRIPE_FAMILY_PRICE_ID: normalizeEnvValue(process.env.STRIPE_FAMILY_PRICE_ID),
    STRIPE_FAMILY_PRICE_ID_AUD: normalizeEnvValue(process.env.STRIPE_FAMILY_PRICE_ID_AUD),
    STRIPE_FAMILY_PRICE_ID_USD: normalizeEnvValue(process.env.STRIPE_FAMILY_PRICE_ID_USD),
    STRIPE_FAMILY_PRICE_ID_GBP: normalizeEnvValue(process.env.STRIPE_FAMILY_PRICE_ID_GBP),
    STRIPE_FAMILY_PRICE_ID_EUR: normalizeEnvValue(process.env.STRIPE_FAMILY_PRICE_ID_EUR),
    R2_ACCOUNT_ID: normalizeEnvValue(process.env.R2_ACCOUNT_ID),
    R2_ACCESS_KEY_ID: normalizeEnvValue(process.env.R2_ACCESS_KEY_ID),
    R2_SECRET_ACCESS_KEY: normalizeEnvValue(process.env.R2_SECRET_ACCESS_KEY),
    R2_BUCKET: normalizeEnvValue(process.env.R2_BUCKET),
    R2_PUBLIC_BASE_URL: normalizeEnvValue(process.env.R2_PUBLIC_BASE_URL),
  });

  return cachedEnv;
}

export const env = new Proxy({} as Env, {
  get(_target, prop: keyof Env) {
    return loadEnv()[prop];
  },
});

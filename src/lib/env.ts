import { z } from "zod";

import {
  resolveDatabaseUrl,
  resolveDirectUrl,
  resolveSupabaseAnonKey,
  resolveSupabaseServiceRoleKey,
  resolveSupabaseUrl,
} from "@/lib/resolve-env";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PRICE_ID: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  CRON_SECRET: z.string().min(1).optional(),
});

function getClientEnv() {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: resolveSupabaseUrl(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: resolveSupabaseAnonKey(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });
}

function getServerEnv() {
  if (typeof window !== "undefined") {
    return {};
  }

  return serverEnvSchema.parse({
    DATABASE_URL: resolveDatabaseUrl(),
    DIRECT_URL: resolveDirectUrl(),
    SUPABASE_SERVICE_ROLE_KEY: resolveSupabaseServiceRoleKey(),
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID: process.env.STRIPE_PRICE_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    CRON_SECRET: process.env.CRON_SECRET,
  });
}

export const env = {
  ...getClientEnv(),
  ...getServerEnv(),
};

export function requireSupabaseEnv() {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
  }

  return { url, anonKey };
}

export function requireDatabaseEnv() {
  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "Missing DATABASE_URL. Set it in .env.local to connect to PostgreSQL.",
    );
  }

  return { databaseUrl, directUrl: env.DIRECT_URL };
}

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function isSupabaseConfigured() {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isDatabaseConfigured() {
  return Boolean(env.DATABASE_URL);
}

export function isOpenAIConfigured() {
  return Boolean(env.OPENAI_API_KEY);
}

export function isStripeConfigured() {
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_PRICE_ID);
}

export function requireStripeEnv() {
  const secretKey = env.STRIPE_SECRET_KEY;
  const priceId = env.STRIPE_PRICE_ID;

  if (!secretKey || !priceId) {
    throw new Error(
      "Missing Stripe env vars. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in .env.local",
    );
  }

  return { secretKey, priceId, webhookSecret: env.STRIPE_WEBHOOK_SECRET };
}

export function requireOpenAIEnv() {
  const apiKey = env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY. Set it in .env.local to enable AI recommendations.",
    );
  }

  return { apiKey };
}

export function isResendConfigured() {
  return Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL);
}

export function requireResendEnv() {
  const apiKey = env.RESEND_API_KEY;
  const fromEmail = env.RESEND_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    throw new Error(
      "Missing Resend env vars. Set RESEND_API_KEY and RESEND_FROM_EMAIL in .env.local",
    );
  }

  return { apiKey, fromEmail };
}

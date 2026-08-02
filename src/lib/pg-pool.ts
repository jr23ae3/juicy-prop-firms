import { Pool, type PoolConfig } from "pg";

import { resolveDatabaseUrl } from "@/lib/resolve-env";

function isSupabaseConnectionString(connectionString: string): boolean {
  return (
    connectionString.includes("supabase.com") ||
    connectionString.includes("pooler.supabase.com")
  );
}

function normalizeSupabaseUrl(connectionString: string): string {
  try {
    const parsed = new URL(connectionString);
    parsed.searchParams.delete("sslmode");
    parsed.searchParams.delete("sslaccept");
    return parsed.toString();
  } catch {
    return connectionString.replace(/([?&])sslmode=[^&]*&?/g, "$1").replace(/[?&]$/, "");
  }
}

export function createPgPool(connectionString?: string): Pool {
  const rawUrl = connectionString ?? resolveDatabaseUrl();

  if (!rawUrl) {
    throw new Error(
      "Database URL is not set. Add DATABASE_URL or POSTGRES_URL to your environment.",
    );
  }

  const url = isSupabaseConnectionString(rawUrl)
    ? normalizeSupabaseUrl(rawUrl)
    : rawUrl;

  const config: PoolConfig = {
    connectionString: url,
    max: process.env.NODE_ENV === "production" ? 1 : undefined,
  };

  if (isSupabaseConnectionString(rawUrl)) {
    config.ssl = { rejectUnauthorized: false };
  }

  return new Pool(config);
}

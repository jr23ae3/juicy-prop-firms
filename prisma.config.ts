import "dotenv/config";

import { defineConfig, env } from "prisma/config";

import {
  resolveDatabaseUrl,
  resolveDirectUrl,
} from "./src/lib/resolve-env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Use direct connection for migrations when available (e.g. Supabase)
    url: resolveDirectUrl() ?? resolveDatabaseUrl() ?? env("DATABASE_URL"),
  },
});

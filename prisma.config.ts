import "dotenv/config";

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Use direct connection for migrations when available (e.g. Supabase)
    url: process.env.DIRECT_URL ?? env("DATABASE_URL"),
  },
});

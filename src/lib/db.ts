import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "@/generated/prisma/client";
import { resolveDatabaseUrl } from "@/lib/resolve-env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = resolveDatabaseUrl();

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env.local to use the database.",
    );
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ adapter });
}

export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

/** Lazy database client — only connects when first accessed. */
export const db = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});

export type Database = PrismaClient;

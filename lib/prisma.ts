// lib/prisma.ts
import { PrismaClient } from "@/prisma/generated/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Lazy initialization — defers new PrismaClient() to the first property access
// at request time, so the Docker build succeeds without DATABASE_URL.
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

let _client: PrismaClient | null = null;

function getClient(): PrismaClient {
  if (globalThis.prismaGlobal) return globalThis.prismaGlobal;
  if (!_client) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not defined");
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    _client = new PrismaClient({ adapter });
    if (process.env.NODE_ENV !== "production") {
      globalThis.prismaGlobal = _client;
    }
  }
  return _client;
}

const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getClient() as never as Record<string | symbol, unknown>)[prop];
  },
});

// Export par défaut du client
export default prisma;

// Export nommé du client (pour compatibilité)
export { prisma };

// Re-export de tous les types générés par Prisma
export * from "@/prisma/generated/client";
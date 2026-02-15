// lib/prisma.ts
import { PrismaClient } from "@/prisma/generated/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// On informe TypeScript que l'objet global possède une propriété optionnelle prismaGlobal
declare global {
    var prismaGlobal: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (globalThis.prismaGlobal) {
    prisma = globalThis.prismaGlobal;
} else {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not defined");
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });

    if (process.env.NODE_ENV !== "production") {
        globalThis.prismaGlobal = prisma;
    }
}

// Export par défaut du client
export default prisma;

// Export nommé du client (pour compatibilité)
export { prisma };

// Re-export de tous les types générés par Prisma
export * from "@/prisma/generated/client";
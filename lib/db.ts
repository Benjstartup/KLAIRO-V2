/**
 * lib/db.ts — Prisma client singleton
 *
 * In development, Next.js hot reloads create new module instances on each
 * change, which would exhaust the database connection pool. The global
 * singleton pattern prevents that.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

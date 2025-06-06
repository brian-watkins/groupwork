import { PrismaClient } from "../../generated/prisma/client"
export { PrismaClient } from "../../generated/prisma/client"
export type { Prisma } from "../../generated/prisma/client"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit during hot reloading.
const globalForPrisma = global as unknown as { prisma: PrismaClient }

const databaseUrl = process.env.DATABASE_URL

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

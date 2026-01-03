import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client instance with proper logging
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Use singleton pattern: reuse existing instance or create new one
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Always store in global to prevent multiple instances
// This works in both development (hot reload) and production (serverless)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

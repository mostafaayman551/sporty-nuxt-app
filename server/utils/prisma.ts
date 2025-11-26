import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/nextjs-best-practices

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined
}

let prisma: PrismaClient

// Prisma 7 requires an adapter when using the client engine type
// Ensure DATABASE_URL is set in your environment variables
const getPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // Create or reuse PostgreSQL connection pool
  if (!global.pgPool) {
    global.pgPool = new Pool({ connectionString })
  }

  const adapter = new PrismaPg(global.pgPool)
  
  const prismaOptions: any = {
    adapter,
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn'],
  }

  return new PrismaClient(prismaOptions)
}

// Initialize PrismaClient with proper configuration
if (process.env.NODE_ENV === 'production') {
  prisma = getPrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = getPrismaClient()
  }
  prisma = global.prisma
}

// Handle graceful shutdown
if (process.env.NODE_ENV !== 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
    await global.pgPool?.end()
  })
}

export { prisma }

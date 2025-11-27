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
  // eslint-disable-next-line no-var
  var prismaConnectionString: string | undefined
}

// Function to completely reset Prisma connection
function resetPrismaConnection() {
  if (global.prisma) {
    try {
      global.prisma.$disconnect().catch(() => {})
    } catch (e) {
      // Ignore
    }
    global.prisma = undefined
  }
  if (global.pgPool) {
    try {
      global.pgPool.end().catch(() => {})
    } catch (e) {
      // Ignore
    }
    global.pgPool = undefined
  }
  global.prismaConnectionString = undefined
}

let prisma: PrismaClient

// Prisma 7 requires an adapter when using the client engine type
// Ensure DATABASE_URL is set in your environment variables
const getPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  // CRITICAL: Check if still using old Supabase URL
  if (connectionString.includes('supabase.co')) {
    const error = `❌ ERROR: Still using old Supabase connection! 
Current DATABASE_URL: ${connectionString.replace(/:([^:@]+)@/, ':****@')}
Please restart your dev server to load the new DATABASE_URL from .env file!`
    console.error(error)
    throw new Error('DATABASE_URL still points to Supabase. Please restart the server!')
  }

  // Convert postgres:// to postgresql:// if needed (Prisma prefers postgresql://)
  const normalizedConnectionString = connectionString.replace(/^postgres:\/\//, 'postgresql://')

  // Check if connection string changed - if so, reset everything
  if (global.prismaConnectionString && global.prismaConnectionString !== normalizedConnectionString) {
    console.log('🔄 DATABASE_URL changed! Resetting connection...')
    console.log('   Old:', global.prismaConnectionString.replace(/:([^:@]+)@/, ':****@'))
    console.log('   New:', normalizedConnectionString.replace(/:([^:@]+)@/, ':****@'))
    resetPrismaConnection()
  }

  // Log connection string for debugging (hide password)
  const maskedUrl = normalizedConnectionString.replace(/:([^:@]+)@/, ':****@')
  if (!global.prismaConnectionString) {
    console.log('🔌 Connecting to database:', maskedUrl)
  }
  global.prismaConnectionString = normalizedConnectionString

  // Create fresh connection pool (always recreate in dev to ensure fresh connection)
  if (global.pgPool) {
    try {
      global.pgPool.end().catch(() => {})
    } catch (e) {
      // Ignore errors when closing
    }
  }
  
  global.pgPool = new Pool({ 
    connectionString: normalizedConnectionString,
    connectionTimeoutMillis: 10000
  })

  const adapter = new PrismaPg(global.pgPool)
  
  const prismaOptions: any = {
    adapter,
    log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'error', 'warn'],
  }

  return new PrismaClient(prismaOptions)
}

// Initialize PrismaClient with proper configuration
// ALWAYS reset in development to pick up new DATABASE_URL
if (process.env.NODE_ENV === 'production') {
  prisma = getPrismaClient()
} else {
  // In development, ALWAYS reset to ensure we get fresh connection
  resetPrismaConnection()
  
  // Create fresh client
  global.prisma = getPrismaClient()
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

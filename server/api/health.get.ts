import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Test Prisma connection
    await prisma.$queryRaw`SELECT 1`
    
    return {
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Database connection error: ${error.message}`
    })
  }
})


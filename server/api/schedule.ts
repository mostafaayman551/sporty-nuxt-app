import { prisma } from '../utils/prisma'
import { getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const method = event.method

  if (method === 'GET') {
    const query = getQuery(event)
    const startDate = query.startDate ? new Date(String(query.startDate)) : undefined
    const endDate = query.endDate ? new Date(String(query.endDate)) : undefined

    return await prisma.scheduleEvent.findMany({
      where: {
        userId: user.id,
        startTime: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { startTime: 'asc' }
    })
  }

  if (method === 'POST') {
    const body = await readBody(event)
    return await prisma.scheduleEvent.create({
      data: {
        ...body,
        userId: user.id,
        startTime: new Date(body.startTime),
        endTime: body.endTime ? new Date(body.endTime) : undefined
      }
    })
  }
})

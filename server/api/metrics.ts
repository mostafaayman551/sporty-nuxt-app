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
    const days = Number(query.days) || 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    return await prisma.activityMetric.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate }
      },
      orderBy: { date: 'desc' }
    })
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const date = new Date(body.date)
    
    // Check if exists
    const existing = await prisma.activityMetric.findFirst({
      where: {
        userId: user.id,
        date: date
      }
    })

    if (existing) {
      return await prisma.activityMetric.update({
        where: { id: existing.id },
        data: body
      })
    } else {
      return await prisma.activityMetric.create({
        data: {
          ...body,
          userId: user.id,
          date: date
        }
      })
    }
  }
})

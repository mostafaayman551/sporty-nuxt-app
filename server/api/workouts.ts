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
    const limit = Number(query.limit) || 50

    return await prisma.workout.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: limit
    })
  }

  if (method === 'POST') {
    const body = await readBody(event)
    return await prisma.workout.create({
      data: {
        ...body,
        userId: user.id,
        date: new Date(body.date)
      }
    })
  }
})

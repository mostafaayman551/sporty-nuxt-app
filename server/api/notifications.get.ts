import { prisma } from '../utils/prisma'
import { getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const limit = Number(query.limit) || 50
  const read = query.read === 'true' ? true : query.read === 'false' ? false : undefined
  const category = query.category as string | undefined

  const where: any = {
    userId: user.id
  }

  if (read !== undefined) {
    where.read = read
  }

  if (category) {
    where.category = category
  }

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit
  })

  const unreadCount = await prisma.notification.count({
    where: {
      userId: user.id,
      read: false
    }
  })

  return {
    notifications,
    unreadCount,
    total: notifications.length
  }
})



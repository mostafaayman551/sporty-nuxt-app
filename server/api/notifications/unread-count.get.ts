import { prisma } from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const count = await prisma.notification.count({
    where: {
      userId: user.id,
      read: false
    }
  })

  return { unreadCount: count }
})


import { prisma } from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const now = new Date()

  const result = await prisma.notification.updateMany({
    where: {
      userId: user.id,
      read: false
    },
    data: {
      read: true,
      readAt: now
    }
  })

  return {
    count: result.count,
    message: `Marked ${result.count} notification${result.count !== 1 ? 's' : ''} as read`
  }
})


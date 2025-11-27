import { prisma } from '../utils/prisma'
import { getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { title, message, type, category, link, userId } = body

  if (!title || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and message are required'
    })
  }

  // If userId is provided and user is admin, create for that user
  // Otherwise, create for current user
  const targetUserId = userId && user.role === 'Admin' ? userId : user.id

  const notification = await prisma.notification.create({
    data: {
      title,
      message,
      type: type || 'info',
      category: category || null,
      link: link || null,
      userId: targetUserId,
      read: false
    }
  })

  return { notification, message: 'Notification created successfully' }
})



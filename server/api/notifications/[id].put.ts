import { prisma } from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Notification ID is required' })
  }

  const body = await readBody(event)
  const { read } = body

  // Verify notification belongs to user
  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId: user.id
    }
  })

  if (!notification) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Notification not found'
    })
  }

  const updateData: any = {}
  if (read !== undefined) {
    updateData.read = read
    if (read) {
      updateData.readAt = new Date()
    } else {
      updateData.readAt = null
    }
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: updateData
  })

  return { notification: updated, message: 'Notification updated successfully' }
})


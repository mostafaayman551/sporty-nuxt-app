import { prisma } from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Member ID is required' })
  }

  // Prevent deleting yourself
  if (id === user.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You cannot delete your own account'
    })
  }

  await prisma.user.delete({
    where: { id }
  })

  return { message: 'Team member deleted successfully' }
})



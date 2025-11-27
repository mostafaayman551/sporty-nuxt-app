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

  const body = await readBody(event)
  const { name, role, company, avatarUrl } = body

  const updateData: any = {}
  if (name !== undefined) updateData.name = name
  if (role !== undefined) updateData.role = role
  if (company !== undefined) updateData.company = company
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl

  const updatedMember = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      company: true,
      avatarUrl: true,
      updatedAt: true
    }
  })

  return { member: updatedMember, message: 'Team member updated successfully' }
})



import { prisma } from '../utils/prisma'
import { getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const limit = Number(query.limit) || 50
  const search = query.search as string | undefined

  // Get all users (in a real app, you'd have team/organization relationships)
  // For now, return all users except the current user
  const where: any = {
    NOT: { id: user.id }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } }
    ]
  }

  const teamMembers = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      company: true,
      avatarUrl: true,
      createdAt: true
    },
    take: limit,
    orderBy: { createdAt: 'desc' }
  })

  return { team: teamMembers, total: teamMembers.length }
})



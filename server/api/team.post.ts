import { prisma } from '../utils/prisma'
import { getUserFromEvent } from '../utils/auth'
import { hashPassword, generateRandomToken } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { email, name, role, company, password } = body

  if (!email || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and name are required'
    })
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User with this email already exists'
    })
  }

  // Generate email verification token
  const emailVerifyToken = generateRandomToken()
  const emailVerifyExpiry = new Date()
  emailVerifyExpiry.setHours(emailVerifyExpiry.getHours() + 24)

  // Create new team member
  const hashedPassword = password ? await hashPassword(password) : ''
  const newMember = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: role || 'Team Member',
      company: company || user.company,
      emailVerified: false,
      emailVerifyToken,
      emailVerifyExpiry
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      company: true,
      avatarUrl: true,
      createdAt: true
    }
  })

  return { member: newMember, message: 'Team member added successfully' }
})



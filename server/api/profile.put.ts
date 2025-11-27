import { prisma } from '../utils/prisma'
import { getUserFromEvent } from '../utils/auth'
import { hashPassword } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { name, email, avatarUrl, company, password, currentPassword } = body

  const updateData: any = {}

  // Update name
  if (name !== undefined) {
    updateData.name = name
  }

  // Update email
  if (email !== undefined && email !== user.email) {
    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email already in use'
      })
    }
    updateData.email = email
    updateData.emailVerified = false // Require re-verification
  }

  // Update avatar
  if (avatarUrl !== undefined) {
    updateData.avatarUrl = avatarUrl
  }

  // Update company
  if (company !== undefined) {
    updateData.company = company
  }

  // Update password (requires current password)
  if (password) {
    if (!currentPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Current password is required to change password'
      })
    }
    if (!user.password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password change not available for OAuth users'
      })
    }
    const { comparePassword } = await import('../utils/auth')
    const isValid = await comparePassword(currentPassword, user.password)
    if (!isValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Current password is incorrect'
      })
    }
    updateData.password = await hashPassword(password)
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      company: true,
      avatarUrl: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return { user: updatedUser }
})



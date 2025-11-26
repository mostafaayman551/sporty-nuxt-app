import { prisma } from '../../utils/prisma'
import { hashPassword, generateToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, password } = body

  if (!token || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token and password are required'
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 6 characters'
    })
  }

  // Find user with valid reset token
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date() // Token not expired
      }
    }
  })

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or expired reset token'
    })
  }

  // Hash new password
  const hashedPassword = await hashPassword(password)

  // Update password and clear reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  })

  // Generate auth token and set cookie
  const authToken = generateToken(user.id)
  setCookie(event, 'auth_token', authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax'
  })

  return {
    message: 'Password reset successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl
    }
  }
})


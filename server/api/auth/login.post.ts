import { prisma } from '../../utils/prisma'
import { comparePassword, generateToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  // Check if user has password (OAuth users might not have one)
  if (!user.password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Please sign in with your OAuth provider'
    })
  }

  // Verify password
  const isValid = await comparePassword(password, user.password)

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  // Check if email is verified (only for email/password users)
  if (!user.emailVerified) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Please verify your email address before logging in. Check your inbox for the confirmation link.'
    })
  }

  // Generate token
  const token = generateToken(user.id)

  // Set cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax'
  })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl
    }
  }
})

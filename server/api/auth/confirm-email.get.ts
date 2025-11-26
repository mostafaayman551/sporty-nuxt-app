import { prisma } from '../../utils/prisma'
import { generateToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { token } = query

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Verification token is required'
    })
  }

  // Find user with this token
  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: token as string,
      emailVerifyExpiry: {
        gt: new Date() // Token not expired
      }
    }
  })

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or expired verification token'
    })
  }

  // Verify email and clear token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifyToken: null,
      emailVerifyExpiry: null
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

  // Redirect to login with success message
  return sendRedirect(event, '/auth/login?verified=true')
})


import { prisma } from '../../utils/prisma'
import { generateRandomToken } from '../../utils/auth'
import { sendPasswordResetEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email } = body

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email is required'
    })
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  })

  // Don't reveal if user exists or not (security best practice)
  if (!user) {
    // Still return success to prevent email enumeration
    return {
      message: 'If an account exists with this email, a password reset link has been sent.'
    }
  }

  // Generate reset token
  const resetToken = generateRandomToken()
  const resetTokenExpiry = new Date()
  resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1) // 1 hour

  // Save reset token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetTokenExpiry
    }
  })

  // Send reset email
  try {
    await sendPasswordResetEmail(user.email, user.name || 'User', resetToken)
  } catch (error) {
    console.error('Failed to send reset email:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send reset email'
    })
  }

  return {
    message: 'If an account exists with this email, a password reset link has been sent.'
  }
})


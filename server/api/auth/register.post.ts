import { prisma } from '../../utils/prisma'
import { hashPassword, generateRandomToken } from '../../utils/auth'
import { sendConfirmationEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, fullName } = body

  if (!email || !password || !fullName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User already exists'
    })
  }

  // Generate email verification token
  const emailVerifyToken = generateRandomToken()
  const emailVerifyExpiry = new Date()
  emailVerifyExpiry.setHours(emailVerifyExpiry.getHours() + 24) // 24 hours

  // Create user (not verified yet)
  const hashedPassword = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: fullName,
      emailVerified: false,
      emailVerifyToken,
      emailVerifyExpiry
    }
  })

  // Send confirmation email
  try {
    await sendConfirmationEmail(user.email, user.name || 'User', emailVerifyToken)
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    // Don't fail registration if email fails
  }

  return {
    message: 'Registration successful! Please check your email to confirm your account.',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified
    }
  }
})

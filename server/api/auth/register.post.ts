import { registerUser } from '../../controllers/auth.controller'
import { sendConfirmationEmail } from '../../utils/email'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = await registerUser(event, body)
  
  // Send confirmation email (non-blocking)
  try {
    const user = await prisma.user.findUnique({
      where: { email: body.email },
      select: { emailVerifyToken: true, name: true, email: true }
    })
    if (user?.emailVerifyToken) {
      await sendConfirmationEmail(user.email, user.name || 'User', user.emailVerifyToken)
    }
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    // Don't fail registration if email fails
  }
  
  return result
})

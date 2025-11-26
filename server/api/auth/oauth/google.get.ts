import { prisma } from '../../../utils/prisma'
import { generateToken } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { code, state } = query

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Authorization code is required'
    })
  }

  try {
    const config = useRuntimeConfig()
    
    // Exchange code for access token with Google
    const tokenResponse = await $fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: {
        code,
        client_id: config.public.googleClientId,
        client_secret: config.googleClientSecret,
        redirect_uri: `${config.public.baseUrl || 'http://localhost:3000'}/api/auth/oauth/google`,
        grant_type: 'authorization_code'
      }
    })

    // Get user info from Google
    const userInfo = await $fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      }
    })

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: userInfo.email }
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name,
          avatarUrl: userInfo.picture,
          password: '', // OAuth users don't need password
          role: 'Business Leader'
        }
      })
    } else {
      // Update user info
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: userInfo.name || user.name,
          avatarUrl: userInfo.picture || user.avatarUrl
        }
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

    // Redirect to home or return URL
    const redirectUrl = state ? decodeURIComponent(state as string) : '/'
    return sendRedirect(event, redirectUrl)
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `OAuth error: ${error.message}`
    })
  }
})


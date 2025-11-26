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
    
    // Exchange code for access token with GitHub
    const tokenResponse = await $fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: {
        code,
        client_id: config.public.githubClientId,
        client_secret: config.githubClientSecret,
        redirect_uri: `${config.public.baseUrl || 'http://localhost:3000'}/api/auth/oauth/github`
      }
    })

    // Get user info from GitHub
    const userInfo = await $fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      }
    })

    // Get user email (might need to fetch from emails endpoint)
    let email = userInfo.email
    if (!email) {
      const emails = await $fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`
        }
      })
      const primaryEmail = emails.find((e: any) => e.primary)
      email = primaryEmail?.email || emails[0]?.email
    }

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Unable to retrieve email from GitHub'
      })
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          name: userInfo.name || userInfo.login,
          avatarUrl: userInfo.avatar_url,
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
          avatarUrl: userInfo.avatar_url || user.avatarUrl
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


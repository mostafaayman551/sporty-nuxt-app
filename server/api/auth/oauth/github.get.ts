import { findOrCreateOAuthUser, setAuthCookie, getOAuthRedirectUrl } from '../../../controllers/oauth.controller'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { code, state, error } = query

  // Handle OAuth errors from GitHub
  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `OAuth error: ${error}`
    })
  }

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Authorization code is required'
    })
  }

  try {
    const config = useRuntimeConfig()
    const redirectUri = `${config.public.baseUrl || 'http://localhost:3000'}/api/auth/oauth/github`
    
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
        redirect_uri: redirectUri
      }
    })

    // Get user info from GitHub
    const userInfo = await $fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${(tokenResponse as any).access_token}`
      }
    })

    // Get user email (might need to fetch from emails endpoint)
    let email = (userInfo as any).email
    if (!email) {
      const emails = await $fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${(tokenResponse as any).access_token}`
        }
      })
      const emailList = emails as any[]
      const primaryEmail = emailList.find((e: any) => e.primary)
      email = primaryEmail?.email || emailList[0]?.email
    }

    if (!email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Unable to retrieve email from GitHub'
      })
    }

    // Find or create user using controller
    const user = await findOrCreateOAuthUser({
      email,
      name: (userInfo as any).name || (userInfo as any).login,
      avatar_url: (userInfo as any).avatar_url
    })

    // Set authentication cookie
    setAuthCookie(event, user.id)

    // Get redirect URL and redirect to home page
    const redirectUrl = getOAuthRedirectUrl(state as string | undefined)
    return sendRedirect(event, redirectUrl, 303)
    
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `OAuth error: ${error.message}`
    })
  }
})

import { findOrCreateOAuthUser, setAuthCookie, getOAuthRedirectUrl } from '../../../controllers/oauth.controller'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { code, state, error } = query

  // Handle OAuth errors from Google
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
    const redirectUri = `${config.public.baseUrl || 'http://localhost:3000'}/api/auth/oauth/google`
    
    // Exchange code for access token with Google
    const params = new URLSearchParams()
    params.append('code', code as string)
    params.append('client_id', config.public.googleClientId)
    params.append('client_secret', config.googleClientSecret)
    params.append('redirect_uri', redirectUri)
    params.append('grant_type', 'authorization_code')
    
    // Use native fetch with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    let tokenResponse: any
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString(),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        const errorMsg = errorData.error_description || errorData.error || `HTTP ${response.status}`
        throw new Error(`Google OAuth error: ${errorMsg}`)
      }
      
      tokenResponse = await response.json()
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Google OAuth request timed out')
      }
      
      if (fetchError.message.includes('fetch failed') || fetchError.message.includes('ENOTFOUND') || fetchError.message.includes('ECONNREFUSED')) {
        throw new Error(`Network error: ${fetchError.message}. Check your internet connection and that redirect_uri matches in Google Cloud Console: ${redirectUri}`)
      }
      
      throw fetchError
    }

    // Get user info from Google
    const userInfo = await $fetch<{
      email: string
      name: string
      picture: string
    }>('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      }
    })

    // Find or create user using controller
    const user = await findOrCreateOAuthUser({
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture
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

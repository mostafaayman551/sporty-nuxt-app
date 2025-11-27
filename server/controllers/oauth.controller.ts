import { prisma } from '../utils/prisma'
import { generateToken } from '../utils/auth'
import type { H3Event } from 'h3'

export interface OAuthUserInfo {
  email: string
  name: string
  picture?: string
  avatar_url?: string
}

/**
 * Find or create user from OAuth provider
 */
export async function findOrCreateOAuthUser(userInfo: OAuthUserInfo) {
  const email = userInfo.email
  const name = userInfo.name
  const avatarUrl = userInfo.picture || userInfo.avatar_url

  // Find existing user
  let user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    // Create new user
    user = await prisma.user.create({
      data: {
        email,
        name,
        avatarUrl,
        password: '',
        role: 'Business Leader',
        emailVerified: true
      }
    })
  } else {
    // Update user info
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        avatarUrl: avatarUrl || user.avatarUrl,
        emailVerified: true
      }
    })
  }

  return user
}

/**
 * Set authentication cookie and return user data
 */
export function setAuthCookie(event: H3Event, userId: string) {
  const token = generateToken(userId)
  
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    sameSite: 'lax'
  })

  return token
}

/**
 * Get redirect URL after OAuth login
 */
export function getOAuthRedirectUrl(state: string | undefined): string {
  let redirectUrl = '/'
  
  if (state) {
    try {
      const decodedState = decodeURIComponent(state)
      // Don't redirect to OAuth callback URLs or login page
      if (decodedState && 
          !decodedState.includes('/api/auth/oauth') && 
          !decodedState.includes('/auth/login') &&
          decodedState.startsWith('/')) {
        redirectUrl = decodedState
      }
    } catch (e) {
      // If state decoding fails, use home page
      redirectUrl = '/'
    }
  }
  
  // Add query parameter to trigger auth re-initialization
  const separator = redirectUrl.includes('?') ? '&' : '?'
  return `${redirectUrl}${separator}oauth=success`
}


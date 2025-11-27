import { prisma } from '../utils/prisma'
import { hashPassword, comparePassword, generateToken, generateRandomToken } from '../utils/auth'
import type { H3Event } from 'h3'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    name: string | null
    role: string
    avatarUrl: string | null
  }
  token: string
}

/**
 * Login user with email and password
 */
export async function loginUser(event: H3Event, credentials: LoginCredentials): Promise<AuthResponse> {
  const { email, password } = credentials

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
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

  // Check if email is verified
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
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl
    },
    token
  }
}

/**
 * Register new user
 */
export async function registerUser(event: H3Event, data: RegisterData): Promise<{ message: string; user: { id: string; email: string; name: string | null; emailVerified: boolean } }> {
  const { email, password, fullName } = data

  if (!email || !password || !fullName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email, password, and full name are required'
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

  // Hash password
  const hashedPassword = await hashPassword(password)

  // Create user
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

  return {
    message: 'Registration successful! Please check your email to confirm your account.',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified
    }
  }
}

/**
 * Logout user
 */
export async function logoutUser(event: H3Event): Promise<{ message: string }> {
  // Clear cookie
  setCookie(event, 'auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
    sameSite: 'lax'
  })

  return { message: 'Logged out successfully' }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(event: H3Event) {
  const token = getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const { verifyToken } = await import('../utils/auth')
  const payload = verifyToken(token)
  
  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true
    }
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found'
    })
  }

  return { user }
}



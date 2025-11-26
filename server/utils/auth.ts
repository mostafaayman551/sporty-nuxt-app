import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const SALT_ROUNDS = 10
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}

export const getUserFromEvent = async (event: any) => {
  const token = getCookie(event, 'auth_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')
  
  if (!token) return null
  
  const payload = verifyToken(token)
  if (!payload) return null
  
  return await prisma.user.findUnique({
    where: { id: payload.userId }
  })
}

export const generateRandomToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}
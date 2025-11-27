import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { prisma } from './prisma'

const SALT_ROUNDS = 10
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || ''

// Extract public key from private key for verification
const getPublicKey = (privateKey: string): string => {
  try {
    const keyObject = crypto.createPrivateKey(privateKey)
    return crypto.createPublicKey(keyObject).export({ type: 'spki', format: 'pem' }) as string
  } catch (error) {
    throw new Error('Invalid JWT_PRIVATE_KEY format')
  }
}

const JWT_PUBLIC_KEY = JWT_PRIVATE_KEY ? getPublicKey(JWT_PRIVATE_KEY) : ''

if (!JWT_PRIVATE_KEY) {
  console.warn('⚠️  JWT_PRIVATE_KEY is not set. JWT authentication will not work properly.')
}

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}

export const generateToken = (userId: string) => {
  if (!JWT_PRIVATE_KEY) {
    throw new Error('JWT_PRIVATE_KEY is not configured')
  }
  return jwt.sign({ userId }, JWT_PRIVATE_KEY, { 
    algorithm: 'RS256',
    expiresIn: '7d' 
  })
}

export const verifyToken = (token: string) => {
  try {
    if (!JWT_PUBLIC_KEY) {
      return null
    }
    const decoded = jwt.verify(token, JWT_PUBLIC_KEY, { algorithms: ['RS256'] })
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      return decoded as { userId: string }
    }
    return null
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
  // Use crypto.randomBytes (same as jsonwebtoken uses internally) for secure token generation
  return crypto.randomBytes(length).toString('hex')
}
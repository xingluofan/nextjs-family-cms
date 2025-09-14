import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
  userId: number
  username: string
}

/**
 * 验证JWT token
 * @param token JWT token
 * @returns 解码后的用户信息或null
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * 从请求中获取认证用户信息
 * @param request NextRequest对象
 * @returns 用户信息或null
 */
export function getAuthUser(request: NextRequest): AuthUser | null {
  // 首先尝试从cookie中获取token
  const cookieToken = request.cookies.get('auth-token')?.value
  if (cookieToken) {
    const user = verifyToken(cookieToken)
    if (user) return user
  }

  // 然后尝试从Authorization header中获取token
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const headerToken = authHeader.substring(7)
    const user = verifyToken(headerToken)
    if (user) return user
  }

  return null
}

/**
 * 检查用户是否已认证
 * @param request NextRequest对象
 * @returns 是否已认证
 */
export function isAuthenticated(request: NextRequest): boolean {
  return getAuthUser(request) !== null
}
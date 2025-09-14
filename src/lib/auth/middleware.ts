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
    console.log('[DEBUG] 验证Token:', {
      tokenLength: token?.length,
      jwtSecret: JWT_SECRET?.substring(0, 10) + '...',
      nodeEnv: process.env.NODE_ENV
    })
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    console.log('[DEBUG] Token验证成功:', { userId: decoded.userId, username: decoded.username })
    return decoded
  } catch (error) {
    console.log('[DEBUG] Token验证失败:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      tokenPreview: token?.substring(0, 20) + '...'
    })
    return null
  }
}

/**
 * 从请求中获取认证用户信息
 * @param request NextRequest对象
 * @returns 用户信息或null
 */
export function getAuthUser(request: NextRequest): AuthUser | null {
  console.log('[DEBUG] 获取认证用户信息:', {
    url: request.url,
    method: request.method,
    userAgent: request.headers.get('user-agent')?.substring(0, 50)
  })
  
  // 首先尝试从cookie中获取token
  const cookieToken = request.cookies.get('auth-token')?.value
  console.log('[DEBUG] Cookie Token:', {
    exists: !!cookieToken,
    length: cookieToken?.length,
    preview: cookieToken?.substring(0, 20) + '...'
  })
  
  if (cookieToken) {
    const user = verifyToken(cookieToken)
    if (user) {
      console.log('[DEBUG] Cookie认证成功')
      return user
    }
  }

  // 然后尝试从Authorization header中获取token
  const authHeader = request.headers.get('authorization')
  console.log('[DEBUG] Authorization Header:', {
    exists: !!authHeader,
    preview: authHeader?.substring(0, 30) + '...'
  })
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const headerToken = authHeader.substring(7)
    const user = verifyToken(headerToken)
    if (user) {
      console.log('[DEBUG] Header认证成功')
      return user
    }
  }

  console.log('[DEBUG] 认证失败，未找到有效token')
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
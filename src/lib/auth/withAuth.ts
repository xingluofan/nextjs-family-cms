import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, AuthUser } from './middleware'

/**
 * 认证装饰器，用于保护API路由
 * @param handler API处理函数
 * @returns 包装后的处理函数
 */
export function withAuth<T extends unknown[]>(
  handler: (request: NextRequest, user: AuthUser, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    // 检查用户认证
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '未授权访问，请先登录',
        },
        { status: 401 }
      )
    }

    // 调用原始处理函数，传入用户信息
    return handler(request, user, ...args)
  }
}

/**
 * 简化版认证装饰器，用于不需要用户信息的API
 * @param handler API处理函数
 * @returns 包装后的处理函数
 */
export function requireAuth<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    // 检查用户认证
    const user = getAuthUser(request)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '未授权访问，请先登录',
        },
        { status: 401 }
      )
    }

    // 调用原始处理函数
    return handler(request, ...args)
  }
}
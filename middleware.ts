import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticated } from '@/lib/auth/middleware'

// 需要认证的路由路径
const protectedPaths = [
  '/users',
  '/menu',
  '/finance',
  '/api/users',
  '/api/recipes',
]

// 不需要认证的路径（即使在保护路径下）
const publicPaths = [
  '/api/auth/login',
  '/api/auth/logout',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查是否是公开路径
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 检查是否是需要保护的路径
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtectedPath) {
    // 检查用户是否已认证
    if (!isAuthenticated(request)) {
      // 如果是API路由，返回401错误
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          {
            success: false,
            error: '未授权访问，请先登录',
          },
          { status: 401 }
        )
      }
      
      // 如果是页面路由，重定向到登录页面
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
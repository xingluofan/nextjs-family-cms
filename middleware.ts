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
  
  // 只在开发环境输出调试日志
  if (process.env.NODE_ENV === 'development') {
    console.log('🛡️ [中间件] 请求拦截:', {
      pathname,
      method: request.method,
      userAgent: request.headers.get('user-agent')?.substring(0, 50),
      timestamp: new Date().toISOString()
    })
  }

  // 检查是否是公开路径
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  if (isPublicPath) {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ [中间件] 公开路径，允许访问:', pathname)
    }
    return NextResponse.next()
  }

  // 检查是否是需要保护的路径
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 [中间件] 路径检查结果:', {
      pathname,
      isProtectedPath,
      protectedPaths,
      publicPaths
    })
  }
  
  if (isProtectedPath) {
    // 检查用户是否已认证
    const authResult = isAuthenticated(request)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 [中间件] 认证检查结果:', {
        pathname,
        isAuthenticated: authResult,
        cookies: request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
        authHeader: !!request.headers.get('authorization')
      })
    }
    
    if (!authResult) {
      // 如果是API路由，返回401错误
      if (pathname.startsWith('/api/')) {
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ [中间件] API路由未认证，返回401:', pathname)
        }
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
      
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 [中间件] 页面路由未认证，重定向到登录:', {
          from: pathname,
          to: loginUrl.toString()
        })
      }
      return NextResponse.redirect(loginUrl)
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ [中间件] 认证通过，允许访问:', pathname)
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.log('ℹ️ [中间件] 非保护路径，直接通过:', pathname)
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
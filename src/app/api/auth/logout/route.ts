import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: '登出成功',
    })

    // 清除认证cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 改为lax以支持跨页面导航
      maxAge: 0, // 立即过期
      path: '/',
      // 在生产环境中不设置domain，让浏览器自动处理
    })

    return response
  } catch (error) {
    console.error('登出失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '登出失败，请稍后重试',
      },
      { status: 500 }
    )
  }
}
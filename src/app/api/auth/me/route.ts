import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth/middleware'
import { getUserById } from '@/lib/users/service'

export async function GET(request: NextRequest) {
  try {
    // 获取认证用户信息
    const authUser = getAuthUser(request)
    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          error: '未授权访问',
        },
        { status: 401 }
      )
    }

    // 获取完整的用户信息
    const user = await getUserById(authUser.userId)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '用户不存在',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
        },
      },
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取用户信息失败，请稍后重试',
      },
      { status: 500 }
    )
  }
}
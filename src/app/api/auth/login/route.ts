import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/users/auth'
import { getUserByUsernameWithPassword } from '@/lib/users/service'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: '用户名和密码不能为空',
        },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await getUserByUsernameWithPassword(username)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '用户名或密码错误',
        },
        { status: 401 }
      )
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: '用户名或密码错误',
        },
        { status: 401 }
      )
    }

    // 生成JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 返回成功响应
    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
        },
        token,
      },
    })

    // 设置HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7天
      path: '/',
    })

    return response
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '登录失败，请稍后重试',
      },
      { status: 500 }
    )
  }
}
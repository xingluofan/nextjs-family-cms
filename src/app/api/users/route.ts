import { NextRequest, NextResponse } from 'next/server'
import { createUser, getAllUsers, isUsernameExists, isEmailExists } from '@/lib/users/service'
import { validateUsername, validatePassword, validateEmail } from '@/lib/users/auth'
import { requireAuth } from '@/lib/auth/withAuth'

/**
 * GET /api/users - 获取所有用户
 */
async function getUsers() {
  try {
    const users = await getAllUsers()
    return NextResponse.json({
      success: true,
      data: users,
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取用户列表失败',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/users - 创建新用户
 */
async function createUserHandler(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, email, name } = body

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

    // 验证用户名格式
    if (!validateUsername(username)) {
      return NextResponse.json(
        {
          success: false,
          error: '用户名格式不正确，只能包含字母、数字、下划线，长度3-20位',
        },
        { status: 400 }
      )
    }

    // 验证密码格式
    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          success: false,
          error: '密码长度至少6位',
        },
        { status: 400 }
      )
    }

    // 验证邮箱格式（如果提供）
    if (email && !validateEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: '邮箱格式不正确',
        },
        { status: 400 }
      )
    }

    // 检查用户名是否已存在
    if (await isUsernameExists(username)) {
      return NextResponse.json(
        {
          success: false,
          error: '用户名已存在',
        },
        { status: 409 }
      )
    }

    // 检查邮箱是否已存在（如果提供）
    if (email && await isEmailExists(email)) {
      return NextResponse.json(
        {
          success: false,
          error: '邮箱已存在',
        },
        { status: 409 }
      )
    }

    // 创建用户
    const user = await createUser({
      username,
      password,
      email: email || undefined,
      name: name || undefined,
    })

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: '用户创建成功',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('创建用户失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '创建用户失败',
      },
      { status: 500 }
    )
  }
}

// 导出认证保护的API函数
export const GET = requireAuth(getUsers)
export const POST = requireAuth(createUserHandler)
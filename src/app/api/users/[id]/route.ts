import { NextRequest, NextResponse } from 'next/server'
import { getUserById, updateUser, deleteUser, isUsernameExists, isEmailExists } from '@/lib/users/service'
import { validateUsername, validatePassword, validateEmail } from '@/lib/users/auth'
import { requireAuth } from '@/lib/auth/withAuth'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/users/[id] - 获取单个用户
 */
async function getUserHandler(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: '用户ID格式不正确',
        },
        { status: 400 }
      )
    }

    const user = await getUserById(userId)
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
      data: user,
    })
  } catch (error) {
    console.error('获取用户失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取用户失败',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/users/[id] - 更新用户
 */
async function updateUserHandler(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: '用户ID格式不正确',
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { username, password, email, name } = body

    // 检查用户是否存在
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: '用户不存在',
        },
        { status: 404 }
      )
    }

    // 验证用户名格式（如果提供）
    if (username && !validateUsername(username)) {
      return NextResponse.json(
        {
          success: false,
          error: '用户名格式不正确，只能包含字母、数字、下划线，长度3-20位',
        },
        { status: 400 }
      )
    }

    // 验证密码格式（如果提供）
    if (password && !validatePassword(password)) {
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

    // 检查用户名是否已被其他用户使用
    if (username && username !== existingUser.username) {
      if (await isUsernameExists(username)) {
        return NextResponse.json(
          {
            success: false,
            error: '用户名已存在',
          },
          { status: 409 }
        )
      }
    }

    // 检查邮箱是否已被其他用户使用
    if (email && email !== existingUser.email) {
      if (await isEmailExists(email)) {
        return NextResponse.json(
          {
            success: false,
            error: '邮箱已存在',
          },
          { status: 409 }
        )
      }
    }

    // 更新用户
    const updatedUser = await updateUser(userId, {
      username,
      password,
      email,
      name,
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: '用户更新成功',
    })
  } catch (error) {
    console.error('更新用户失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '更新用户失败',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/users/[id] - 删除用户
 */
async function deleteUserHandler(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const userId = parseInt(id)

    if (isNaN(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: '用户ID格式不正确',
        },
        { status: 400 }
      )
    }

    // 检查用户是否存在
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: '用户不存在',
        },
        { status: 404 }
      )
    }

    // 删除用户
    await deleteUser(userId)

    return NextResponse.json({
      success: true,
      message: '用户删除成功',
    })
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '删除用户失败',
      },
      { status: 500 }
    )
  }
}

// 导出认证保护的API函数
export const GET = requireAuth(getUserHandler)
export const PUT = requireAuth(updateUserHandler)
export const DELETE = requireAuth(deleteUserHandler)
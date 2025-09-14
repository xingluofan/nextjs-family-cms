# 生产环境问题修复指南

## 问题诊断结果

基于代码分析，发现以下潜在问题：

### 1. 调试代码在生产环境的影响

**问题**: 当前代码中包含大量 `console.log` 调试语句，这些在生产环境中可能：
- 影响性能
- 暴露敏感信息（JWT_SECRET 预览）
- 干扰正常的日志记录

**位置**:
- `/src/lib/auth/middleware.ts` - 认证中间件调试日志
- `/src/app/api/auth/login/route.ts` - 登录API调试日志
- `/src/app/api/auth/me/route.ts` - 认证状态检查调试日志

### 2. 调试接口暴露

**问题**: `/src/app/api/debug/env/route.ts` 调试接口在生产环境可访问，虽然有环境检查，但仍存在安全风险。

### 3. JWT_SECRET 回退值

**问题**: 代码中使用了回退值 `'your-secret-key'`，如果生产环境变量未设置，会使用不安全的默认值。

## 立即修复方案

### 步骤 1: 移除调试代码

1. **移除认证中间件调试日志**
2. **移除登录API调试日志**
3. **移除认证状态检查调试日志**
4. **删除调试接口**

### 步骤 2: 加强环境变量检查

1. **添加环境变量验证**
2. **在生产环境强制要求 JWT_SECRET**

### 步骤 3: 优化错误处理

1. **改进生产环境错误信息**
2. **添加适当的日志记录（非调试）**

## 修复实施

### 1. 清理认证中间件

```typescript
// src/lib/auth/middleware.ts - 清理版本
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

export interface AuthUser {
  userId: number
  username: string
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    return null
  }
}

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

export function isAuthenticated(request: NextRequest): boolean {
  return getAuthUser(request) !== null
}
```

### 2. 清理登录API

```typescript
// src/app/api/auth/login/route.ts - 清理版本
import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/users/auth'
import { getUserByUsernameWithPassword } from '@/lib/users/service'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

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
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60, // 7天
      path: '/',
    }
    
    response.cookies.set('auth-token', token, cookieOptions)

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        error: '登录失败，请稍后重试',
      },
      { status: 500 }
    )
  }
}
```

### 3. 清理认证状态检查API

```typescript
// src/app/api/auth/me/route.ts - 清理版本
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  const user = getAuthUser(request)
  
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: '未授权访问',
      },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      user: {
        userId: user.userId,
        username: user.username,
      },
    },
  })
}
```

## 部署步骤

1. **应用修复**
   ```bash
   # 应用所有清理修改
   git add .
   git commit -m "fix: remove debug code and improve production security"
   git push
   ```

2. **验证环境变量**
   - 在 Vercel Dashboard 确认 `JWT_SECRET` 已设置
   - 确认所有数据库连接变量已设置

3. **清除缓存**
   - 在浏览器清除所有 Cookie 和本地存储
   - 硬刷新页面

4. **测试功能**
   - 测试登录功能
   - 测试页面跳转
   - 验证认证状态

## 预防措施

1. **环境变量检查**
   - 在应用启动时验证必要的环境变量
   - 使用类型安全的环境变量配置

2. **调试代码管理**
   - 使用条件编译或环境变量控制调试输出
   - 在生产构建中自动移除调试代码

3. **安全最佳实践**
   - 定期轮换 JWT_SECRET
   - 监控异常登录活动
   - 实施适当的速率限制
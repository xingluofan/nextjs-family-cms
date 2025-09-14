import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/prisma'

/**
 * GET /api/check-db - 检查数据库连接
 */
export async function GET() {
  try {
    // 尝试连接数据库并执行简单查询
    await prisma.$queryRaw`SELECT 1`
    
    // 获取用户表的记录数
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      message: '数据库连接正常',
      data: {
        userCount,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('数据库连接失败:', error)
    }
    return NextResponse.json(
      {
        success: false,
        error: '数据库连接失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}
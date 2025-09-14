import { NextResponse } from 'next/server'

/**
 * GET /api/debug/env - 检查环境变量配置（仅开发环境）
 */
export async function GET() {
  // 仅在开发环境中提供此接口
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        success: false,
        error: '此接口仅在开发环境中可用',
      },
      { status: 403 }
    )
  }

  try {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      JWT_SECRET_EXISTS: !!process.env.JWT_SECRET,
      JWT_SECRET_LENGTH: process.env.JWT_SECRET?.length,
      JWT_SECRET_PREVIEW: process.env.JWT_SECRET?.substring(0, 10) + '...',
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      PRISMA_DATABASE_URL_EXISTS: !!process.env.PRISMA_DATABASE_URL,
      POSTGRES_URL_EXISTS: !!process.env.POSTGRES_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL,
    }

    return NextResponse.json({
      success: true,
      data: envInfo,
      message: '环境变量检查完成',
    })
  } catch (error) {
    console.error('环境变量检查失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '环境变量检查失败',
        details: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    )
  }
}
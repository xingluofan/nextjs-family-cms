import { NextResponse } from 'next/server';
import { RecipeService } from '@/lib/services/recipeService';
import { requireAuth } from '@/lib/auth/withAuth';

// GET /api/recipes/stats - 获取菜品统计信息
async function getRecipeStats() {
  try {
    const stats = await RecipeService.getRecipeStats();
    
    return NextResponse.json({
      success: true,
      data: stats,
      message: '获取菜品统计成功',
    });
  } catch (error) {
    console.error('获取菜品统计失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取菜品统计失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

// 导出认证保护的API函数
export const GET = requireAuth(getRecipeStats);
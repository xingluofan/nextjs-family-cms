import { NextResponse } from 'next/server';
import { RecipeService } from '@/lib/services/recipeService';
import { requireAuth } from '@/lib/auth/withAuth';

// GET /api/recipes/categories - 获取所有品类标签
async function getRecipeCategories() {
  try {
    const categories = await RecipeService.getAllCategories();
    
    return NextResponse.json({
      success: true,
      data: categories,
      message: '获取品类标签成功',
    });
  } catch (error) {
    console.error('获取品类标签失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取品类标签失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

// 导出认证保护的API函数
export const GET = requireAuth(getRecipeCategories);
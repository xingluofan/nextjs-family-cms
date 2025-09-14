import { NextRequest, NextResponse } from 'next/server';
import { RecipeService } from '@/lib/services/recipeService';

// GET /api/recipes/categories - 获取所有品类标签
export async function GET(request: NextRequest) {
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
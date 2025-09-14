import { NextRequest, NextResponse } from 'next/server';
import { RecipeService, CreateRecipeData } from '@/lib/services/recipeService';
import { requireAuth } from '@/lib/auth/withAuth';

// GET /api/recipes - 获取菜品列表（支持筛选）
async function getRecipes(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 解析查询参数
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const difficulty = searchParams.get('difficulty') || undefined;
    const cookTimeMax = searchParams.get('cookTimeMax') ? parseInt(searchParams.get('cookTimeMax')!) : undefined;
    const search = searchParams.get('search') || undefined;
    
    const filters = {
      categories: categories.length > 0 ? categories : undefined,
      difficulty,
      cookTimeMax,
      search,
    };
    
    const recipes = await RecipeService.getRecipes(filters);
    
    return NextResponse.json({
      success: true,
      data: recipes,
      message: '获取菜品列表成功',
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('获取菜品列表失败:', error);
    }
    return NextResponse.json(
      {
        success: false,
        message: '获取菜品列表失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

// POST /api/recipes - 创建新菜品
async function createRecipe(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必填字段
    if (!body.title || !body.ingredients || !body.steps || !body.createdBy) {
      return NextResponse.json(
        {
          success: false,
          message: '缺少必填字段：title, ingredients, steps, createdBy',
        },
        { status: 400 }
      );
    }
    
    // 验证数组字段
    if (!Array.isArray(body.ingredients) || !Array.isArray(body.steps)) {
      return NextResponse.json(
        {
          success: false,
          message: 'ingredients 和 steps 必须是数组',
        },
        { status: 400 }
      );
    }
    
    if (!Array.isArray(body.categories)) {
      body.categories = [];
    }
    
    const recipeData: CreateRecipeData = {
      title: body.title,
      description: body.description,
      ingredients: body.ingredients,
      steps: body.steps,
      cookTime: body.cookTime,
      difficulty: body.difficulty,
      categories: body.categories,
      servings: body.servings,
      createdBy: parseInt(body.createdBy),
    };
    
    const recipe = await RecipeService.createRecipe(recipeData);
    
    return NextResponse.json(
      {
        success: true,
        data: recipe,
        message: '创建菜品成功',
      },
      { status: 201 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('创建菜品失败:', error);
    }
    return NextResponse.json(
      {
        success: false,
        message: '创建菜品失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

// 导出认证保护的API函数
export const GET = requireAuth(getRecipes);
export const POST = requireAuth(createRecipe);
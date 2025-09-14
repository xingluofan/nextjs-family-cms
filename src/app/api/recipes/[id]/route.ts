import { NextRequest, NextResponse } from 'next/server';
import { RecipeService, UpdateRecipeData } from '@/lib/services/recipeService';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/recipes/[id] - 获取单个菜品详情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: '无效的菜品ID',
        },
        { status: 400 }
      );
    }
    
    const recipe = await RecipeService.getRecipeById(id);
    
    if (!recipe) {
      return NextResponse.json(
        {
          success: false,
          message: '菜品不存在',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: recipe,
      message: '获取菜品详情成功',
    });
  } catch (error) {
    console.error('获取菜品详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取菜品详情失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

// PUT /api/recipes/[id] - 更新菜品
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: '无效的菜品ID',
        },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // 验证数组字段（如果提供）
    if (body.ingredients && !Array.isArray(body.ingredients)) {
      return NextResponse.json(
        {
          success: false,
          message: 'ingredients 必须是数组',
        },
        { status: 400 }
      );
    }
    
    if (body.steps && !Array.isArray(body.steps)) {
      return NextResponse.json(
        {
          success: false,
          message: 'steps 必须是数组',
        },
        { status: 400 }
      );
    }
    
    if (body.categories && !Array.isArray(body.categories)) {
      return NextResponse.json(
        {
          success: false,
          message: 'categories 必须是数组',
        },
        { status: 400 }
      );
    }
    
    const updateData: UpdateRecipeData = {
      title: body.title,
      description: body.description,
      ingredients: body.ingredients,
      steps: body.steps,
      cookTime: body.cookTime,
      difficulty: body.difficulty,
      categories: body.categories,
      servings: body.servings,
    };
    
    // 移除undefined字段
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateRecipeData] === undefined) {
        delete updateData[key as keyof UpdateRecipeData];
      }
    });
    
    const recipe = await RecipeService.updateRecipe(id, updateData);
    
    return NextResponse.json({
      success: true,
      data: recipe,
      message: '更新菜品成功',
    });
  } catch (error) {
    console.error('更新菜品失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '更新菜品失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/recipes/[id] - 删除菜品
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: '无效的菜品ID',
        },
        { status: 400 }
      );
    }
    
    // 检查菜品是否存在
    const existingRecipe = await RecipeService.getRecipeById(id);
    if (!existingRecipe) {
      return NextResponse.json(
        {
          success: false,
          message: '菜品不存在',
        },
        { status: 404 }
      );
    }
    
    await RecipeService.deleteRecipe(id);
    
    return NextResponse.json({
      success: true,
      message: '删除菜品成功',
    });
  } catch (error) {
    console.error('删除菜品失败:', error);
    return NextResponse.json(
      {
        success: false,
        message: '删除菜品失败',
        error: error instanceof Error ? error.message : '未知错误',
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { MenuItem } from '@/lib/types/menu';
import { getAllMenuItems, createMenuItem } from '@/lib/db/menu';
import { initializeDatabase, checkDatabaseConnection, db } from '@/lib/db';

export async function GET() {
  try {
    const menuItems = await getAllMenuItems();
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    
    // 如果是数据库表不存在错误，尝试初始化数据库
    if (error instanceof Error && (error.message.includes('relation') || error.message.includes('table'))) {
      try {
        console.log('Database table error detected, initializing database...');
        await initializeDatabase();
        
        // 重试请求
        const menuItems = await getAllMenuItems();
        return NextResponse.json(menuItems);
      } catch (retryError) {
        console.error('Error after database initialization:', retryError);
        return NextResponse.json(
          { 
            error: 'Failed to fetch menu items after database initialization',
            debug: {
              originalError: error instanceof Error ? error.message : String(error),
              retryError: retryError instanceof Error ? retryError.message : String(retryError)
            }
          },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch menu items',
        debug: {
          message: error instanceof Error ? error.message : String(error)
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 解析表单数据
    const formData = await request.formData();
    
    // 处理图片
    const imageFile = formData.get('image') as File | null;
    let imageUrl = '';
    
    if (imageFile && imageFile.size > 0) {
      // 这里暂时返回空字符串，后续可以集成图片上传服务
      imageUrl = '';
    }
    
    // 解析其他数据
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const ingredientsStr = formData.get('ingredients') as string;
    const cookingStepsStr = formData.get('cookingSteps') as string;
    const preparationTime = parseInt(formData.get('preparationTime') as string) || 0;
    const difficulty = (formData.get('difficulty') as string || 'easy') as 'easy' | 'medium' | 'hard';
    
    const ingredients = ingredientsStr ? JSON.parse(ingredientsStr) : [];
    const cookingSteps = cookingStepsStr ? JSON.parse(cookingStepsStr) : [];
    
    const menuItemData = {
      name,
      description,
      ingredients,
      cookingSteps,
      imageUrl,
      preparationTime,
      difficulty
    };

    // 检查数据库连接并初始化（如果需要）
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.log('Database not connected, attempting to initialize...');
      await initializeDatabase();
    }
    
    const newMenuItem = await createMenuItem(menuItemData);
    return NextResponse.json(newMenuItem, { status: 201 });
    
  } catch (error) {
    console.error('Error creating menu item:', error);
    
    // 如果是数据库表不存在错误，尝试初始化数据库
    if (error instanceof Error && (error.message.includes('relation') || error.message.includes('table'))) {
      try {
        await initializeDatabase();
        
        // 重新解析数据并重试
        const formData = await request.formData();
        const menuItemData = {
          name: formData.get('name') as string,
          description: formData.get('description') as string,
          ingredients: JSON.parse(formData.get('ingredients') as string),
          cookingSteps: JSON.parse(formData.get('cookingSteps') as string),
          imageUrl: '',
          preparationTime: parseInt(formData.get('preparationTime') as string) || 0,
          difficulty: (formData.get('difficulty') as string || 'easy') as 'easy' | 'medium' | 'hard'
        };
        
        const newMenuItem = await createMenuItem(menuItemData);
        return NextResponse.json(newMenuItem, { status: 201 });
      } catch (retryError) {
        console.error('Error after database initialization:', retryError);
        return NextResponse.json(
          { 
            error: 'Failed to create menu item after database initialization',
            debug: {
              originalError: error instanceof Error ? error.message : String(error),
              retryError: retryError instanceof Error ? retryError.message : String(retryError)
            }
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to create menu item',
        debug: {
          message: error instanceof Error ? error.message : String(error)
        }
      },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getMenuItemById, updateMenuItem, deleteMenuItem } from '@/lib/db/menu';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const menuItem = await getMenuItemById(id);
    
    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch menu item',
        debug: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    // 处理图片上传
    const image = formData.get('image') as File;
    let imageUrl = formData.get('existingImageUrl') as string || '';
    
    if (image && image.size > 0) {
      // 将图片转换为base64存储（临时方案）
      const buffer = await image.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      imageUrl = `data:${image.type};base64,${base64}`;
    }

    const updateData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      ingredients: JSON.parse(formData.get('ingredients') as string),
      cookingSteps: JSON.parse(formData.get('cookingSteps') as string),
      imageUrl,
      preparationTime: parseInt(formData.get('preparationTime') as string),
      difficulty: formData.get('difficulty') as 'easy' | 'medium' | 'hard',
    };

    const updatedMenuItem = await updateMenuItem(id, updateData);
    
    if (!updatedMenuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update menu item',
        debug: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteMenuItem(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete menu item',
        debug: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      },
      { status: 500 }
    );
  }
}
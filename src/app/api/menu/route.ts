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
  const startTime = Date.now();
  console.log('[DEBUG] POST /api/menu started at:', new Date().toISOString());
  
  let menuItemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'> | undefined;
  
  // 设置超时处理 - 增加到10秒用于调试
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), 10000); // 10秒超时
  });
  
  try {
    console.log('[DEBUG] Starting formData parsing...');
    const formDataStart = Date.now();
    const formDataPromise = request.formData();
    const formData = await Promise.race([formDataPromise, timeoutPromise]) as FormData;
    console.log('[DEBUG] FormData parsed in:', Date.now() - formDataStart, 'ms');
    
    // 暂时跳过图片处理以避免超时 - 后续可改为云存储
     console.log('[DEBUG] Starting image processing...');
     const imageStart = Date.now();
     const image = formData.get('image') as File;
     let imageUrl = '';
     
     // 如果有图片，暂时只记录文件名，不处理内容
     if (image && image.size > 0) {
       imageUrl = `placeholder_${image.name}`; // 临时占位符
     }
     console.log('[DEBUG] Image processing completed in:', Date.now() - imageStart, 'ms');

     // 解析表单数据
     console.log('[DEBUG] Starting data parsing...');
     const parseStart = Date.now();
     menuItemData = {
       name: formData.get('name') as string,
       description: formData.get('description') as string,
       ingredients: JSON.parse(formData.get('ingredients') as string),
       cookingSteps: JSON.parse(formData.get('cookingSteps') as string),
       imageUrl,
       preparationTime: parseInt(formData.get('preparationTime') as string),
       difficulty: formData.get('difficulty') as 'easy' | 'medium' | 'hard',
     };
     console.log('[DEBUG] Data parsing completed in:', Date.now() - parseStart, 'ms');
     console.log('[DEBUG] Parsed data:', JSON.stringify(menuItemData, null, 2));

     // 创建菜单项 - 添加超时处理
     console.log('[DEBUG] Starting database operation...');
     const dbStart = Date.now();
     
     // 检查数据库连接
     console.log('[DEBUG] Checking database connection...');
     console.log('[DEBUG] Connection string exists:', !!process.env.PRISMA_DATABASE_URL);
     console.log('[DEBUG] Environment variables:', {
       PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL ? 'SET' : 'NOT_SET',
       DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
     });
     
     // 检查表是否存在，只在必要时创建
      console.log('[DEBUG] Checking if menu_items table exists...');
      const tableCheckStart = Date.now();
      
      try {
        // 检查表是否存在
        const tableExists = await db.sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'menu_items'
          )
        `;
        
        const exists = tableExists.rows[0]?.exists;
        console.log('[DEBUG] Table exists check result:', exists);
        
        if (!exists) {
          console.log('[DEBUG] Creating menu_items table...');
          const createStart = Date.now();
          
          await db.sql`
            CREATE TABLE menu_items (
              id SERIAL PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              description TEXT,
              ingredients JSONB NOT NULL DEFAULT '[]',
              cooking_steps JSONB NOT NULL DEFAULT '[]',
              image_url TEXT,
              preparation_time INTEGER DEFAULT 0,
              difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
          `;
          
          console.log('[DEBUG] Table created in:', Date.now() - createStart, 'ms');
        } else {
          console.log('[DEBUG] Table already exists, skipping creation');
        }
        
        console.log('[DEBUG] Table check completed in:', Date.now() - tableCheckStart, 'ms');
      } catch (tableError) {
        console.error('[DEBUG] Error checking/creating table:', tableError);
        throw tableError;
      }
     
     const createPromise = createMenuItem(menuItemData);
     const newMenuItem = await Promise.race([createPromise, timeoutPromise]) as MenuItem;
     console.log('[DEBUG] Database operation completed in:', Date.now() - dbStart, 'ms');

    console.log('[DEBUG] Total request time:', Date.now() - startTime, 'ms');
    return NextResponse.json(newMenuItem, { status: 201 });
  } catch (error) {
    console.error('[DEBUG] Error occurred at:', Date.now() - startTime, 'ms from start');
    console.error('[DEBUG] Error details:', error);
    
    // 如果是数据库表不存在错误，尝试初始化数据库
    if (error instanceof Error && (error.message.includes('relation') || error.message.includes('table')) && menuItemData) {
      try {
        console.log('[DEBUG] Starting database initialization...');
        const initStart = Date.now();
        await initializeDatabase();
        console.log('[DEBUG] Database initialization completed in:', Date.now() - initStart, 'ms');
        
        // 重试请求（使用已解析的数据）
        console.log('[DEBUG] Retrying database operation...');
        const retryStart = Date.now();
        const createPromise = createMenuItem(menuItemData);
        const newMenuItem = await Promise.race([createPromise, timeoutPromise]) as MenuItem;
        console.log('[DEBUG] Retry operation completed in:', Date.now() - retryStart, 'ms');
        console.log('[DEBUG] Total request time (with retry):', Date.now() - startTime, 'ms');
        return NextResponse.json(newMenuItem, { status: 201 });
      } catch (retryError) {
        console.error('[DEBUG] Retry failed after:', Date.now() - startTime, 'ms');
        console.error('[DEBUG] Retry error details:', retryError);
        return NextResponse.json(
          { 
            error: 'Failed to create menu item after database initialization',
            debug: {
              originalError: error instanceof Error ? error.message : String(error),
              retryError: retryError instanceof Error ? retryError.message : String(retryError),
              totalTime: Date.now() - startTime
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
          message: error instanceof Error ? error.message : String(error),
          totalTime: Date.now() - startTime
        }
      },
      { status: 500 }
    );
  }
}
import { QueryResultRow } from '@vercel/postgres';
import { MenuItem } from '@/lib/types/menu';
import { db } from './index';

// 获取所有菜单项
export async function getAllMenuItems(): Promise<MenuItem[]> {
  try {
    const result = await db.sql`
      SELECT 
        id,
        name,
        description,
        ingredients,
        cooking_steps,
        image_url,
        preparation_time,
        difficulty,
        created_at,
        updated_at
      FROM menu_items 
      ORDER BY created_at DESC
    `;

    return result.rows.map((row: QueryResultRow) => ({
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      ingredients: JSON.parse(row.ingredients),
      cookingSteps: JSON.parse(row.cooking_steps),
      imageUrl: row.image_url,
      preparationTime: row.preparation_time,
      difficulty: row.difficulty as 'easy' | 'medium' | 'hard',
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw new Error('Failed to fetch menu items');
  }
}

// 根据ID获取菜单项
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  try {
    const result = await db.sql`
      SELECT 
        id,
        name,
        description,
        ingredients,
        cooking_steps,
        image_url,
        preparation_time,
        difficulty,
        created_at,
        updated_at
      FROM menu_items 
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      ingredients: JSON.parse(row.ingredients),
      cookingSteps: JSON.parse(row.cooking_steps),
      imageUrl: row.image_url,
      preparationTime: row.preparation_time,
      difficulty: row.difficulty,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  } catch (error) {
    console.error('Error fetching menu item:', error);
    throw new Error('Failed to fetch menu item');
  }
}

// 创建新菜单项
export async function createMenuItem(menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
  const startTime = Date.now();
  console.log('[DB DEBUG] createMenuItem started at:', new Date().toISOString());
  console.log('[DB DEBUG] Input data:', JSON.stringify(menuItem, null, 2));
  
  try {
    // 简化插入操作，只返回ID
    console.log('[DB DEBUG] Starting SQL execution...');
    const sqlStart = Date.now();
    const result = await db.sql`
      INSERT INTO menu_items (
        name,
        description,
        ingredients,
        cooking_steps,
        image_url,
        preparation_time,
        difficulty
      ) VALUES (
        ${menuItem.name},
        ${menuItem.description},
        ${JSON.stringify(menuItem.ingredients)},
        ${JSON.stringify(menuItem.cookingSteps)},
        ${menuItem.imageUrl || ''},
        ${menuItem.preparationTime},
        ${menuItem.difficulty}
      )
      RETURNING id, created_at, updated_at
    `;
    console.log('[DB DEBUG] SQL execution completed in:', Date.now() - sqlStart, 'ms');

    const row = result.rows[0];
    console.log('[DB DEBUG] Database returned:', row);
    
    // 直接返回输入数据加上数据库生成的字段，避免重新查询
    console.log('[DB DEBUG] Building response object...');
    const responseStart = Date.now();
    const response = {
      id: row.id.toString(),
      name: menuItem.name,
      description: menuItem.description,
      ingredients: menuItem.ingredients,
      cookingSteps: menuItem.cookingSteps,
      imageUrl: menuItem.imageUrl || '',
      preparationTime: menuItem.preparationTime,
      difficulty: menuItem.difficulty,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
    console.log('[DB DEBUG] Response object built in:', Date.now() - responseStart, 'ms');
    console.log('[DB DEBUG] Total createMenuItem time:', Date.now() - startTime, 'ms');
    return response;
  } catch (error) {
    console.error('[DB DEBUG] Error occurred after:', Date.now() - startTime, 'ms');
    console.error('[DB DEBUG] Error details:', error);
    throw new Error('Failed to create menu item');
  }
}

// 更新菜单项
export async function updateMenuItem(id: string, updates: Partial<Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>>): Promise<MenuItem | null> {
  try {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    if (updates.name !== undefined) {
      setClause.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      setClause.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.ingredients !== undefined) {
      setClause.push(`ingredients = $${paramIndex++}`);
      values.push(JSON.stringify(updates.ingredients));
    }
    if (updates.cookingSteps !== undefined) {
      setClause.push(`cooking_steps = $${paramIndex++}`);
      values.push(JSON.stringify(updates.cookingSteps));
    }
    if (updates.imageUrl !== undefined) {
      setClause.push(`image_url = $${paramIndex++}`);
      values.push(updates.imageUrl);
    }
    if (updates.preparationTime !== undefined) {
      setClause.push(`preparation_time = $${paramIndex++}`);
      values.push(updates.preparationTime);
    }
    if (updates.difficulty !== undefined) {
      setClause.push(`difficulty = $${paramIndex++}`);
      values.push(updates.difficulty);
    }

    if (setClause.length === 0) {
      return getMenuItemById(id);
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE menu_items 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id,
        name,
        description,
        ingredients,
        cooking_steps,
        image_url,
        preparation_time,
        difficulty,
        created_at,
        updated_at
    `;

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      ingredients: row.ingredients,
      cookingSteps: row.cooking_steps,
      imageUrl: row.image_url,
      preparationTime: row.preparation_time,
      difficulty: row.difficulty,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw new Error('Failed to update menu item');
  }
}

// 删除菜单项
export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    const result = await db.sql`
      DELETE FROM menu_items 
      WHERE id = ${id}
    `;

    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw new Error('Failed to delete menu item');
  }
}
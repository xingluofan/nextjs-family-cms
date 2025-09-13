import { createClient } from '@vercel/postgres';

// 数据库连接配置
// 使用标准PostgreSQL连接字符串，避免Prisma Accelerate格式
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
export const db = createClient({
  connectionString
});

// 初始化数据库表
export async function initializeDatabase() {
  try {
    // 创建菜单表
    await db.sql`
      CREATE TABLE IF NOT EXISTS menu_items (
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

    // 创建交易记录表
    await db.sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        amount DECIMAL(10, 2) NOT NULL,
        type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 只创建必要的索引以减少初始化时间
    await db.sql`CREATE INDEX IF NOT EXISTS idx_menu_items_name ON menu_items(name)`;
    await db.sql`CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)`;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// 检查数据库连接
export async function checkDatabaseConnection() {
  try {
    await db.sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// 插入示例数据（仅在开发环境）
export async function seedDatabase() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  try {
    // 检查是否已有数据
    const existingTransactions = await db.sql`SELECT COUNT(*) FROM transactions`;
    if (Number(existingTransactions.rows[0].count) > 0) {
      console.log('Database already seeded');
      return;
    }

    // 插入示例交易数据
    await db.sql`
      INSERT INTO transactions (amount, type, category, description, date) VALUES
      (5000.00, 'income', '工资', '月薪', '2024-01-15'),
      (120.00, 'expense', '餐饮', '午餐', '2024-01-16'),
      (50.00, 'expense', '交通', '地铁卡充值', '2024-01-17'),
      (3000.00, 'income', '奖金', '年终奖', '2024-01-20'),
      (200.00, 'expense', '购物', '买衣服', '2024-01-22'),
      (80.00, 'expense', '餐饮', '晚餐', '2024-01-23'),
      (1500.00, 'expense', '房租', '月租金', '2024-01-25'),
      (300.00, 'expense', '购物', '日用品', '2024-01-26'),
      (2000.00, 'income', '兼职', '周末兼职', '2024-01-28'),
      (150.00, 'expense', '娱乐', '电影票', '2024-01-30')
    `;

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
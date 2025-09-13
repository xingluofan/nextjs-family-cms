-- 家庭厨房管理系统数据库表结构
-- 适用于 Vercel Postgres

-- 菜单表
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
);

-- 交易记录表
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('income', 'expense')) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_menu_items_name ON menu_items(name);
CREATE INDEX IF NOT EXISTS idx_menu_items_difficulty ON menu_items(difficulty);
CREATE INDEX IF NOT EXISTS idx_menu_items_created_at ON menu_items(created_at);

CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- 插入示例数据
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
ON CONFLICT DO NOTHING;
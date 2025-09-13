import { QueryResultRow } from '@vercel/postgres';
import { Transaction, TransactionSummary, MonthlyData, CategorySummary } from '@/lib/types/accounting';
import { db } from './index';

// 获取所有交易记录
export async function getAllTransactions(filters?: {
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense';
}): Promise<Transaction[]> {
  try {
    let query = `
      SELECT 
        id,
        amount,
        type,
        category,
        description,
        date,
        created_at,
        updated_at
      FROM transactions
    `;
    
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (filters?.startDate) {
      conditions.push(`date >= $${paramIndex++}`);
      values.push(filters.startDate);
    }
    
    if (filters?.endDate) {
      conditions.push(`date <= $${paramIndex++}`);
      values.push(filters.endDate);
    }
    
    if (filters?.type) {
      conditions.push(`type = $${paramIndex++}`);
      values.push(filters.type);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY date DESC, created_at DESC`;

    const result = await db.query(query, values);

    return result.rows.map((row: QueryResultRow) => ({
      id: row.id.toString(),
      amount: parseFloat(row.amount),
      type: row.type,
      category: row.category,
      description: row.description,
      date: new Date(row.date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
}

// 根据ID获取交易记录
export async function getTransactionById(id: string): Promise<Transaction | null> {
  try {
    const result = await db.sql`
      SELECT 
        id,
        amount,
        type,
        category,
        description,
        date,
        created_at,
        updated_at
      FROM transactions 
      WHERE id = ${id}
    `;

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id.toString(),
      amount: parseFloat(row.amount),
      type: row.type,
      category: row.category,
      description: row.description,
      date: new Date(row.date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw new Error('Failed to fetch transaction');
  }
}

// 创建新交易记录
export async function createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
  try {
    const result = await db.sql`
      INSERT INTO transactions (
        amount,
        type,
        category,
        description,
        date
      ) VALUES (
        ${transaction.amount},
        ${transaction.type},
        ${transaction.category},
        ${transaction.description},
        ${transaction.date.toISOString().split('T')[0]}
      )
      RETURNING 
        id,
        amount,
        type,
        category,
        description,
        date,
        created_at,
        updated_at
    `;

    const row = result.rows[0];
    return {
      id: row.id.toString(),
      amount: parseFloat(row.amount),
      type: row.type,
      category: row.category,
      description: row.description,
      date: new Date(row.date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Failed to create transaction');
  }
}

// 更新交易记录
export async function updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Transaction | null> {
  try {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    if (updates.amount !== undefined) {
      setClause.push(`amount = $${paramIndex++}`);
      values.push(updates.amount);
    }
    if (updates.type !== undefined) {
      setClause.push(`type = $${paramIndex++}`);
      values.push(updates.type);
    }
    if (updates.category !== undefined) {
      setClause.push(`category = $${paramIndex++}`);
      values.push(updates.category);
    }
    if (updates.description !== undefined) {
      setClause.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.date !== undefined) {
      setClause.push(`date = $${paramIndex++}`);
      values.push(updates.date.toISOString().split('T')[0]);
    }

    if (setClause.length === 0) {
      return getTransactionById(id);
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE transactions 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING 
        id,
        amount,
        type,
        category,
        description,
        date,
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
      amount: parseFloat(row.amount),
      type: row.type,
      category: row.category,
      description: row.description,
      date: new Date(row.date),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw new Error('Failed to update transaction');
  }
}

// 删除交易记录
export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    const result = await db.sql`
      DELETE FROM transactions 
      WHERE id = ${id}
    `;

    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw new Error('Failed to delete transaction');
  }
}

// 获取交易统计摘要
export async function getTransactionSummary(filters?: {
  startDate?: string;
  endDate?: string;
}): Promise<TransactionSummary> {
  try {
    let query = `
      SELECT 
        type,
        SUM(amount) as total_amount,
        COUNT(*) as count
      FROM transactions
    `;
    
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (filters?.startDate) {
      conditions.push(`date >= $${paramIndex++}`);
      values.push(filters.startDate);
    }
    
    if (filters?.endDate) {
      conditions.push(`date <= $${paramIndex++}`);
      values.push(filters.endDate);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY type`;

    const result = await db.query(query, values);

    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    result.rows.forEach((row: QueryResultRow) => {
      const amount = parseFloat(row.total_amount);
      const count = parseInt(row.count);
      
      if (row.type === 'income') {
        totalIncome = amount;
        incomeCount = count;
      } else if (row.type === 'expense') {
        totalExpense = amount;
        expenseCount = count;
      }
    });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: incomeCount + expenseCount,
    };
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    throw new Error('Failed to fetch transaction summary');
  }
}

// 获取月度数据
export async function getMonthlyData(filters?: {
  startDate?: string;
  endDate?: string;
}): Promise<MonthlyData[]> {
  try {
    let query = `
      SELECT 
        DATE_TRUNC('month', date) as month,
        type,
        SUM(amount) as total_amount
      FROM transactions
    `;
    
    const conditions = [];
    const values = [];
    let paramIndex = 1;

    if (filters?.startDate) {
      conditions.push(`date >= $${paramIndex++}`);
      values.push(filters.startDate);
    }
    
    if (filters?.endDate) {
      conditions.push(`date <= $${paramIndex++}`);
      values.push(filters.endDate);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY DATE_TRUNC('month', date), type ORDER BY month`;

    const result = await db.query(query, values);

    // 组织数据按月份
    const monthlyMap = new Map<string, { income: number; expense: number }>();
    
    result.rows.forEach((row: QueryResultRow) => {
      const month = new Date(row.month).toISOString().slice(0, 7); // YYYY-MM format
      const amount = parseFloat(row.total_amount);
      
      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, { income: 0, expense: 0 });
      }
      
      const monthData = monthlyMap.get(month)!;
      if (row.type === 'income') {
        monthData.income = amount;
      } else if (row.type === 'expense') {
        monthData.expense = amount;
      }
    });

    return Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      balance: data.income - data.expense,
    }));
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    throw new Error('Failed to fetch monthly data');
  }
}

// 获取分类统计
export async function getCategorySummary(filters?: {
  startDate?: string;
  endDate?: string;
}): Promise<CategorySummary[]> {
  try {
    let query = `
      SELECT 
        category,
        SUM(amount) as total_amount,
        COUNT(*) as count
      FROM transactions
      WHERE type = 'expense'
    `;
    
    const conditions = ['type = \'expense\''];
    const values = [];
    let paramIndex = 1;

    if (filters?.startDate) {
      conditions.push(`date >= $${paramIndex++}`);
      values.push(filters.startDate);
    }
    
    if (filters?.endDate) {
      conditions.push(`date <= $${paramIndex++}`);
      values.push(filters.endDate);
    }

    query = `
      SELECT 
        category,
        SUM(amount) as total_amount,
        COUNT(*) as count
      FROM transactions
      WHERE ${conditions.join(' AND ')}
      GROUP BY category
      ORDER BY total_amount DESC
    `;

    const result = await db.query(query, values);

    // 计算总支出用于百分比计算
    const totalExpense = result.rows.reduce((sum: number, row: QueryResultRow) => sum + parseFloat(row.total_amount), 0);
    
    // 预定义颜色
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    
    return result.rows.map((row: QueryResultRow, index: number) => {
      const amount = parseFloat(row.total_amount);
      return {
        category: row.category,
        amount,
        percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        color: colors[index % colors.length],
      };
    });
  } catch (error) {
    console.error('Error fetching category summary:', error);
    throw new Error('Failed to fetch category summary');
  }
}
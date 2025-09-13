export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFormData {
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

// 预定义的收支类别
export const INCOME_CATEGORIES = [
  '工资',
  '奖金',
  '投资收益',
  '兼职收入',
  '礼金',
  '其他收入',
];

export const EXPENSE_CATEGORIES = [
  '餐饮',
  '交通',
  '购物',
  '娱乐',
  '医疗',
  '教育',
  '房租',
  '水电费',
  '通讯费',
  '保险',
  '其他支出',
];

// 预定义的消费类别
export const DEFAULT_EXPENSE_CATEGORIES: TransactionCategory[] = [
  { id: '1', name: '餐饮', type: 'expense', color: '#FF6B6B', icon: '🍽️' },
  { id: '2', name: '交通', type: 'expense', color: '#4ECDC4', icon: '🚗' },
  { id: '3', name: '购物', type: 'expense', color: '#45B7D1', icon: '🛍️' },
  { id: '4', name: '娱乐', type: 'expense', color: '#96CEB4', icon: '🎮' },
  { id: '5', name: '医疗', type: 'expense', color: '#FFEAA7', icon: '🏥' },
  { id: '6', name: '教育', type: 'expense', color: '#DDA0DD', icon: '📚' },
  { id: '7', name: '住房', type: 'expense', color: '#98D8C8', icon: '🏠' },
  { id: '8', name: '其他', type: 'expense', color: '#F7DC6F', icon: '📦' },
];

export const DEFAULT_INCOME_CATEGORIES: TransactionCategory[] = [
  { id: '9', name: '工资', type: 'income', color: '#52C41A', icon: '💰' },
  { id: '10', name: '奖金', type: 'income', color: '#1890FF', icon: '🎁' },
  { id: '11', name: '投资收益', type: 'income', color: '#722ED1', icon: '📈' },
  { id: '12', name: '兼职', type: 'income', color: '#FA8C16', icon: '💼' },
  { id: '13', name: '其他收入', type: 'income', color: '#13C2C2', icon: '💎' },
];
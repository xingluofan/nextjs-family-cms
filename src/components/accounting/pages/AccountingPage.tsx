'use client';

import { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import MonthlyChart from '../charts/MonthlyChart';
import CategoryChart from '../charts/CategoryChart';
import TransactionTable from '../tables/TransactionTable';
import TransactionForm from '../forms/TransactionForm';

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'add' | 'list'>('overview');
  const [dateRange, setDateRange] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const handleDateRangeChange = (range: 'today' | 'week' | 'month' | 'custom') => {
    const today = new Date();
    let startDate: string;
    let endDate: string;

    switch (range) {
      case 'today':
        startDate = format(today, 'yyyy-MM-dd');
        endDate = format(today, 'yyyy-MM-dd');
        break;
      case 'week':
        startDate = format(subDays(today, 7), 'yyyy-MM-dd');
        endDate = format(today, 'yyyy-MM-dd');
        break;
      case 'month':
        startDate = format(startOfMonth(today), 'yyyy-MM-dd');
        endDate = format(endOfMonth(today), 'yyyy-MM-dd');
        break;
      default:
        return;
    }

    setDateRange({ startDate, endDate });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">记账管理</h1>
          <p className="mt-2 text-gray-600">管理您的收支记录，查看财务统计</p>
        </div>

        {/* 标签页导航 */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              概览
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'add'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              添加记录
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              交易记录
            </button>
          </nav>
        </div>

        {/* 概览页面 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 日期范围选择 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">时间范围</h2>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDateRangeChange('today')}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    今天
                  </button>
                  <button
                    onClick={() => handleDateRangeChange('week')}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    最近7天
                  </button>
                  <button
                    onClick={() => handleDateRangeChange('month')}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    本月
                  </button>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                  <span className="text-gray-500">至</span>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyChart startDate={dateRange.startDate} endDate={dateRange.endDate} />
              <CategoryChart startDate={dateRange.startDate} endDate={dateRange.endDate} />
            </div>
          </div>
        )}

        {/* 添加记录页面 */}
        {activeTab === 'add' && (
          <div className="max-w-2xl">
            <TransactionForm onSuccess={() => setActiveTab('list')} />
          </div>
        )}

        {/* 交易记录页面 */}
        {activeTab === 'list' && (
          <div className="space-y-6">
            {/* 筛选器 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">筛选条件</h2>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium text-gray-700">类型:</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">全部</option>
                    <option value="income">收入</option>
                    <option value="expense">支出</option>
                  </select>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium text-gray-700">开始日期:</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <label className="text-sm font-medium text-gray-700">结束日期:</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 交易表格 */}
            <TransactionTable
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              type={filterType === 'all' ? undefined : filterType}
            />
          </div>
        )}
      </div>
    </div>
  );
}
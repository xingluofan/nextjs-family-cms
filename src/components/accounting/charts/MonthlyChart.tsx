'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { MonthlyData } from '@/lib/types/accounting';

interface MonthlyChartProps {
  startDate?: string;
  endDate?: string;
}

export default function MonthlyChart({ startDate, endDate }: MonthlyChartProps) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          type: 'monthly',
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        });
        
        const response = await fetch(`/api/accounting/summary?${params}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const monthlyData = await response.json();
        setData(monthlyData);
      } catch (error) {
        console.error('Error fetching monthly data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatData = data.map((item) => ({
    ...item,
    month: new Date(item.month + '-01').toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
    }),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">月度收支趋势</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'line'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            折线图
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded text-sm ${
              chartType === 'bar'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            柱状图
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={formatData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`¥${value.toFixed(2)}`, '']}
              labelFormatter={(label) => `月份: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#52C41A"
              strokeWidth={2}
              name="收入"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#FF4D4F"
              strokeWidth={2}
              name="支出"
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#1890FF"
              strokeWidth={2}
              name="结余"
            />
          </LineChart>
        ) : (
          <BarChart data={formatData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`¥${value.toFixed(2)}`, '']}
              labelFormatter={(label) => `月份: ${label}`}
            />
            <Legend />
            <Bar dataKey="income" fill="#52C41A" name="收入" />
            <Bar dataKey="expense" fill="#FF4D4F" name="支出" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
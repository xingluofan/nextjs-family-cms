'use client';

import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { CategorySummary } from '@/lib/types/accounting';

interface CategoryChartProps {
  startDate?: string;
  endDate?: string;
}

export default function CategoryChart({ startDate, endDate }: CategoryChartProps) {
  const [data, setData] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          type: 'category',
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        });
        
        const response = await fetch(`/api/accounting/summary?${params}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const categoryData = await response.json();
        setData(categoryData);
      } catch (error) {
        console.error('Error fetching category data:', error);
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



  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">支出分类分布</h3>
      
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          暂无数据
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`¥${value.toFixed(2)}`, '金额']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4">
            <h4 className="text-md font-medium mb-2">详细分布</h4>
            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">¥{item.amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
import { NextRequest, NextResponse } from 'next/server';
import { getTransactionSummary, getMonthlyData, getCategorySummary } from '@/lib/db/accounting';
import { initializeDatabase, checkDatabaseConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type'); // 'summary' | 'monthly' | 'category'

    const dateRange = {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    switch (type) {
      case 'summary':
        const summary = await getTransactionSummary(dateRange);
        return NextResponse.json(summary);

      case 'monthly':
        const monthlyData = await getMonthlyData(dateRange);
        return NextResponse.json(monthlyData);

      case 'category':
        const categoryData = await getCategorySummary(dateRange);
        return NextResponse.json(categoryData);

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching summary data:', error);
    
    // 如果是数据库相关错误，尝试初始化数据库
    if (error instanceof Error && (error.message.includes('relation') || error.message.includes('table'))) {
      try {
        console.log('Database table error detected, initializing database...');
        await initializeDatabase();
        
        // 重试请求
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const type = searchParams.get('type');

        const dateRange = {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        };

        switch (type) {
          case 'summary':
            const summary = await getTransactionSummary(dateRange);
            return NextResponse.json(summary);

          case 'monthly':
            const monthlyData = await getMonthlyData(dateRange);
            return NextResponse.json(monthlyData);

          case 'category':
            const categoryData = await getCategorySummary(dateRange);
            return NextResponse.json(categoryData);

          default:
            return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
        }
      } catch (retryError) {
        console.error('Error after database initialization:', retryError);
        return NextResponse.json(
          { 
            error: 'Failed to fetch summary data after database initialization',
            debug: {
              originalError: error instanceof Error ? error.message : String(error),
              retryError: retryError instanceof Error ? retryError.message : String(retryError),
              message: retryError instanceof Error ? retryError.message : String(retryError),
              stack: retryError instanceof Error ? retryError.stack : undefined
            }
          },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch summary data',
        debug: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      },
      { status: 500 }
    );
  }
}
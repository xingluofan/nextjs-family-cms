import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase, seedDatabase, checkDatabaseConnection } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 检查数据库连接
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          debug: {
            message: 'Database connection check returned false',
            environment: process.env.NODE_ENV,
            storageUrl: process.env.STORAGE_URL ? 'SET' : 'NOT_SET',
            databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
          }
        },
        { status: 500 }
      );
    }

    // 初始化数据库表
    await initializeDatabase();
    
    // 在开发环境下插入示例数据
    if (process.env.NODE_ENV === 'development') {
      await seedDatabase();
    }

    return NextResponse.json({
      message: 'Database initialized successfully',
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        debug: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          environment: process.env.NODE_ENV,
          storageUrl: process.env.STORAGE_URL ? 'SET' : 'NOT_SET',
            databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
        }
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const isConnected = await checkDatabaseConnection();
    return NextResponse.json({
      connected: isConnected,
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Error checking database connection:', error);
    return NextResponse.json(
      { 
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          environment: process.env.NODE_ENV,
          storageUrl: process.env.STORAGE_URL ? 'SET' : 'NOT_SET',
            databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
        }
      },
      { status: 500 }
    );
  }
}
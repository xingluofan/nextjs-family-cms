import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const startTime = Date.now();
  
  try {
    console.log('[DEBUG] Starting database health check...');
    
    // 检查环境变量
    const envCheckStart = Date.now();
    const envVars = {
      PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL ? 'SET' : 'NOT_SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET'
    };
    
    // 确定使用的连接变量
    const connectionString = process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;
    const selectedVariable = process.env.PRISMA_DATABASE_URL ? 'PRISMA_DATABASE_URL' : 
                           process.env.DATABASE_URL ? 'DATABASE_URL' : 'NONE';
    
    const startsWithPostgres = connectionString ? connectionString.startsWith('postgres') : false;
    const envCheckMs = Date.now() - envCheckStart;
    
    console.log('[DEBUG] Environment check completed:', {
      envVars,
      selectedVariable,
      startsWithPostgres,
      envCheckMs
    });
    
    if (!connectionString) {
      return NextResponse.json({
        ok: false,
        error: 'No database connection string found',
        env: envVars,
        selectedVariable,
        startsWithPostgres,
        timings: { envCheckMs }
      }, { status: 500 });
    }
    
    // 测试数据库连接
    const connectStart = Date.now();
    let canConnect = false;
    let connectError = null;
    
    try {
      console.log('[DEBUG] Testing database connection...');
      const result = await db.sql`SELECT 1 as test`;
      canConnect = result.rows[0]?.test === 1;
      console.log('[DEBUG] Connection test result:', canConnect);
    } catch (error) {
      connectError = error instanceof Error ? error.message : String(error);
      console.error('[DEBUG] Connection test failed:', connectError);
    }
    
    const connectMs = Date.now() - connectStart;
    
    if (!canConnect) {
      return NextResponse.json({
        ok: false,
        error: connectError || 'Database connection failed',
        env: envVars,
        selectedVariable,
        startsWithPostgres,
        canConnect,
        timings: { envCheckMs, connectMs }
      }, { status: 500 });
    }
    
    // 检查表是否存在
    const tableCheckStart = Date.now();
    let tableInfo = {};
    
    try {
      console.log('[DEBUG] Checking menu_items table...');
      
      // 检查表是否存在
      const tableExists = await db.sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'menu_items'
        )
      `;
      
      const exists = tableExists.rows[0]?.exists;
      
      if (exists) {
        // 如果表存在，获取行数
        const countResult = await db.sql`SELECT COUNT(*) as count FROM menu_items`;
        const rowCount = parseInt(countResult.rows[0]?.count || '0');
        
        tableInfo = {
          menu_items: {
            exists: true,
            rowCount
          }
        };
      } else {
        tableInfo = {
          menu_items: {
            exists: false,
            rowCount: 0
          }
        };
      }
      
      console.log('[DEBUG] Table check completed:', tableInfo);
    } catch (error) {
      console.error('[DEBUG] Table check failed:', error);
      tableInfo = {
        menu_items: {
          exists: false,
          error: error instanceof Error ? error.message : String(error)
        }
      };
    }
    
    const tableCheckMs = Date.now() - tableCheckStart;
    const totalMs = Date.now() - startTime;
    
    return NextResponse.json({
      ok: true,
      env: envVars,
      selectedVariable,
      startsWithPostgres,
      canConnect,
      table: tableInfo,
      timings: {
        envCheckMs,
        connectMs,
        tableCheckMs,
        totalMs
      }
    });
    
  } catch (error) {
    const totalMs = Date.now() - startTime;
    console.error('[DEBUG] Health check failed:', error);
    
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      timings: { totalMs }
    }, { status: 500 });
  }
}
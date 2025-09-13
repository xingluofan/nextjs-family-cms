import { NextRequest, NextResponse } from 'next/server';
import { Transaction } from '@/lib/types/accounting';
import { getAllTransactions, createTransaction } from '@/lib/db/accounting';
import { initializeDatabase, checkDatabaseConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type');

    const transactions = await getAllTransactions({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      type: (type as 'income' | 'expense') || undefined,
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    
    // 如果是数据库表不存在错误，尝试初始化数据库
    if (error instanceof Error && (error.message.includes('relation') || error.message.includes('table'))) {
      try {
        console.log('Database table error detected, initializing database...');
        await initializeDatabase();
        
        // 重试请求
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const type = searchParams.get('type');

        const transactions = await getAllTransactions({
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          type: (type as 'income' | 'expense') || undefined,
        });

        return NextResponse.json(transactions);
      } catch (retryError) {
        console.error('Error after database initialization:', retryError);
        return NextResponse.json(
          { 
            error: 'Failed to fetch transactions after database initialization',
            debug: {
              originalError: error instanceof Error ? error.message : String(error),
              retryError: retryError instanceof Error ? retryError.message : String(retryError),
              stack: retryError instanceof Error ? retryError.stack : undefined
            }
          },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch transactions',
        debug: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> | undefined;
  
  try {
    // 检查数据库连接并初始化（如果需要）
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.log('Database not connected, attempting to initialize...');
      await initializeDatabase();
    }

    const data = await request.json();
    
    transactionData = {
      amount: parseFloat(data.amount),
      type: data.type,
      category: data.category,
      description: data.description,
      date: data.date,
    };

    const newTransaction = await createTransaction(transactionData);

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    
    // 如果是数据库相关错误，尝试初始化数据库
    if (error instanceof Error && (error.message.includes('relation') || error.message.includes('table')) && transactionData) {
      try {
        console.log('Database table error detected, initializing database...');
        await initializeDatabase();
        
        // 重试请求（使用已解析的数据）
        const newTransaction = await createTransaction(transactionData);

        return NextResponse.json(newTransaction, { status: 201 });
      } catch (retryError) {
        console.error('Error after database initialization:', retryError);
        return NextResponse.json(
          { 
            error: 'Failed to create transaction after database initialization',
            debug: {
              originalError: error instanceof Error ? error.message : String(error),
              retryError: retryError instanceof Error ? retryError.message : String(retryError),
              stack: retryError instanceof Error ? retryError.stack : undefined,
              transactionData
            }
          },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create transaction',
        debug: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          transactionData
        }
      },
      { status: 500 }
    );
  }
}
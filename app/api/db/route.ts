import { NextRequest, NextResponse } from 'next/server';
import { isMySQLConfigured } from '@/lib/mysql';
import * as mysqlDb from '@/lib/db/mysql-db';

export async function POST(req: NextRequest) {
  try {
    const { action, params = [] } = await req.json();

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    if (!isMySQLConfigured) {
      return NextResponse.json({ error: 'MySQL database not configured' }, { status: 501 });
    }

    const dbFunc = (mysqlDb as any)[action];
    if (typeof dbFunc !== 'function') {
      return NextResponse.json({ error: `Method ${action} not found` }, { status: 400 });
    }

    const result = await dbFunc(...params);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error(`[MySQL API Controller] Action "${req.url}" failed:`, error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

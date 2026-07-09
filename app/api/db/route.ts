import { NextRequest, NextResponse } from 'next/server';
import { isMySQLConfigured } from '@/lib/mysql';
import * as mysqlDb from '@/lib/db/mysql-db';
import { verifyAdminRequest } from '@/lib/security/auth';
import { rateLimit } from '@/lib/security/rate-limit';

const PUBLIC_ACTIONS = [
  'getMovies',
  'getUpcomingReleases',
  'getTimeline',
  'getGallery',
  'getVideos',
  'getNews',
  'getDownloads',
  'getFanCreations',
  'addRegistration',
  'getRegistrationByPhone',
  'addWelfareRequest',
];

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limit: Limit database proxy requests to protect from resource exhaustion (DDoS)
    const limitResult = rateLimit(req, 120, 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json({ error: 'Too many database operations. Please slow down.' }, { status: 429 });
    }

    const { action, params = [] } = await req.json();

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    // 2. Access Control: Restrict administrative queries (like getRegistrations, delete items, etc.)
    if (!PUBLIC_ACTIONS.includes(action)) {
      const admin = await verifyAdminRequest(req);
      if (!admin) {
        return NextResponse.json(
          { error: 'Unauthorized: Administrative access required for this database query.' },
          { status: 401 }
        );
      }
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

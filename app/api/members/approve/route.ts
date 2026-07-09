import { NextRequest, NextResponse } from 'next/server';
import { createWhatsAppLog, getDistricts } from '@/lib/firebase/db';
import { verifyAdminRequest } from '@/lib/security/auth';

interface ApprovalRequest {
  registrationId: string;
  memberName: string;
  phoneNumber: string;
  district: string;
  email: string;
  photo: string;
  designation?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Secure endpoint: verify admin request
    const admin = await verifyAdminRequest(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body: ApprovalRequest = await req.json();
    const { registrationId, memberName, phoneNumber, district, email, photo, designation } = body;

    if (!registrationId || !memberName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: registrationId, memberName, phoneNumber' },
        { status: 400 }
      );
    }

    console.log('[Member Approval] Started for:', { memberName, phoneNumber, district });

    // Create WhatsApp log entry
    const registration = {
      id: registrationId,
      name: memberName,
      phone: phoneNumber,
      district,
      email,
      photo,
    };

    const whatsappLog = await createWhatsAppLog(registration);
    console.log('[Member Approval] Created WhatsApp log:', whatsappLog.id);

    // Get district group link
    const districts = await getDistricts();
    const districtInfo = districts.find((d: any) => d.districtName === district);
    const districtGroupLink = districtInfo?.groupLink || 'https://chat.whatsapp.com/grk-fanclub';

    // Queue WhatsApp message sending (non-blocking)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const authHeader = req.headers.get('Authorization');
    const fetchHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authHeader) {
      fetchHeaders['Authorization'] = authHeader;
    }

    fetch(`${appUrl}/api/whatsapp/send-message`, {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify({
        logId: whatsappLog.id,
        phoneNumber,
        memberName,
        memberId: `GRK-${registrationId.substring(0, 8).toUpperCase()}`,
        designation: designation || 'Fan Club Member',
        district,
        districtGroupLink,
      }),
    }).catch(err => {
      console.error('[Member Approval] Failed to queue WhatsApp message:', err);
    });

    console.log('[Member Approval] Completed - WhatsApp message queued');

    return NextResponse.json({
      success: true,
      message: 'Member approved. WhatsApp message will be sent automatically.',
      data: {
        registrationId,
        memberName,
        status: 'Approved',
        whatsappLogId: whatsappLog.id,
        approvedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Member Approval] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to approve member',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

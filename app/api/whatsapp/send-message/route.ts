import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/whatsapp/service';
import { updateWhatsAppLogStatus } from '@/lib/firebase/db';
import { verifyAdminRequest } from '@/lib/security/auth';

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    
    const {
      logId,
      phoneNumber,
      memberName,
      memberId,
      designation,
      district,
      districtGroupLink,
      cardUrl,
    } = body;

    // Validate required fields
    if (!phoneNumber || !memberName || !memberId) {
      return NextResponse.json(
        { error: 'Missing required fields: phoneNumber, memberName, memberId' },
        { status: 400 }
      );
    }

    console.log(`[WhatsApp API] Sending message to ${memberName} (${phoneNumber})`);

    // Update status to "sending"
    if (logId) {
      await updateWhatsAppLogStatus(logId, 'sending');
    }

    // Send WhatsApp message
    const result = await WhatsAppService.sendMessage(
      phoneNumber,
      memberName,
      memberId,
      designation || 'Fan Club Member',
      district,
      districtGroupLink
    );

    if (result.success && logId) {
      // Update status to "sent" with messageId
      await updateWhatsAppLogStatus(logId, 'sent', {
        messageId: result.messageId,
        sentTime: new Date().toISOString(),
        status: 'sent',
        retryCount: 0,
      });

      console.log(`[WhatsApp API] Message sent successfully to ${memberName}`);

      return NextResponse.json(
        {
          success: true,
          messageId: result.messageId,
          message: `WhatsApp message sent to ${memberName}`,
        },
        { status: 200 }
      );
    } else if (logId) {
      // Update status to "failed" with error message
      const retryCount = body.retryCount || 0;
      await updateWhatsAppLogStatus(logId, 'failed', {
        errorMessage: result.error,
        retryCount: retryCount + 1,
        status: 'failed',
      });

      console.error(`[WhatsApp API] Failed to send message to ${memberName}:`, result.error);

      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: `Failed to send WhatsApp message: ${result.error}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Unknown error' },
      { status: 500 }
    );
  } catch (error) {
    console.error('[WhatsApp API] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

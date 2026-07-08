import { WHATSAPP_API_BASE_URL, WHATSAPP_CONFIG, isWhatsAppConfigured } from './config';

interface WhatsAppMessagePayload {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template' | 'text';
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: any[];
  };
  text?: {
    body: string;
  };
}

interface WhatsAppResponse {
  messages: Array<{
    id: string;
  }>;
}

interface WhatsAppErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
  };
}

export class WhatsAppService {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 2000; // 2 seconds

  /**
   * Send WhatsApp message using Business Cloud API
   */
  static async sendMessage(
    phoneNumber: string,
    memberName: string,
    memberId: string,
    designation: string,
    district: string,
    districtGroupLink: string,
    cardUrl?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!isWhatsAppConfigured()) {
      console.error('[WhatsApp] API not configured - missing credentials');
      return { success: false, error: 'WhatsApp API not configured' };
    }

    const payload = this.buildMessagePayload(
      phoneNumber,
      memberName,
      memberId,
      designation,
      district,
      districtGroupLink
    );

    let lastError: string = '';

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(WHATSAPP_API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${WHATSAPP_CONFIG.apiToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = (await response.json()) as WhatsAppErrorResponse;
          lastError = errorData.error?.message || `HTTP ${response.status}`;
          
          if (attempt < this.MAX_RETRIES) {
            console.log(`[WhatsApp] Retry ${attempt}/${this.MAX_RETRIES} - waiting ${this.RETRY_DELAY}ms`);
            await new Promise(r => setTimeout(r, this.RETRY_DELAY));
            continue;
          }
        } else {
          const data = (await response.json()) as WhatsAppResponse;
          const messageId = data.messages?.[0]?.id;
          
          if (messageId) {
            console.log(`[WhatsApp] Message sent successfully to ${phoneNumber}`, { messageId });
            return { success: true, messageId };
          } else {
            lastError = 'No message ID in response';
          }
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[WhatsApp] Attempt ${attempt} failed:`, lastError);
        
        if (attempt < this.MAX_RETRIES) {
          await new Promise(r => setTimeout(r, this.RETRY_DELAY));
          continue;
        }
      }
    }

    console.error(`[WhatsApp] Failed after ${this.MAX_RETRIES} retries:`, lastError);
    return { success: false, error: lastError };
  }

  /**
   * Build WhatsApp message payload
   */
  private static buildMessagePayload(
    phoneNumber: string,
    memberName: string,
    memberId: string,
    designation: string,
    district: string,
    districtGroupLink: string
  ): WhatsAppMessagePayload {
    // Clean phone number - ensure it's in E.164 format (with country code)
    const cleanPhone = this.formatPhoneNumber(phoneNumber);

    // Build welcome message with template variables
    const messageBody = `🎉 Welcome to Gautham Ram Karthik Fans Club!

Dear ${memberName},

Congratulations! Your membership application has been successfully approved.

We are delighted to welcome you to the Gautham Ram Karthik Fans Club family.

━━━━━━━━━━━━━━

👤 Member Name: ${memberName}
🆔 Membership ID: ${memberId}
🎖️ Designation: ${designation}
📍 District: ${district}

━━━━━━━━━━━━━━

📎 Your Digital Membership Card will be sent separately.

📱 Join Your Official District WhatsApp Group:
${districtGroupLink}

If you have any questions, feel free to contact your District Administration.

Thank you for becoming a part of our family.

🤝
சேர்ந்து உழைப்போம்!
சேர்ந்து வளர்வோம்!

With Regards,
Gautham Ram Karthik Fans Club`;

    return {
      messaging_product: 'whatsapp',
      to: cleanPhone,
      type: 'text',
      text: {
        body: messageBody,
      },
    };
  }

  /**
   * Format phone number to E.164 format
   * Assumes Indian numbers if no country code provided
   */
  private static formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, remove it (Indian format)
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // If no country code, add +91 for India
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }

    return '+' + cleaned;
  }
}

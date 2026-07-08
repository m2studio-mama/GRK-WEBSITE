# WhatsApp Business Cloud API Implementation Guide

## Overview

This document describes the server-side automatic WhatsApp messaging system integrated into the Gautham Ram Karthik Fan Club platform. The system automatically sends welcome messages and district group invitations to approved members without requiring manual user interaction.

---

## Architecture

### Components

1. **WhatsApp Config** (`lib/whatsapp/config.ts`)
   - Stores API credentials and configuration
   - Validates that all required environment variables are set

2. **WhatsApp Service** (`lib/whatsapp/service.ts`)
   - Handles WhatsApp API calls
   - Implements retry logic (up to 3 attempts)
   - Formats phone numbers to E.164 format
   - Builds message payloads

3. **API Routes**
   - `/api/members/approve` - Triggered when admin approves a member
   - `/api/whatsapp/send-message` - Sends WhatsApp messages via Business Cloud API

4. **Admin Dashboard**
   - WhatsApp logs tab showing message delivery status
   - Retry button for failed messages
   - District management section
   - Real-time status updates

---

## Setup Instructions

### 1. Create WhatsApp Business Account

1. Go to [Meta Business Suite](https://business.facebook.com)
2. Create a WhatsApp Business Account
3. Verify your phone number
4. Create an API access token

### 2. Environment Variables

Add these to your `.env.local` or Vercel project settings:

```bash
# WhatsApp Business Cloud API
WHATSAPP_BUSINESS_ACCOUNT_ID=your_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_API_TOKEN=your_access_token
```

**How to get these values:**

- **Account ID**: Found in Meta Business Suite → Settings → Business Information
- **Phone Number ID**: Available after verifying a phone number in WhatsApp Business
- **Access Token**: Create via Meta App Dashboard → Your Apps → Settings → Tokens

### 3. Verify Your Phone Number

WhatsApp Business Cloud API requires phone number verification:

1. Register your business phone number in WhatsApp Business
2. Verify it through SMS
3. Use this number to send messages

### 4. Test Mode

To test without real WhatsApp credentials:

1. Leave the environment variables empty or undefined
2. Messages will be logged to console instead of sent
3. Status will show as "pending" → "sending" → "sent" (simulated)

---

## How It Works

### Approval Workflow

```
Admin clicks "Approve" on a registration
    ↓
updateRegistrationStatus() marks member as "Approved"
    ↓
fetch('/api/members/approve') is called
    ↓
createWhatsAppLog() creates a new log entry with "pending" status
    ↓
fetch('/api/whatsapp/send-message') is queued (non-blocking)
    ↓
WhatsAppService.sendMessage() sends via Business Cloud API
    ↓
Status updated: pending → sending → sent (on success)
            or  pending → sending → failed (on error)
    ↓
If failed, admin can click "Retry" to try again (max 3 times)
```

### Message Template

Members receive a personalized welcome message including:

- Congratulations message
- Member details (name, ID, designation, district)
- District WhatsApp group invite link
- Contact information for support

Example:

```
🎉 Welcome to Gautham Ram Karthik Fans Club!

Dear John Doe,

Congratulations! Your membership application has been successfully approved.

We are delighted to welcome you to the Gautham Ram Karthik Fans Club family.

━━━━━━━━━━━━━━

👤 Member Name: John Doe
🆔 Membership ID: GRK-ABC123XY
🎖️ Designation: Fan Club Member
📍 District: Chennai

━━━━━━━━━━━━━━

📱 Join Your Official District WhatsApp Group:
https://chat.whatsapp.com/FVyc1VH3z92C6IrAGt0p7O

If you have any questions, feel free to contact us.

🤝
சேர்ந்து உழைப்போம்!
சேர்ந்து வளர்வோம்!

With Regards,
Gautham Ram Karthik Fans Club
```

---

## Status Tracking

### Possible Message Statuses

| Status | Meaning |
|--------|---------|
| **pending** | Log entry created, message queued for sending |
| **sending** | API call in progress |
| **sent** | Successfully delivered to WhatsApp servers |
| **delivered** | Delivered to recipient's phone |
| **read** | Message has been read by recipient |
| **failed** | Send failed after retries |

### Admin Dashboard WhatsApp Tab

Shows all sent messages with:
- Member name and phone number
- Current delivery status (color-coded)
- Send timestamp
- Error message (if failed)
- Retry button (if failed and retry count < 3)
- District WhatsApp group links

---

## Error Handling

### Automatic Retries

If sending fails, the system automatically retries:
- Retry 1: After 2 seconds
- Retry 2: After 2 seconds
- Retry 3: After 2 seconds

If all retries fail, status is marked as "Failed".

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "WhatsApp API not configured" | Missing environment variables | Add credentials to `.env.local` |
| "HTTP 401" | Invalid access token | Verify token in Meta App Dashboard |
| "HTTP 403" | Phone number not verified | Complete phone verification in WhatsApp Business |
| "Invalid phone number" | Incorrect format | Ensure 10-digit Indian numbers or E.164 format |
| "Rate limit exceeded" | Too many messages in short time | Wait before retrying |

### Manual Retry

Admins can manually retry failed messages using the "Retry" button in the WhatsApp logs tab. The system allows up to 3 total retry attempts per message.

---

## Database Schema

### WhatsApp Logs Collection

```typescript
{
  id: string;                    // Unique log ID
  registrationId: string;        // Reference to registration
  memberName: string;            // Recipient name
  phoneNumber: string;           // Recipient phone (E.164 format)
  district: string;              // Recipient's district
  status: 'pending' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  messageId?: string;            // WhatsApp message ID
  sentTime?: string;             // ISO timestamp when sent
  deliveredTime?: string;        // ISO timestamp when delivered
  cardUrl?: string;              // Membership card URL
  errorMessage?: string;         // Error details if failed
  retryCount: number;            // Number of retry attempts
}
```

---

## Security & Best Practices

### API Security

- ✅ All API calls use HTTPS
- ✅ Access tokens stored securely in environment variables
- ✅ Never log or expose access tokens
- ✅ Phone numbers formatted before API calls
- ✅ Input validation on all fields

### Data Privacy

- ✅ Phone numbers only used for message delivery
- ✅ No data shared with third parties
- ✅ Messages deleted after delivery per WhatsApp policy
- ✅ Audit logs track all message attempts

### Production Checklist

- [ ] Environment variables set in Vercel project
- [ ] WhatsApp Business account created and verified
- [ ] Phone number verified for sending
- [ ] Test message sent successfully
- [ ] Admin dashboard accessible and tested
- [ ] Error handling tested with invalid numbers
- [ ] Retry mechanism tested
- [ ] Monitor WhatsApp API rate limits
- [ ] Set up alerts for failed messages

---

## Monitoring & Logging

### Application Logs

Console logs prefixed with `[WhatsApp]` or `[Member Approval]` track:
- API calls and responses
- Retry attempts
- Error details
- Message IDs

Access via:
- Vercel Dashboard → Logs
- Browser DevTools Console
- Server-side logs

### Admin Dashboard Monitoring

The WhatsApp tab in the admin dashboard provides:
- Real-time delivery status
- Error messages for troubleshooting
- Retry history
- Member contact details for follow-up

---

## Troubleshooting

### Messages Not Sending

**Symptoms**: Status shows "pending" or "sending" indefinitely

**Solutions**:
1. Check environment variables are set: `console.log(process.env.WHATSAPP_BUSINESS_ACCOUNT_ID)`
2. Verify API token is valid in Meta App Dashboard
3. Check phone number is verified in WhatsApp Business
4. Review API rate limits

### Invalid Phone Number Error

**Symptoms**: Status shows "failed", error mentions "invalid format"

**Solutions**:
1. Ensure registration has 10-digit phone number
2. If using different country, add country code (e.g., +1 for USA)
3. Phone number should not include spaces or special characters

### High Failure Rate

**Symptoms**: Most messages show "failed"

**Solutions**:
1. Check WhatsApp Business account approval status
2. Verify phone number hasn't been suspended
3. Review Meta App Dashboard for warnings
4. Check API rate limit (typically 1,000 messages/day in test mode)

### Admin Dashboard Not Loading

**Symptoms**: WhatsApp tab shows no content

**Solutions**:
1. Refresh the page
2. Check browser console for errors
3. Verify Firebase configuration is correct
4. Try clearing browser cache

---

## API Reference

### POST /api/members/approve

Approve a member and queue WhatsApp message.

**Request:**
```json
{
  "registrationId": "string",
  "memberName": "string",
  "phoneNumber": "string",
  "district": "string",
  "email": "string",
  "photo": "string",
  "designation": "string" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Member approved. WhatsApp message will be sent automatically.",
  "data": {
    "registrationId": "string",
    "memberName": "string",
    "status": "Approved",
    "whatsappLogId": "string",
    "approvedAt": "2024-01-15T10:30:00Z"
  }
}
```

### POST /api/whatsapp/send-message

Send a WhatsApp message (called internally).

**Request:**
```json
{
  "logId": "string",
  "phoneNumber": "string",
  "memberName": "string",
  "memberId": "string",
  "designation": "string",
  "district": "string",
  "districtGroupLink": "string"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "string",
  "message": "WhatsApp message sent to {memberName}"
}
```

---

## Future Enhancements

- [ ] Send digital membership card as media attachment
- [ ] Schedule messages for off-peak hours
- [ ] Track delivery statistics and analytics
- [ ] Webhook integration for real-time status updates
- [ ] Multi-language support
- [ ] Customizable message templates
- [ ] Bulk message sending for campaigns
- [ ] WhatsApp reaction emoji support

---

## Support

For issues or questions:

1. Check the Troubleshooting section above
2. Review WhatsApp Business API documentation: https://developers.facebook.com/docs/whatsapp/cloud-api
3. Contact Meta Business Support
4. Review application logs in Vercel Dashboard

---

**Last Updated**: January 2025
**Version**: 1.0

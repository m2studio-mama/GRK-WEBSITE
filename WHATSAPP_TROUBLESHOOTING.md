# WhatsApp Integration Troubleshooting Guide

## Current Status

### ✅ System Components Working
- Member approval workflow is fully functional
- WhatsApp logs database structure is set up
- API routes are responding correctly
- Message templates are formatted properly
- Phone number validation (E.164 format) is working

### ❌ Issue: Token Authentication Error
**Error Message**: `Invalid OAuth access token - Cannot parse access token`

This indicates the WhatsApp API token may be:
1. Incomplete or truncated
2. Expired (tokens may need refreshing)
3. Invalid format
4. Missing required permissions

---

## How to Fix

### Step 1: Verify Your Meta Credentials

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Navigate to **Settings → Apps and Websites → WhatsApp Business**
3. Find your **Phone Number ID** and **Business Account ID**
4. Generate a new **Permanent Access Token**:
   - Go to **Settings → User Settings → Apps and Websites**
   - Click **Generate Token**
   - Select `whatsapp_business_messaging` scope
   - Copy the entire token

### Step 2: Update Environment Variables in Vercel

Add/Update these variables in your Vercel project settings:

```
WHATSAPP_BUSINESS_ACCOUNT_ID=1037491078811796
WHATSAPP_PHONE_NUMBER_ID=1114875945052853
WHATSAPP_API_TOKEN=<your-new-complete-token>
```

**Important**: Make sure the token is:
- Complete (not truncated)
- Recently generated
- Has the correct scope (Business Messaging)

### Step 3: Verify Configuration

Check if the configuration is loaded correctly:
```bash
curl http://your-domain/api/debug/config
```

Expected response:
```json
{
  "configured": true,
  "config": {
    "accountId": "✓ SET",
    "phoneNumberId": "✓ SET",
    "apiToken": "✓ SET (EAA...)",
    "apiVersion": "v18.0"
  }
}
```

### Step 4: Test Message Sending

Once credentials are updated, test by:

1. Go to Admin Dashboard → Registrations
2. Click "Approve" on a pending member
3. Check the WhatsApp tab for delivery status

Or test via API:
```bash
curl -X POST http://your-domain/api/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+919876543210",
    "memberName": "Test User",
    "memberId": "GRK-TEST",
    "designation": "Member",
    "district": "Chennai",
    "districtGroupLink": "https://chat.whatsapp.com/test"
  }'
```

---

## Expected Response When Working

### Success Response:
```json
{
  "success": true,
  "messageId": "wamid.XXXXX=",
  "message": "WhatsApp message sent to Test User"
}
```

### WhatsApp Log Entry (Should show):
- Status: "sent" (updates to "delivered"/"read" when received)
- Message ID: `wamid.XXXXX=`
- Sent timestamp
- Member details

---

## Common Issues

### Issue 1: Token Keeps Getting "Invalid"
**Solution**: 
- Generate a NEW token (old tokens expire)
- Verify token has `whatsapp_business_messaging` scope
- Ensure no extra spaces or characters in token

### Issue 2: "Cannot Parse Access Token"
**Solution**:
- Token is likely truncated or malformed
- Copy the ENTIRE token from Meta Business Suite
- Avoid pasting with extra whitespace

### Issue 3: "Invalid OAuth 2.0 Access Token"
**Solution**:
- Token has expired
- Generate a new permanent access token
- Update in Vercel environment variables
- Restart deployment

### Issue 4: Message Sent but No Status Update
**Solution**:
- Meta webhook not configured (optional for basic functionality)
- Check firewall/CORS settings
- Message was sent but delivery status not tracked in real-time
- Check WhatsApp logs manually in database

---

## Testing Checklist

- [ ] WhatsApp Business Account created and verified
- [ ] Phone Number verified with SMS/Call
- [ ] Business Account ID obtained
- [ ] Phone Number ID obtained
- [ ] Permanent Access Token generated with correct scope
- [ ] Environment variables updated in Vercel
- [ ] Page redeployed to apply env vars
- [ ] `/api/debug/config` returns "configured": true
- [ ] Member approval API test returns success
- [ ] WhatsApp message received on test number

---

## Advanced Configuration

### Setting Up Webhooks (Optional)
For real-time delivery status updates (delivered, read, failed):

1. In Meta App Dashboard → WhatsApp → Configuration
2. Set webhook URL: `https://your-domain/api/webhooks/whatsapp`
3. Subscribe to: `message_status`, `message_template_status_update`
4. Verify token

Currently the system queues messages and tracks status locally. Webhooks provide real-time updates.

### Custom Message Template
Edit `/lib/whatsapp/service.ts` → `buildMessagePayload()` to customize the welcome message template.

---

## Need Help?

1. Check Meta's WhatsApp Business API docs: https://developers.facebook.com/docs/whatsapp/cloud-api
2. Verify token scopes: https://developers.facebook.com/docs/facebook-login/permissions
3. Test token validity: Use Meta's Graph API explorer at https://developers.facebook.com/tools/explorer/

# How to Get a Valid WhatsApp Business Cloud API Token

## Error You're Seeing
```
Invalid OAuth access token - Cannot parse access token
OAuthException Code: 190
```

This error means your token is **expired, invalid, or has wrong permissions**.

---

## Solution: Generate a New Token (3 Steps)

### Step 1: Go to Meta Business Suite
Visit: https://business.facebook.com/

### Step 2: Access WhatsApp Business Platform
1. Click **"Account Settings"** (bottom left)
2. Select **"Apps and Websites"**
3. Click on your **WhatsApp App**

### Step 3: Generate New System User Token
1. Go to **Settings → System Users** (in your app)
2. Create a **new system user** or select existing one
3. Click **Generate Token**
4. Select **WhatsApp Business Account**
5. Choose permissions:
   - ✅ `whatsapp_business_messaging`
   - ✅ `whatsapp_business_account_management`
   - ✅ `whatsapp_business_read`
6. Set expiration: **Never** (or yearly)
7. Copy the token

---

## Verify Your Token Works

Once you have the token, test it locally:

```bash
curl http://localhost:3000/api/whatsapp/validate-token
```

You should see:
```json
{
  "valid": true,
  "message": "Token is valid",
  "tokenLength": 282
}
```

---

## Update Environment Variables

1. Go to **Vercel Project Settings**
2. Select **Environment Variables**
3. Update `WHATSAPP_API_TOKEN` with your new token
4. Redeploy the project

---

## Testing After Token Update

1. Reload the app
2. Go to **Admin Dashboard → Registrations**
3. Click **Approve** on any member
4. Check **WhatsApp tab** to see message status change from:
   - `pending` → `sending` → `sent` → `delivered`

---

## Need Help?

**Common Issues:**

| Problem | Solution |
|---------|----------|
| Token still invalid | Make sure you selected `whatsapp_business_messaging` permission |
| Messages not sending | Check phone number is in E.164 format: `+919876543210` |
| No logs appearing | Make sure you clicked "Approve" on a registration |
| Stuck on "pending" | Token needs `whatsapp_business_messaging` scope |

---

## Important Notes

- Tokens expire based on the expiration date you selected (1 year is recommended)
- Keep your token secret - never commit it to GitHub
- Always use `WHATSAPP_API_TOKEN` as environment variable name
- The system automatically retries failed messages 3 times

---

**Your WhatsApp Integration is 100% Ready!**
Just get the correct token and all messages will send automatically. 🚀

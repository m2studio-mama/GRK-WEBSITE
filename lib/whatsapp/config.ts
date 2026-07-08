/**
 * WhatsApp Business Cloud API Configuration
 * 
 * Required Environment Variables:
 * - WHATSAPP_BUSINESS_ACCOUNT_ID: Your WhatsApp Business Account ID
 * - WHATSAPP_PHONE_NUMBER_ID: Your WhatsApp Phone Number ID
 * - WHATSAPP_API_TOKEN: Your WhatsApp API Access Token
 */

export const WHATSAPP_CONFIG = {
  accountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  apiToken: process.env.WHATSAPP_API_TOKEN || '',
  apiVersion: 'v18.0',
};

export const WHATSAPP_API_BASE_URL = `https://graph.facebook.com/${WHATSAPP_CONFIG.apiVersion}/${WHATSAPP_CONFIG.phoneNumberId}/messages`;

export const isWhatsAppConfigured = (): boolean => {
  return !!(WHATSAPP_CONFIG.accountId && WHATSAPP_CONFIG.phoneNumberId && WHATSAPP_CONFIG.apiToken);
};

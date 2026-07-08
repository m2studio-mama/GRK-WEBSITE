import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key_for_grk_website';

// Helper to base64url encode
function base64url(str: string): string {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

// Helper to base64url decode
function base64urlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

// Convert string to ArrayBuffer
function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Sign a payload using HMAC SHA-256 (Web Crypto API)
export async function signJWT(payload: object, expiryMs = 3600000): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Date.now() + expiryMs;
  const fullPayload = { ...payload, exp };

  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(fullPayload));
  const dataToSign = `${headerB64}.${payloadB64}`;

  const keyBuffer = stringToBuffer(JWT_SECRET);
  const dataBuffer = stringToBuffer(dataToSign);

  // Import key
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign data
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
  const signatureB64 = base64url(String.fromCharCode(...new Uint8Array(signature)));

  return `${dataToSign}.${signatureB64}`;
}

// Verify a JWT token
export async function verifyJWT(token: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const dataToVerify = `${headerB64}.${payloadB64}`;

    const keyBuffer = stringToBuffer(JWT_SECRET);
    const dataBuffer = stringToBuffer(dataToVerify);

    // Import key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode signature
    const sigString = base64urlDecode(signatureB64);
    const sigBuffer = new Uint8Array(sigString.length);
    for (let i = 0; i < sigString.length; i++) {
      sigBuffer[i] = sigString.charCodeAt(i);
    }

    // Verify
    const isValid = await crypto.subtle.verify('HMAC', cryptoKey, sigBuffer, dataBuffer);
    if (!isValid) return null;

    // Decode payload
    const payload = JSON.parse(base64urlDecode(payloadB64));
    if (payload.exp && Date.now() > payload.exp) {
      console.warn('JWT has expired');
      return null;
    }

    return payload;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null;
  }
}

// Verify incoming NextRequest admin session
export async function verifyAdminRequest(req: NextRequest): Promise<any | null> {
  // 1. Try Authorization Header
  const authHeader = req.headers.get('Authorization');
  let token: string | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 2. Try Cookie
  if (!token) {
    const cookie = req.cookies.get('admin_session');
    if (cookie) {
      token = cookie.value;
    }
  }

  if (!token) return null;

  return await verifyJWT(token);
}

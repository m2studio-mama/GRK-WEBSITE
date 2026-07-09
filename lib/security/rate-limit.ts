import { NextRequest } from 'next/server';

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

const ipCache = new Map<string, RateLimitInfo>();

// Clean up expired entries every 5 minutes to prevent memory bloat
if (typeof global !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, info] of ipCache.entries()) {
      if (now > info.resetTime) {
        ipCache.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Checks if a request exceeds rate limits.
 * @param req The incoming request.
 * @param limit Maximum allowed requests in the window.
 * @param windowMs Time window in milliseconds (default: 1 minute).
 * @returns Object indicating if the request is allowed, current count, limit, and reset time.
 */
export function rateLimit(req: NextRequest, limit = 60, windowMs = 60 * 1000) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
  const now = Date.now();
  const cached = ipCache.get(ip);

  if (!cached || now > cached.resetTime) {
    const resetTime = now + windowMs;
    ipCache.set(ip, { count: 1, resetTime });
    return { success: true, count: 1, limit, reset: windowMs };
  }

  cached.count++;
  if (cached.count > limit) {
    return { 
      success: false, 
      count: cached.count, 
      limit, 
      reset: Math.max(0, cached.resetTime - now) 
    };
  }

  return { 
    success: true, 
    count: cached.count, 
    limit, 
    reset: Math.max(0, cached.resetTime - now) 
  };
}

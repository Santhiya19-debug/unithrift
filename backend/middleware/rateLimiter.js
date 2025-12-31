/**
 * Simple Rate Limiter for Resend Verification
 * Tracks requests per email with cooldown
 */
const rateLimitMap = new Map();

const COOLDOWN_MS = 60000; // 60 seconds

/**
 * Rate limit middleware
 * Limits requests per identifier (e.g., email)
 */
const rateLimit = (req, res, next) => {
  const identifier = req.body.email || req.ip;
  
  if (!identifier) {
    return next();
  }

  const now = Date.now();
  const lastRequest = rateLimitMap.get(identifier);

  if (lastRequest && (now - lastRequest) < COOLDOWN_MS) {
    const remainingSeconds = Math.ceil((COOLDOWN_MS - (now - lastRequest)) / 1000);
    return res.status(429).json({
      success: false,
      message: `Too many requests. Please try again in ${remainingSeconds} seconds.`
    });
  }

  rateLimitMap.set(identifier, now);
  
  // Clean up old entries periodically
  if (rateLimitMap.size > 10000) {
    const cutoff = now - COOLDOWN_MS;
    for (const [key, value] of rateLimitMap.entries()) {
      if (value < cutoff) {
        rateLimitMap.delete(key);
      }
    }
  }

  next();
};

module.exports = rateLimit;
import { errorResponse } from '../utils/response.js';

// In-memory store for rate limiting
const requestStore = new Map();

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestStore.entries()) {
    if (data.resetTime < now) {
      requestStore.delete(key);
    }
  }
}, 60 * 1000);

/**
 * Email rate limiter middleware
 * Limits verification email requests per email address
 */
export const emailRateLimiter = (options = {}) => {
  const {
    windowMs = 60 * 60 * 1000, // 1 hour default
    max = 3, // 3 requests per hour default
    message = 'Too many requests for this email. Please try again later.',
  } = options;

  return async (req, res, next) => {
    try {
      // Get email from request
      const email = (req.body.email || req.query.email || req.params.email || '').toLowerCase().trim();
      
      if (!email) {
        return next();
      }

      const now = Date.now();
      let rateLimitData = requestStore.get(email);

      // Create new window if expired or doesn't exist
      if (!rateLimitData || rateLimitData.resetTime < now) {
        rateLimitData = {
          count: 0,
          resetTime: now + windowMs,
        };
        requestStore.set(email, rateLimitData);
      }

      // Increment count
      rateLimitData.count++;

      // Check if limit exceeded
      if (rateLimitData.count > max) {
        const retryAfter = Math.ceil((rateLimitData.resetTime - now) / 1000);
        res.setHeader('Retry-After', retryAfter);
        
        return res.status(429).json(
          errorResponse(message, {
            retryAfter,
            limit: max,
          })
        );
      }

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      next(); // Continue on error
    }
  };
};

export default emailRateLimiter;


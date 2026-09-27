/**
 * In-memory sliding window rate limiter
 * Protects endpoints from DDoS, brute-force attacks, and API quota exhaustion.
 */
class RateLimiter {
  constructor(windowMs = 15 * 60 * 1000, maxRequests = 100, message = 'Too many requests, please try again later.') {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.message = message;
    this.hits = new Map();

    // Periodic cleanup of stale entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000).unref();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, records] of this.hits.entries()) {
      const valid = records.filter(timestamp => now - timestamp < this.windowMs);
      if (valid.length === 0) {
        this.hits.delete(key);
      } else {
        this.hits.set(key, valid);
      }
    }
  }

  middleware() {
    return (req, res, next) => {
      // Extract client IP (handle reverse proxies / X-Forwarded-For)
      const forwarded = req.headers['x-forwarded-for'];
      const clientIp = (forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress) || 'unknown-ip';
      const now = Date.now();

      const timestamps = this.hits.get(clientIp) || [];
      const validTimestamps = timestamps.filter(timestamp => now - timestamp < this.windowMs);

      if (validTimestamps.length >= this.maxRequests) {
        const oldest = validTimestamps[0];
        const retryAfterSeconds = Math.ceil((oldest + this.windowMs - now) / 1000);
        res.setHeader('Retry-After', retryAfterSeconds);
        res.setHeader('X-RateLimit-Limit', this.maxRequests);
        res.setHeader('X-RateLimit-Remaining', 0);
        return res.status(429).json({
          success: false,
          statusCode: 429,
          message: this.message,
          retryAfter: `${retryAfterSeconds} seconds`,
        });
      }

      validTimestamps.push(now);
      this.hits.set(clientIp, validTimestamps);

      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - validTimestamps.length));
      next();
    };
  }
}

// General API rate limiter: 300 requests per 15 minutes
export const apiLimiter = new RateLimiter(
  15 * 60 * 1000,
  300,
  'Too many requests from this IP, please try again after 15 minutes.'
).middleware();

// Auth rate limiter: 15 attempts per 15 minutes to prevent brute-force attacks
export const authLimiter = new RateLimiter(
  15 * 60 * 1000,
  15,
  'Too many authentication attempts, please try again in 15 minutes.'
).middleware();

// Chatbot rate limiter: 25 queries per 15 minutes to manage AI API quotas
export const chatbotLimiter = new RateLimiter(
  15 * 60 * 1000,
  25,
  'Chatbot request limit reached. Please wait a few moments before asking another question.'
).middleware();

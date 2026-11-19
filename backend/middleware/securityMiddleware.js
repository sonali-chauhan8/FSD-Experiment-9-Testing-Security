const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

/**
 * Helmet Security Configuration
 * Sets HTTP response headers: Content-Security-Policy, X-Frame-Options,
 * X-Content-Type-Options, Strict-Transport-Security, and Referrer-Policy.
 */
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Maintain compatibility with development tooling
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

/**
 * CORS Configuration based on CLIENT_URL environment variable
 */
const corsConfig = () => {
  const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];

  return cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        return callback(null, true);
      } else {
        return callback(new Error(`CORS Error: Origin ${origin} is not allowed by security policy.`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
};

/**
 * General API Rate Limiting Middleware
 * Protects endpoints against denial-of-service (DoS) and brute force spam
 */
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: process.env.NODE_ENV === 'test' ? 1000 : 200, // Max 200 requests per 15 min per IP
  standardHeaders: true, // Return standard RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

/**
 * Strict Rate Limiter for Data Modification (POST, PUT, DELETE)
 * Prevents automated database flooding and resource exhaustion
 */
const mutationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 60, // Max 60 write requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many student registration/modification attempts. Please wait before retrying.',
  },
});

module.exports = {
  helmetConfig,
  corsConfig,
  generalRateLimiter,
  mutationRateLimiter,
};

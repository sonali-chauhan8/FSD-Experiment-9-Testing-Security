/**
 * Centralized Error Handling Middleware for Experiment 9
 * Standardizes API error responses and prevents sensitive information leaks
 */

// Route Not Found Handler (404)
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource not found at endpoint: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Centralized Error Handler
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format: ${err.value}`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((val) => val.message);
    message = errors.join('. ');
  }

  // Handle MongoDB Duplicate Key (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `Duplicate value '${value}' for ${field}. Value must be unique.`;
  }

  // Handle CORS Origin Not Allowed
  if (err.message && err.message.startsWith('CORS Error')) {
    statusCode = 403;
  }

  // In production, do not leak error stack traces or raw internal server errors
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};

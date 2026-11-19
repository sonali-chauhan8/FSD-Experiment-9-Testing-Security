const express = require('express');
const { helmetConfig, corsConfig, generalRateLimiter } = require('./middleware/securityMiddleware');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// 1. Security HTTP Headers (Helmet)
app.use(helmetConfig);

// 2. Cross-Origin Resource Sharing (CORS) with origin validation
app.use(corsConfig());

// 3. Global API Rate Limiter
app.use('/api', generalRateLimiter);

// 4. Request Body Parsers with payload size limits (prevents payload DoS)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Development Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// 6. System Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'MERN Student Management Backend (Hardened) is active and running',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    security: {
      helmet: 'enabled',
      rateLimit: 'enabled',
      inputSanitization: 'enabled',
    },
  });
});

// 7. Mount Student API Routes
app.use('/api/students', studentRoutes);

// 8. Root Welcome & Discovery Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Student Management System API - Hardened & Tested (Experiment 9)',
    endpoints: {
      health: 'GET /api/health',
      allStudents: 'GET /api/students',
      stats: 'GET /api/students/stats',
      studentById: 'GET /api/students/:id',
      createStudent: 'POST /api/students',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id',
    },
  });
});

// 9. 404 Route Handler
app.use(notFoundHandler);

// 10. Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;

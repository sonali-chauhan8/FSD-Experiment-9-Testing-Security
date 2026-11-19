const request = require('supertest');
const app = require('../app');
const Student = require('../models/Student');
const { connectDB, disconnectDB } = require('../config/db');

const ISOLATED_TEST_DB_URI =
  process.env.TEST_MONGODB_URI ||
  'mongodb://127.0.0.1:27017/student_mgmt_exp9_isolated_test';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await connectDB(ISOLATED_TEST_DB_URI);
});

afterAll(async () => {
  await Student.deleteMany({ enrollmentNumber: '0101CS221777' });
  await disconnectDB();
});

describe('=== Backend Security & Hardening Test Suite (Experiment 9) ===', () => {
  // Test Helmet Headers
  describe('Helmet HTTP Security Headers', () => {
    it('should set X-Content-Type-Options: nosniff header', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should set X-Frame-Options header to protect against clickjacking', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    it('should set Content-Security-Policy header', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['content-security-policy']).toBeDefined();
    });

    it('should strip or hide sensitive server headers', async () => {
      const res = await request(app).get('/api/health');
      // Helmet removes or masks X-Powered-By
      expect(res.headers['x-powered-by']).toBeUndefined();
    });
  });

  // Test Rate Limiting
  describe('Express Rate Limiting Protection', () => {
    it('should attach rate limit headers to API responses', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['ratelimit-limit']).toBeDefined();
      expect(res.headers['ratelimit-remaining']).toBeDefined();
    });
  });

  // Test Centralized Error Handling & 404
  describe('Centralized Error & Route Handling', () => {
    it('should return standardized 404 JSON response for undefined routes', async () => {
      const res = await request(app).get('/api/undefined-endpoint-xyz');
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Resource not found/i);
    });

    it('should not expose stack traces when NODE_ENV is production', async () => {
      const previousEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const res = await request(app).get('/api/students/invalid-id-xyz');
      expect(res.statusCode).toBe(400);
      expect(res.body.stack).toBeUndefined();

      process.env.NODE_ENV = previousEnv;
    });
  });

  // Test Input Sanitization
  describe('Input Sanitization & Injection Prevention', () => {
    it('should sanitize HTML tags from student name to prevent XSS', async () => {
      const xssPayload = {
        name: '<script>alert("xss")</script>Akash',
        enrollmentNumber: '0101CS221777',
        email: 'akash.sec@college.edu',
        branch: 'Computer Science & Engineering',
        semester: 5,
        mobileNumber: '9876543210',
      };

      const res = await request(app)
        .post('/api/students')
        .send(xssPayload);

      expect(res.statusCode).toBe(201);
      expect(res.body.data.name).not.toContain('<script>');
      expect(res.body.data.name).toContain('&lt;script&gt;');
    });
  });
});

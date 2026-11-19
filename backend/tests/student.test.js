const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Student = require('../models/Student');
const { connectDB, disconnectDB } = require('../config/db');

// Strictly isolated test database URI - completely independent of Experiment 8
const ISOLATED_TEST_DB_URI =
  process.env.TEST_MONGODB_URI ||
  'mongodb://127.0.0.1:27017/student_mgmt_exp9_isolated_test';

let createdStudentId = null;

const sampleStudent = {
  name: 'Devanshu Sharma',
  enrollmentNumber: '0101CS221999',
  email: 'devanshu.sharma@college.edu',
  branch: 'Computer Science & Engineering',
  semester: 5,
  mobileNumber: '9876543210',
};

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await connectDB(ISOLATED_TEST_DB_URI);
  // Clean isolated test collection
  await Student.deleteMany({});
});

afterAll(async () => {
  // Clean isolated test database and disconnect cleanly
  await Student.deleteMany({});
  await disconnectDB();
});

describe('=== Backend Student API Test Suite (Experiment 9) ===', () => {
  // Health & Security Status
  describe('GET /api/health', () => {
    it('should return 200 and healthy server status with active security config', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.security).toBeDefined();
      expect(res.body.security.helmet).toBe('enabled');
    });
  });

  // POST /api/students (Create Student)
  describe('POST /api/students', () => {
    it('should create a new student record with valid payload (HTTP 201)', async () => {
      const res = await request(app)
        .post('/api/students')
        .send(sampleStudent);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.name).toBe(sampleStudent.name);
      expect(res.body.data.enrollmentNumber).toBe(sampleStudent.enrollmentNumber);

      createdStudentId = res.body.data._id;
    });

    it('should reject creation when required fields are missing (HTTP 400)', async () => {
      const invalidPayload = {
        name: 'Incomplete Student',
        // missing enrollmentNumber, email, branch, semester
      };

      const res = await request(app)
        .post('/api/students')
        .send(invalidPayload);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBeDefined();
    });

    it('should reject creation with an invalid email address (HTTP 400)', async () => {
      const invalidEmailStudent = {
        ...sampleStudent,
        enrollmentNumber: '0101CS221998',
        email: 'invalid-email-address',
      };

      const res = await request(app)
        .post('/api/students')
        .send(invalidEmailStudent);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject creation when semester is outside 1 to 8 (HTTP 400)', async () => {
      const invalidSemesterStudent = {
        ...sampleStudent,
        enrollmentNumber: '0101CS221997',
        semester: 10, // Invalid semester
      };

      const res = await request(app)
        .post('/api/students')
        .send(invalidSemesterStudent);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should prevent duplicate enrollment numbers (HTTP 400)', async () => {
      // Attempting to register the same enrollment number again
      const res = await request(app)
        .post('/api/students')
        .send(sampleStudent);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already registered|Duplicate/i);
    });
  });

  // GET /api/students (Retrieve All Students)
  describe('GET /api/students', () => {
    it('should retrieve an array of students with status 200', async () => {
      const res = await request(app).get('/api/students');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(1);
    });

    it('should support search query filtering by student name or enrollment number', async () => {
      const res = await request(app).get('/api/students?search=Devanshu');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].name).toBe('Devanshu Sharma');
    });

    it('should support filtering by branch', async () => {
      const res = await request(app).get('/api/students?branch=Computer%20Science%20%26%20Engineering');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].branch).toBe('Computer Science & Engineering');
    });
  });

  // GET /api/students/stats (Dashboard Analytics)
  describe('GET /api/students/stats', () => {
    it('should return aggregated dashboard statistics (HTTP 200)', async () => {
      const res = await request(app).get('/api/students/stats');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalStudents');
      expect(res.body.data).toHaveProperty('branchDistribution');
      expect(res.body.data).toHaveProperty('semesterDistribution');
    });
  });

  // GET /api/students/:id (Retrieve Single Student)
  describe('GET /api/students/:id', () => {
    it('should return a specific student record when valid ID is provided (HTTP 200)', async () => {
      const res = await request(app).get(`/api/students/${createdStudentId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(String(createdStudentId));
      expect(res.body.data.name).toBe(sampleStudent.name);
    });

    it('should return 400 when an invalid MongoDB ObjectId string is supplied', async () => {
      const res = await request(app).get('/api/students/not-a-valid-mongo-id');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid Student ID format/i);
    });

    it('should return 404 when student with valid ObjectId does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/students/${nonExistentId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // PUT /api/students/:id (Update Student)
  describe('PUT /api/students/:id', () => {
    it('should update student details with valid payload (HTTP 200)', async () => {
      const updateData = {
        name: 'Devanshu Sharma (Verified)',
        mobileNumber: '9123456789',
      };

      const res = await request(app)
        .put(`/api/students/${createdStudentId}`)
        .send(updateData);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Devanshu Sharma (Verified)');
      expect(res.body.data.mobileNumber).toBe('9123456789');
    });

    it('should return 400 when updating with an invalid semester value', async () => {
      const res = await request(app)
        .put(`/api/students/${createdStudentId}`)
        .send({ semester: 12 });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 when attempting to update a non-existent student', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/students/${nonExistentId}`)
        .send({ name: 'Phantom Student' });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // DELETE /api/students/:id (Delete Student)
  describe('DELETE /api/students/:id', () => {
    it('should delete student record successfully (HTTP 200)', async () => {
      const res = await request(app).delete(`/api/students/${createdStudentId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(String(createdStudentId));
    });

    it('should return 404 when trying to delete the already deleted student', async () => {
      const res = await request(app).delete(`/api/students/${createdStudentId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 when deleting with malformed ID', async () => {
      const res = await request(app).delete('/api/students/bad-id-123');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});

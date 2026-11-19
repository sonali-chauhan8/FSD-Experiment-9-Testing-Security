const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getDashboardStats,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

const {
  validateCreateStudent,
  validateUpdateStudent,
  validateStudentId,
} = require('../middleware/validationMiddleware');

const { mutationRateLimiter } = require('../middleware/securityMiddleware');

/**
 * Hardened REST API Routes for Students (Experiment 9)
 * Base URL: /api/students
 */

// Route for dashboard analytics / metrics
router.get('/stats', getDashboardStats);

// Routes for student collection: Read All (GET) & Create (POST)
router.route('/')
  .get(getAllStudents)
  .post(mutationRateLimiter, validateCreateStudent, createStudent);

// Routes for individual student document: Read One (GET), Update (PUT), Delete (DELETE)
router.route('/:id')
  .get(validateStudentId, getStudentById)
  .put(mutationRateLimiter, validateUpdateStudent, updateStudent)
  .delete(mutationRateLimiter, validateStudentId, deleteStudent);

module.exports = router;

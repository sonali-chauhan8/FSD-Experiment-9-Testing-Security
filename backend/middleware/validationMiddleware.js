const { body, param, validationResult } = require('express-validator');

// Supported engineering branches matching student schema
const ALLOWED_BRANCHES = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence & Data Science',
  'Other',
];

/**
 * Middleware to check validation results and return formatted HTTP 400 response
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // First user-friendly message
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for creating a student (POST /api/students)
 */
const validateCreateStudent = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Student full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),

  body('enrollmentNumber')
    .trim()
    .notEmpty()
    .withMessage('Enrollment number is required')
    .matches(/^[A-Za-z0-9_-]{4,20}$/)
    .withMessage('Enrollment number must be 4-20 alphanumeric characters (hyphens and underscores allowed)')
    .toUpperCase(),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('branch')
    .trim()
    .notEmpty()
    .withMessage('Engineering branch is required')
    .isIn(ALLOWED_BRANCHES)
    .withMessage(`Invalid branch selected. Must be one of: ${ALLOWED_BRANCHES.join(', ')}`),

  body('semester')
    .notEmpty()
    .withMessage('Semester is required')
    .isInt({ min: 1, max: 8 })
    .withMessage('Semester must be an integer between 1 and 8')
    .toInt(),

  body('mobileNumber')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9'),

  validate,
];

/**
 * Validation rules for updating a student (PUT /api/students/:id)
 */
const validateUpdateStudent = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Student ID format'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),

  body('enrollmentNumber')
    .optional()
    .trim()
    .matches(/^[A-Za-z0-9_-]{4,20}$/)
    .withMessage('Enrollment number must be 4-20 alphanumeric characters')
    .toUpperCase(),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('branch')
    .optional()
    .trim()
    .isIn(ALLOWED_BRANCHES)
    .withMessage('Invalid branch selected'),

  body('semester')
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage('Semester must be an integer between 1 and 8')
    .toInt(),

  body('mobileNumber')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Mobile number must be a valid 10-digit Indian number starting with 6, 7, 8, or 9'),

  validate,
];

/**
 * Validation rules for MongoDB ID in route parameters (GET / DELETE /api/students/:id)
 */
const validateStudentId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Student ID format'),

  validate,
];

module.exports = {
  validateCreateStudent,
  validateUpdateStudent,
  validateStudentId,
  ALLOWED_BRANCHES,
};

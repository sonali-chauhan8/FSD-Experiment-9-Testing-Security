const mongoose = require('mongoose');
const Student = require('../models/Student');

/**
 * Controller for Student Management System
 * Handles business logic, input validation, and database operations
 */

// @desc    Get all students (with optional search, filtering, and sorting)
// @route   GET /api/students
// @access  Public
const getAllStudents = async (req, res) => {
  try {
    const { search, branch, semester, sortBy } = req.query;
    const query = {};

    // Search by name or enrollment number
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { enrollmentNumber: searchRegex },
      ];
    }

    // Filter by branch
    if (branch && branch !== 'All') {
      query.branch = branch;
    }

    // Filter by semester
    if (semester && semester !== 'All') {
      const semNumber = parseInt(semester, 10);
      if (!isNaN(semNumber)) {
        query.semester = semNumber;
      }
    }

    // Sort order (default to most recently created first)
    let sortOption = { createdAt: -1 };
    if (sortBy === 'name_asc') sortOption = { name: 1 };
    else if (sortBy === 'name_desc') sortOption = { name: -1 };
    else if (sortBy === 'sem_asc') sortOption = { semester: 1 };
    else if (sortBy === 'sem_desc') sortOption = { semester: -1 };

    const students = await Student.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error('[Error in getAllStudents]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve students from database',
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics (branch & semester distribution, total counts)
// @route   GET /api/students/stats
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();

    // Group count by branch
    const branchStats = await Student.aggregate([
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Group count by semester
    const semesterStats = await Student.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // 5 most recent records
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        branchDistribution: branchStats.map((item) => ({
          branch: item._id,
          count: item.count,
        })),
        semesterDistribution: semesterStats.map((item) => ({
          semester: item._id,
          count: item.count,
        })),
        recentStudents,
      },
    });
  } catch (error) {
    console.error('[Error in getDashboardStats]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute dashboard statistics',
      error: error.message,
    });
  }
};

// @desc    Get a single student by ID
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Student ID format',
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID "${id}" was not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('[Error in getStudentById]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error fetching student record',
      error: error.message,
    });
  }
};

// @desc    Create / register a new student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res) => {
  try {
    const { name, enrollmentNumber, email, branch, semester, mobileNumber } = req.body;

    // Field existence validation
    if (!name || !enrollmentNumber || !email || !branch || semester === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Full Name, Enrollment No, Email, Branch, Semester',
      });
    }

    const formattedEnrollment = enrollmentNumber.trim().toUpperCase();

    // Check for duplicate enrollment number
    const existingStudent = await Student.findOne({
      enrollmentNumber: formattedEnrollment,
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: `A student with Enrollment Number "${formattedEnrollment}" is already registered.`,
      });
    }

    const newStudent = await Student.create({
      name: name.trim(),
      enrollmentNumber: formattedEnrollment,
      email: email.trim().toLowerCase(),
      branch: branch.trim(),
      semester: Number(semester),
      mobileNumber: mobileNumber ? mobileNumber.trim() : '',
    });

    return res.status(201).json({
      success: true,
      message: 'Student record created successfully!',
      data: newStudent,
    });
  } catch (error) {
    console.error('[Error in createStudent]:', error.message);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. '),
      });
    }

    // Duplicate key error (MongoDB code 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate key error: Enrollment number must be unique.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create student record',
      error: error.message,
    });
  }
};

// @desc    Update an existing student record
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, enrollmentNumber, email, branch, semester, mobileNumber } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Student ID format',
      });
    }

    // Check if student exists
    const existingStudent = await Student.findById(id);
    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID "${id}" was not found`,
      });
    }

    // If enrollmentNumber changed, ensure uniqueness
    if (enrollmentNumber) {
      const formattedEnrollment = enrollmentNumber.trim().toUpperCase();
      const conflict = await Student.findOne({
        enrollmentNumber: formattedEnrollment,
        _id: { $ne: id },
      });
      if (conflict) {
        return res.status(400).json({
          success: false,
          message: `Enrollment Number "${formattedEnrollment}" is already used by another student.`,
        });
      }
    }

    // Prepare update payload
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (enrollmentNumber) updateData.enrollmentNumber = enrollmentNumber.trim().toUpperCase();
    if (email) updateData.email = email.trim().toLowerCase();
    if (branch) updateData.branch = branch.trim();
    if (semester !== undefined) updateData.semester = Number(semester);
    if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber.trim();

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Student record updated successfully!',
      data: updatedStudent,
    });
  } catch (error) {
    console.error('[Error in updateStudent]:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update student record',
      error: error.message,
    });
  }
};

// @desc    Delete a student record
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Student ID format',
      });
    }

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID "${id}" was not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Student "${deletedStudent.name}" (${deletedStudent.enrollmentNumber}) removed successfully`,
      data: { id: deletedStudent._id },
    });
  } catch (error) {
    console.error('[Error in deleteStudent]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete student record',
      error: error.message,
    });
  }
};

module.exports = {
  getAllStudents,
  getDashboardStats,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};

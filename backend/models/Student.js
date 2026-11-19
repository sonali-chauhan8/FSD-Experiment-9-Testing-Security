const mongoose = require('mongoose');

/**
 * Student Schema definition for Experiment No. 8
 * Defines the structure, types, validations, and constraints for student records
 */
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    enrollmentNumber: {
      type: String,
      required: [true, 'Enrollment number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
      match: [/^[A-Za-z0-9_-]{4,20}$/, 'Enrollment number must be 4-20 alphanumeric characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    branch: {
      type: String,
      required: [true, 'Engineering branch is required'],
      trim: true,
      enum: {
        values: [
          'Computer Science & Engineering',
          'Information Technology',
          'Electronics & Communication Engineering',
          'Electrical Engineering',
          'Mechanical Engineering',
          'Civil Engineering',
          'Artificial Intelligence & Data Science',
          'Other',
        ],
        message: '{VALUE} is not a supported branch',
      },
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },
    mobileNumber: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: function (v) {
          // If provided, must be a 10-digit number
          return !v || /^[6-9]\d{9}$/.test(v);
        },
        message: 'Mobile number must be a valid 10-digit number (starting with 6, 7, 8, or 9)',
      },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Helpful virtual or formatting if needed
studentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Student', studentSchema);

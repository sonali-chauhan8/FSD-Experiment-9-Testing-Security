import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const BRANCH_OPTIONS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence & Data Science',
  'Other',
];

const StudentModal = ({ isOpen, student, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNumber: '',
    email: '',
    branch: 'Computer Science & Engineering',
    semester: 5,
    mobileNumber: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        enrollmentNumber: student.enrollmentNumber || '',
        email: student.email || '',
        branch: student.branch || 'Computer Science & Engineering',
        semester: student.semester || 5,
        mobileNumber: student.mobileNumber || '',
      });
      setFormErrors({});
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.enrollmentNumber.trim()) errors.enrollmentNumber = 'Enrollment number is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.branch) errors.branch = 'Branch is required';
    if (!formData.semester || formData.semester < 1 || formData.semester > 8) {
      errors.semester = 'Semester must be between 1 and 8';
    }
    if (formData.mobileNumber && !/^[6-9]\d{9}$/.test(formData.mobileNumber.trim())) {
      errors.mobileNumber = 'Mobile must be a valid 10-digit number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'semester' ? Number(value) : value,
    }));
    // Clear error for field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(student._id, formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Edit Student Record</h3>
            <p className="text-xs text-slate-500">
              MongoDB Document ID: <code className="text-slate-600 font-mono">{student._id}</code>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  formErrors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                placeholder="e.g. Rahul Sharma"
              />
              {formErrors.name && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.name}
                </p>
              )}
            </div>

            {/* Enrollment Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Enrollment Number *
              </label>
              <input
                type="text"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-xl border font-mono uppercase ${
                  formErrors.enrollmentNumber ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                placeholder="e.g. 0101CS221045"
              />
              {formErrors.enrollmentNumber && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.enrollmentNumber}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  formErrors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                placeholder="student@college.edu"
              />
              {formErrors.email && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.email}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                maxLength="10"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  formErrors.mobileNumber ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                placeholder="10-digit mobile number"
              />
              {formErrors.mobileNumber && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {formErrors.mobileNumber}
                </p>
              )}
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Branch *
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {BRANCH_OPTIONS.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem} {sem === 5 ? '(Current FSD Lab)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Updating...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, RotateCcw, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { studentService } from '../services/api';
import AlertNotification from '../components/AlertNotification';

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

const INITIAL_FORM_STATE = {
  name: '',
  enrollmentNumber: '',
  email: '',
  branch: 'Computer Science & Engineering',
  semester: 5,
  mobileNumber: '',
};

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!formData.enrollmentNumber.trim()) {
      errs.enrollmentNumber = 'Enrollment number is required';
    } else if (!/^[A-Za-z0-9_-]{4,20}$/.test(formData.enrollmentNumber.trim())) {
      errs.enrollmentNumber = 'Enrollment number must be 4-20 alphanumeric characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.branch) {
      errs.branch = 'Branch selection is required';
    }

    if (!formData.semester || formData.semester < 1 || formData.semester > 8) {
      errs.semester = 'Semester must be between 1 and 8';
    }

    if (formData.mobileNumber.trim()) {
      if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.trim())) {
        errs.mobileNumber = 'Mobile number must be a valid 10-digit Indian number (starts with 6-9)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'semester' ? Number(value) : value,
    }));
    // Clear field-specific validation error on user keystroke
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError(null);
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setServerError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      setServerError(null);
      const res = await studentService.createStudent(formData);
      if (res.success) {
        setSuccessMessage(`Student "${res.data.name}" (${res.data.enrollmentNumber}) was successfully registered in MongoDB!`);
        setFormData(INITIAL_FORM_STATE);
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/students"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Student Records</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Register New Student
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit form data via <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-xs">POST /api/students</code> to store a new document in MongoDB.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-5 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-semibold text-sm">{successMessage}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  to="/students"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                >
                  View All Records →
                </Link>
                <button
                  type="button"
                  onClick={() => setSuccessMessage(null)}
                  className="px-3 py-1.5 rounded-lg bg-white text-emerald-700 border border-emerald-300 font-medium hover:bg-emerald-50"
                >
                  Register Another Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {serverError && (
        <AlertNotification
          type="error"
          message={serverError}
          onClose={() => setServerError(null)}
        />
      )}

      {/* Card Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Priyanshu Verma"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    errors.name
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500'
                  } focus:outline-none focus:ring-2`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Enrollment Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enrollment Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="enrollmentNumber"
                  value={formData.enrollmentNumber}
                  onChange={handleChange}
                  placeholder="e.g. 0101CS221045"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono uppercase transition-all ${
                    errors.enrollmentNumber
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500'
                  } focus:outline-none focus:ring-2`}
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Unique institutional roll / enrollment ID
                </span>
                {errors.enrollmentNumber && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.enrollmentNumber}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@college.edu.in"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    errors.email
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500'
                  } focus:outline-none focus:ring-2`}
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Valid institutional or personal email
                </span>
                {errors.email && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Branch */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Branch / Department <span className="text-rose-500">*</span>
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                >
                  {BRANCH_OPTIONS.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.branch}
                  </p>
                )}
              </div>

              {/* Semester */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Semester <span className="text-rose-500">*</span>
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem} {sem === 5 ? '(FSD Lab Experiment)' : ''}
                    </option>
                  ))}
                </select>
                {errors.semester && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.semester}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  maxLength="10"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number (e.g. 9876543210)"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    errors.mobileNumber
                      ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-sky-500 focus:ring-sky-500'
                  } focus:outline-none focus:ring-2`}
                />
                {errors.mobileNumber && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" /> {errors.mobileNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Form</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-500/25 transition-all disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering...' : 'Save to MongoDB'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;

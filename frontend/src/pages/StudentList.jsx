import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, RotateCcw, UserPlus, RefreshCw, AlertCircle, FileSpreadsheet } from 'lucide-react';
import StudentTable from '../components/StudentTable';
import StudentModal from '../components/StudentModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertNotification from '../components/AlertNotification';
import { studentService } from '../services/api';

const BRANCH_OPTIONS = [
  'All',
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Artificial Intelligence & Data Science',
  'Other',
];

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');

  // Modals state
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification alerts
  const [alert, setAlert] = useState({ type: 'success', message: '' });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAllStudents();
      if (res.success) {
        setStudents(res.data || []);
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Failed to fetch student records from backend.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term, branch, and semester
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search matching (name or enrollmentNumber)
      const matchesSearch =
        searchTerm.trim() === '' ||
        student.name?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        student.enrollmentNumber?.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase().trim());

      // Branch filter
      const matchesBranch =
        selectedBranch === 'All' || student.branch === selectedBranch;

      // Semester filter
      const matchesSemester =
        selectedSemester === 'All' ||
        String(student.semester) === String(selectedSemester);

      return matchesSearch && matchesBranch && matchesSemester;
    });
  }, [students, searchTerm, selectedBranch, selectedSemester]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBranch('All');
    setSelectedSemester('All');
  };

  // Edit handler
  const handleOpenEdit = (student) => {
    setEditingStudent(student);
  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      setIsSaving(true);
      const res = await studentService.updateStudent(id, updatedData);
      if (res.success) {
        // Update local state smoothly
        setStudents((prev) =>
          prev.map((s) => (s._id === id ? res.data : s))
        );
        setEditingStudent(null);
        setAlert({
          type: 'success',
          message: `Student "${res.data.name}" record updated successfully in MongoDB.`,
        });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Failed to update student record.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handler
  const handleOpenDelete = (student) => {
    setDeletingStudent(student);
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    try {
      setIsDeleting(true);
      const res = await studentService.deleteStudent(deletingStudent._id);
      if (res.success) {
        setStudents((prev) =>
          prev.filter((s) => s._id !== deletingStudent._id)
        );
        const deletedName = deletingStudent.name;
        setDeletingStudent(null);
        setAlert({
          type: 'success',
          message: `Student "${deletedName}" removed permanently from database.`,
        });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Failed to delete student.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Records Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, search, filter, edit, and delete student documents stored in MongoDB collection.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStudents}
            title="Refresh student records from MongoDB"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <Link
            to="/add-student"
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-colors shadow-sm shadow-sky-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </Link>
        </div>
      </div>

      {/* Alert Notifications */}
      {alert.message && (
        <AlertNotification
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ type: 'success', message: '' })}
        />
      )}

      {/* Filter and Search Bar Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, enrollment no, or email..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Branch Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Branches</option>
              {BRANCH_OPTIONS.filter((b) => b !== 'All').map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="All">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          <div className="sm:col-span-1 flex items-center justify-end">
            <button
              onClick={handleResetFilters}
              title="Reset search and filters"
              className="w-full sm:w-auto p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center border border-slate-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Counter and status */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <p>
            Showing <span className="font-bold text-slate-800">{filteredStudents.length}</span> of{' '}
            <span className="font-bold text-slate-800">{students.length}</span> total student records
          </p>
          {(searchTerm || selectedBranch !== 'All' || selectedSemester !== 'All') && (
            <span className="font-semibold text-sky-600 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filters active
            </span>
          )}
        </div>
      </div>

      {/* Main Student Records Content */}
      {loading ? (
        <LoadingSpinner message="Fetching students from MongoDB..." />
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Edit Student Modal */}
      <StudentModal
        isOpen={Boolean(editingStudent)}
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingStudent)}
        student={deletingStudent}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingStudent(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default StudentList;

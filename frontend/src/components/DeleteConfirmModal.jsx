import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, student, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-rose-600">
            <div className="p-2 rounded-lg bg-rose-50">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Confirm Delete</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete this student record from MongoDB?
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm space-y-1">
            <p className="font-semibold text-slate-800">{student.name}</p>
            <p className="text-xs text-slate-500 font-mono">
              Enrollment: <span className="font-bold text-slate-700">{student.enrollmentNumber}</span>
            </p>
            <p className="text-xs text-slate-500">
              Branch: <span className="text-slate-700">{student.branch}</span> (Sem {student.semester})
            </p>
          </div>
          <p className="text-xs text-rose-500 font-medium">
            This action cannot be undone and will execute <code className="bg-rose-50 px-1 py-0.5 rounded">DELETE /api/students/:id</code>.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Student'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

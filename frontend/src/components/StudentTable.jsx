import React from 'react';
import { Edit2, Trash2, Mail, Phone, User, BookOpen } from 'lucide-react';

const StudentTable = ({ students = [], onEdit, onDelete }) => {
  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
          <User className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">No Student Records Found</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          No students match your search or filter criteria. Try clearing filters or add a new student.
        </p>
      </div>
    );
  }

  // Helper to generate consistent avatar background colors
  const getAvatarColor = (name) => {
    const colors = [
      'bg-sky-500 text-white',
      'bg-indigo-500 text-white',
      'bg-emerald-500 text-white',
      'bg-amber-500 text-white',
      'bg-rose-500 text-white',
      'bg-purple-500 text-white',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4 sm:px-6">Student</th>
              <th className="py-3.5 px-4">Enrollment No</th>
              <th className="py-3.5 px-4">Branch</th>
              <th className="py-3.5 px-4 text-center">Semester</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {students.map((student) => (
              <tr
                key={student._id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* Name & Avatar */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm ${getAvatarColor(
                        student.name
                      )}`}
                    >
                      {getInitials(student.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {student.name}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        ID: {student._id.slice(-6)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Enrollment Number */}
                <td className="py-4 px-4">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {student.enrollmentNumber}
                  </span>
                </td>

                {/* Branch */}
                <td className="py-4 px-4">
                  <span className="inline-block max-w-[200px] truncate text-slate-700 font-medium" title={student.branch}>
                    {student.branch}
                  </span>
                </td>

                {/* Semester */}
                <td className="py-4 px-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      student.semester === 5
                        ? 'bg-sky-100 text-sky-800 border border-sky-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    Sem {student.semester}
                  </span>
                </td>

                {/* Contact: Email & Mobile */}
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <a
                      href={`mailto:${student.email}`}
                      className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-sky-600 truncate max-w-[190px]"
                      title={student.email}
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{student.email}</span>
                    </a>
                    {student.mobileNumber && (
                      <a
                        href={`tel:${student.mobileNumber}`}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 font-mono"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{student.mobileNumber}</span>
                      </a>
                    )}
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="py-4 px-4 sm:px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onEdit(student)}
                      title="Edit Student Details"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(student)}
                      title="Delete Student Record"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;

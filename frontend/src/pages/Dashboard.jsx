import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Layers, UserPlus, ArrowRight, RefreshCw, Sparkles, GraduationCap } from 'lucide-react';
import StatCard from '../components/StatCard';
import BranchBarChart from '../components/BranchBarChart';
import SemesterDistribution from '../components/SemesterDistribution';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertNotification from '../components/AlertNotification';
import { studentService } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await studentService.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Aggregating MongoDB statistics..." />;
  }

  const total = stats?.totalStudents || 0;
  const branchCount = stats?.branchDistribution?.length || 0;
  const semesterCount = stats?.semesterDistribution?.length || 0;
  const recentStudents = stats?.recentStudents || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
              Lab Experiment No. 8
            </span>
            <span className="text-xs text-slate-400">• Full Stack Development</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic Performance & Enrollment Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time analytics fetched from MongoDB Atlas through Node/Express REST API endpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            title="Refresh statistics from MongoDB"
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
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

      {/* Error notification if backend is down */}
      {error && (
        <AlertNotification
          type="error"
          message={error}
          onClose={() => setError(null)}
          autoClose={false}
        />
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={total}
          icon={Users}
          color="blue"
          subtitle="Enrolled in MongoDB"
        />
        <StatCard
          title="Branches Active"
          value={branchCount}
          icon={Layers}
          color="purple"
          subtitle="Engineering disciplines"
        />
        <StatCard
          title="Semesters Represented"
          value={semesterCount}
          icon={BookOpen}
          color="emerald"
          subtitle="Semesters 1 through 8"
        />
        <StatCard
          title="Current Lab Sem"
          value="Sem 5"
          icon={GraduationCap}
          color="amber"
          subtitle="Full Stack Development"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Enrollment by Branch</h2>
              <p className="text-xs text-slate-500">Distribution of students across engineering streams</p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600">
              {branchCount} Branches
            </span>
          </div>
          <BranchBarChart data={stats?.branchDistribution} total={total} />
        </div>

        {/* Semester Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Students by Semester</h2>
              <p className="text-xs text-slate-500">Semester-wise cohort distribution (1 - 8)</p>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600">
              Sem 1 - 8
            </span>
          </div>
          <SemesterDistribution data={stats?.semesterDistribution} total={total} />
        </div>
      </div>

      {/* Recent Admissions Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Recent Admissions
            </h2>
            <p className="text-xs text-slate-500">Latest student records registered in MongoDB database</p>
          </div>
          <Link
            to="/students"
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700"
          >
            <span>View All Records</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentStudents.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">No students registered yet.</p>
            <Link
              to="/add-student"
              className="inline-block mt-2 text-xs font-semibold text-sky-600 hover:underline"
            >
              Register your first student →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="text-xs text-slate-400 font-semibold uppercase border-b border-slate-100">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Enrollment No</th>
                  <th className="pb-3">Branch</th>
                  <th className="pb-3 text-center">Semester</th>
                  <th className="pb-3 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentStudents.map((st) => (
                  <tr key={st._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 font-semibold text-slate-800">{st.name}</td>
                    <td className="py-3 font-mono text-xs text-slate-600">{st.enrollmentNumber}</td>
                    <td className="py-3 text-slate-600">{st.branch}</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-100 font-medium text-slate-700">
                        Sem {st.semester}
                      </span>
                    </td>
                    <td className="py-3 text-right text-xs text-slate-400">
                      {st.createdAt ? new Date(st.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Layers } from 'lucide-react';

const BranchBarChart = ({ data = [], total = 0 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <Layers className="w-10 h-10 mb-2 stroke-1" />
        <p className="text-sm font-medium">No branch data available</p>
        <p className="text-xs text-slate-400">Add student records to see branch analytics</p>
      </div>
    );
  }

  // Find max count for proportional scaling
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const colors = [
    'from-sky-500 to-blue-600',
    'from-indigo-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-sky-600',
    'from-violet-500 to-fuchsia-600',
  ];

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
        const barWidth = Math.round((item.count / maxCount) * 100);
        const gradient = colors[index % colors.length];

        return (
          <div key={item.branch || index} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-700 truncate max-w-[240px]" title={item.branch}>
                {item.branch}
              </span>
              <span className="text-slate-500 font-mono">
                {item.count} {item.count === 1 ? 'student' : 'students'} ({percentage}%)
              </span>
            </div>

            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 ease-out`}
                style={{ width: `${Math.max(barWidth, 4)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BranchBarChart;

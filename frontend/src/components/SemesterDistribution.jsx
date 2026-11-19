import React from 'react';
import { BookOpen } from 'lucide-react';

const SemesterDistribution = ({ data = [], total = 0 }) => {
  // Pre-fill semesters 1 to 8 so all semesters are visualized
  const semesterMap = {};
  for (let s = 1; s <= 8; s++) {
    semesterMap[s] = 0;
  }
  data.forEach((item) => {
    if (item.semester >= 1 && item.semester <= 8) {
      semesterMap[item.semester] = item.count;
    }
  });

  const maxVal = Math.max(...Object.values(semesterMap), 1);

  return (
    <div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
          const count = semesterMap[sem];
          const heightPercent = total > 0 ? Math.max((count / maxVal) * 100, 10) : 10;
          const isFifthSem = sem === 5; // Highlight 5th semester (lab semester)

          return (
            <div key={sem} className="flex flex-col items-center group">
              <span className="text-[11px] font-mono font-bold text-slate-700 mb-1">
                {count}
              </span>

              {/* Column Bar Container */}
              <div className="w-full h-28 bg-slate-100 rounded-lg p-1 flex items-end justify-center border border-slate-200">
                <div
                  className={`w-full rounded-md transition-all duration-500 ease-out ${
                    count > 0
                      ? isFifthSem
                        ? 'bg-gradient-to-t from-sky-600 to-indigo-500 shadow-sm'
                        : 'bg-gradient-to-t from-slate-400 to-slate-500'
                      : 'bg-slate-200/60'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                  title={`Semester ${sem}: ${count} student(s)`}
                />
              </div>

              {/* Semester Label */}
              <span
                className={`mt-2 text-xs font-semibold px-2 py-0.5 rounded ${
                  isFifthSem
                    ? 'bg-sky-100 text-sky-800 font-bold border border-sky-300'
                    : 'text-slate-600'
                }`}
              >
                Sem {sem}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-slate-400 mt-4 font-medium">
        * Semester 5 highlighted for B.Tech V-Sem Full Stack Development Lab
      </p>
    </div>
  );
};

export default SemesterDistribution;

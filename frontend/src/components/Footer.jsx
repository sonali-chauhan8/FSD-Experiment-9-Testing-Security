import React from 'react';
import { Database, Server, Code, Layers } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-800">
              B.Tech Fifth-Semester Full Stack Development Lab
            </p>
            <p className="text-xs text-slate-500">
              Experiment No. 8: Integration of React Front-End with Express.js & MongoDB Atlas Back-End
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 font-medium border border-sky-100">
              <Code className="w-3.5 h-3.5" /> React + Vite
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-100">
              <Server className="w-3.5 h-3.5" /> Node + Express
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-700 font-medium border border-green-100">
              <Database className="w-3.5 h-3.5" /> MongoDB Atlas
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-medium border border-purple-100">
              <Layers className="w-3.5 h-3.5" /> Tailwind CSS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

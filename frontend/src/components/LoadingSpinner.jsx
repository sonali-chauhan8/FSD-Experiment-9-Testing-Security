import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading student records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
      <Loader2 className="w-9 h-9 text-sky-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
      <p className="text-xs text-slate-400 mt-1">Connecting to MongoDB via Express API...</p>
    </div>
  );
};

export default LoadingSpinner;

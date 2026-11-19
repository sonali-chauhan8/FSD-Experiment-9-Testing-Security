import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const AlertNotification = ({ type = 'success', message, onClose, autoClose = 5000 }) => {
  useEffect(() => {
    if (!autoClose || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, autoClose);
    return () => clearTimeout(timer);
  }, [autoClose, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`flex items-start justify-between p-4 mb-4 rounded-xl border shadow-sm transition-all animate-fadeIn ${
        isSuccess
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-rose-50 text-rose-800 border-rose-200'
      }`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
        )}
        <div className="text-sm font-medium">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 rounded-md transition-colors hover:bg-black/5 ${
            isSuccess ? 'text-emerald-700' : 'text-rose-700'
          }`}
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default AlertNotification;

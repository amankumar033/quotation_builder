// components/Toast.tsx
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (title: string, message: string, duration?: number) => void;
  error: (title: string, message: string, duration?: number) => void;
  info: (title: string, message: string, duration?: number) => void;
  warning: (title: string, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, title: string, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toastFunctions = {
    success: (title: string, message: string, duration?: number) => 
      addToast('success', title, message, duration),
    error: (title: string, message: string, duration?: number) => 
      addToast('error', title, message, duration),
    info: (title: string, message: string, duration?: number) => 
      addToast('info', title, message, duration),
    warning: (title: string, message: string, duration?: number) => 
      addToast('warning', title, message, duration),
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, ...toastFunctions }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Individual Toast Component
const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const [progress, setProgress] = useState(100);

  const toastConfig = {
    success: {
      bgColor: 'bg-green-100 border border-green-200',
      accentColor: 'bg-green-400',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
    },
    error: {
      bgColor: 'bg-red-100 border border-red-200',
      accentColor: 'bg-red-500',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
    },
    info: {
      bgColor: 'bg-blue-100 border border-blue-200',
      accentColor: 'bg-blue-500',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    },
    warning: {
      bgColor: 'bg-yellow-100 border border-yellow-200',
      accentColor: 'bg-yellow-400',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
    }
  };

  const config = toastConfig[toast.type];
  const duration = toast.duration || 5000;

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), duration);
    
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 50));
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [toast.id, duration, onRemove]);

  return (
    <div className={`
      relative pl-5 pr-4 pt-3 rounded-lg shadow-sm transform transition-all duration-300
      ${config.bgColor} animate-in slide-in-from-right-8 max-w-sm w-full
      border-l-4 ${config.accentColor} border-l-4
    `}>
      {/* Left accent border is handled in the main div */}
      
      <div className="flex items-start">
        <div className={`flex-shrink-0 mt-0.5 text-white p-1 rounded-full ${config.accentColor}`}>
          {config.icon}
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          <h3 className={`text-sm font-semibold text-white`}>
            {toast.title}
          </h3>
          <p className={`mt-1 text-sm text-white
          }`}>
            {toast.message}
          </p>
        </div>
        
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-4 flex-shrink-0 mt-2 inline-flex text-white hover:text-gray-400 
                     transition-colors duration-200 rounded-full hover:bg-gray-100 p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div 
          className={`h-1 rounded-full transition-all duration-50 ${config.accentColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Toast Container
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastItem;
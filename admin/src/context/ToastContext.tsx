import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, title: string, message?: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, type, title, message, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => showToast('success', title, message), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast('error', title, message, 5000), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast('info', title, message), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast('warning', title, message, 4500), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, removeToast }}>
      {children}
      {/* Floating Toast Container */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '420px',
          width: 'calc(100vw - 48px)',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => {
          const config = {
            success: {
              bg: 'linear-gradient(135deg, rgba(13, 30, 25, 0.96) 0%, rgba(10, 24, 20, 0.98) 100%)',
              border: 'rgba(34, 197, 94, 0.4)',
              glow: '0 8px 32px rgba(34, 197, 94, 0.15)',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
              titleColor: '#34d399',
            },
            error: {
              bg: 'linear-gradient(135deg, rgba(35, 15, 18, 0.96) 0%, rgba(26, 10, 12, 0.98) 100%)',
              border: 'rgba(239, 68, 68, 0.4)',
              glow: '0 8px 32px rgba(239, 68, 68, 0.15)',
              icon: <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
              titleColor: '#f87171',
            },
            warning: {
              bg: 'linear-gradient(135deg, rgba(35, 28, 12, 0.96) 0%, rgba(26, 20, 8, 0.98) 100%)',
              border: 'rgba(245, 158, 11, 0.4)',
              glow: '0 8px 32px rgba(245, 158, 11, 0.15)',
              icon: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
              titleColor: '#fbbf24',
            },
            info: {
              bg: 'linear-gradient(135deg, rgba(14, 28, 42, 0.96) 0%, rgba(10, 20, 32, 0.98) 100%)',
              border: 'rgba(56, 189, 248, 0.4)',
              glow: '0 8px 32px rgba(56, 189, 248, 0.15)',
              icon: <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />,
              titleColor: '#38bdf8',
            },
          }[toast.type];

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                background: config.bg,
                border: `1px solid ${config.border}`,
                boxShadow: config.glow,
                backdropFilter: 'blur(16px)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                animation: 'slideInToast 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                color: '#e2e8f0',
              }}
            >
              {config.icon}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: config.titleColor, lineHeight: 1.3 }}>
                  {toast.title}
                </div>
                {toast.message && (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '3px', lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {toast.message}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '2px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#e2e8f0')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

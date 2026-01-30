import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

// --- Types ---
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
    showSuccess: (title: string, message?: string) => void;
    showError: (title: string, message?: string) => void;
    showWarning: (title: string, message?: string) => void;
    showInfo: (title: string, message?: string) => void;
}

// --- Context ---
const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

// --- Toast Item Component ---
const toastStyles: Record<ToastType, { bg: string; icon: string; iconColor: string; border: string }> = {
    success: {
        bg: 'bg-green-500/10',
        icon: 'solar:check-circle-linear',
        iconColor: 'text-green-500',
        border: 'border-green-500/30'
    },
    error: {
        bg: 'bg-red-600/10',
        icon: 'solar:close-circle-linear',
        iconColor: 'text-red-600',
        border: 'border-red-600/30'
    },
    warning: {
        bg: 'bg-orange-500/10',
        icon: 'solar:danger-triangle-linear',
        iconColor: 'text-orange-500',
        border: 'border-orange-500/30'
    },
    info: {
        bg: 'bg-blue-500/10',
        icon: 'solar:info-circle-linear',
        iconColor: 'text-blue-500',
        border: 'border-blue-500/30'
    }
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
    const style = toastStyles[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`${style.bg} ${style.border} border backdrop-blur-md rounded-sm p-4 flex items-start gap-3 min-w-[320px] max-w-[400px] shadow-lg`}
        >
            <Icon icon={style.icon} className={`${style.iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-textMain uppercase tracking-wider">{toast.title}</p>
                {toast.message && (
                    <p className="text-xs text-textMuted mt-1">{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-textMuted hover:text-textMain transition-colors flex-shrink-0"
            >
                <Icon icon="solar:close-circle-linear" className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

// --- Toast Provider ---
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((type: ToastType, title: string, message?: string, duration = 4000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const newToast: Toast = { id, type, title, message, duration };

        setToasts(prev => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => dismissToast(id), duration);
        }
    }, [dismissToast]);

    const showSuccess = useCallback((title: string, message?: string) => showToast('success', title, message), [showToast]);
    const showError = useCallback((title: string, message?: string) => showToast('error', title, message), [showToast]);
    const showWarning = useCallback((title: string, message?: string) => showToast('warning', title, message), [showToast]);
    const showInfo = useCallback((title: string, message?: string) => showToast('info', title, message), [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
            {children}
            {/* Toast Container - Fixed position at top right */}
            <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                    {toasts.map(toast => (
                        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;

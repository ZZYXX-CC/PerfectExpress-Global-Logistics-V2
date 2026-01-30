import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

// --- Types ---
interface ConfirmOptions {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmStyle?: 'danger' | 'primary';
}

interface ConfirmContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
    prompt: (title: string, message: string, defaultValue?: string) => Promise<string | null>;
}

// --- Context ---
const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) throw new Error('useConfirm must be used within ConfirmProvider');
    return context;
};

// --- Dialog Component ---
interface DialogState {
    isOpen: boolean;
    type: 'confirm' | 'prompt';
    options: ConfirmOptions;
    defaultValue?: string;
    resolve: ((value: boolean | string | null) => void) | null;
}

const initialState: DialogState = {
    isOpen: false,
    type: 'confirm',
    options: { title: '', message: '' },
    resolve: null
};

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<DialogState>(initialState);
    const [promptValue, setPromptValue] = useState('');

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({
                isOpen: true,
                type: 'confirm',
                options,
                resolve: resolve as (value: boolean | string | null) => void
            });
        });
    }, []);

    const prompt = useCallback((title: string, message: string, defaultValue = ''): Promise<string | null> => {
        setPromptValue(defaultValue);
        return new Promise((resolve) => {
            setState({
                isOpen: true,
                type: 'prompt',
                options: { title, message },
                defaultValue,
                resolve: resolve as (value: boolean | string | null) => void
            });
        });
    }, []);

    const handleConfirm = () => {
        if (state.type === 'confirm') {
            state.resolve?.(true);
        } else {
            state.resolve?.(promptValue);
        }
        setState(initialState);
        setPromptValue('');
    };

    const handleCancel = () => {
        if (state.type === 'confirm') {
            state.resolve?.(false);
        } else {
            state.resolve?.(null);
        }
        setState(initialState);
        setPromptValue('');
    };

    return (
        <ConfirmContext.Provider value={{ confirm, prompt }}>
            {children}
            <AnimatePresence>
                {state.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998] flex items-center justify-center p-6"
                        onClick={handleCancel}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-bgSurface border border-borderColor rounded-sm p-6 max-w-md w-full shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className={`p-2 rounded-sm ${state.options.confirmStyle === 'danger' ? 'bg-red-600/20' : 'bg-neutral-800'}`}>
                                    <Icon
                                        icon={state.options.confirmStyle === 'danger' ? 'solar:danger-triangle-linear' : 'solar:question-circle-linear'}
                                        className={`w-6 h-6 ${state.options.confirmStyle === 'danger' ? 'text-red-600' : 'text-textMuted'}`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black heading-font uppercase tracking-tighter text-textMain">
                                        {state.options.title}
                                    </h3>
                                    <p className="text-sm text-textMuted mt-2">
                                        {state.options.message}
                                    </p>
                                </div>
                            </div>

                            {/* Prompt Input */}
                            {state.type === 'prompt' && (
                                <input
                                    type="text"
                                    value={promptValue}
                                    onChange={(e) => setPromptValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                                    autoFocus
                                    className="w-full bg-bgMain border border-borderColor p-3 rounded-sm text-sm font-bold text-textMain focus:border-red-600 focus:outline-none mb-6"
                                    placeholder="Enter value..."
                                />
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-textMain transition-colors border border-borderColor rounded-sm hover:border-neutral-600"
                                >
                                    {state.options.cancelText || 'Cancel'}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-sm transition-colors ${state.options.confirmStyle === 'danger'
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-white text-black hover:bg-neutral-200'
                                        }`}
                                >
                                    {state.options.confirmText || 'Confirm'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ConfirmContext.Provider>
    );
};

export default ConfirmProvider;

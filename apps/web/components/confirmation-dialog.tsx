'use client';

import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    confirmVariant?: 'danger' | 'primary';
    loading?: boolean;
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    confirmVariant = 'primary',
    loading = false,
}: ConfirmationDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        {confirmVariant === 'danger' && (
                            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                        )}
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 justify-end p-6 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-4 py-2 font-medium rounded-md transition-colors flex items-center gap-2 ${confirmVariant === 'danger'
                                ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white'
                            }`}
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

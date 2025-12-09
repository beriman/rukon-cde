'use client';

import { useState, FormEvent } from 'react';
import { apiClient } from '@/lib/api-client';
import { X, Loader2 } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive?: boolean;
}

interface EditUserModalProps {
    user: User;
    onClose: () => void;
    onSuccess: () => void;
}

const USER_ROLES = [
    { value: 'VIEWER', label: 'Viewer' },
    { value: 'UPLOADER', label: 'Uploader' },
    { value: 'INFO_MANAGER', label: 'Information Manager' },
    { value: 'LEAD_APPOINTED_PARTY', label: 'Lead Appointed Party' },
    { value: 'ORG_ADMIN', label: 'Organization Admin' },
];

export function EditUserModal({ user, onClose, onSuccess }: EditUserModalProps) {
    const [role, setRole] = useState(user.role);
    const [isActive, setIsActive] = useState(user.isActive !== false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await apiClient.patch(`/users/${user.id}`, { role, isActive });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        Edit User
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* User Info (Read-only) */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Name
                            </label>
                            <div className="text-zinc-900 dark:text-white font-medium">
                                {user.name}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Email
                            </label>
                            <div className="text-zinc-600 dark:text-zinc-400">
                                {user.email}
                            </div>
                        </div>
                    </div>

                    {/* Role Dropdown */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                        >
                            {USER_ROLES.map((r) => (
                                <option key={r.value} value={r.value}>
                                    {r.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Active/Inactive Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label htmlFor="isActive" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Account Status
                            </label>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                Inactive users cannot log in
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsActive(!isActive)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Current Status:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

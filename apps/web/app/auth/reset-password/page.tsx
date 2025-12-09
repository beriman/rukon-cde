'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setValidating(false);
            setError('Invalid reset link. Please request a new password reset.');
            return;
        }

        // Verify token on page load
        const verifyToken = async () => {
            try {
                await apiClient.get(`/auth/verify-reset-token/${token}`);
                setTokenValid(true);
            } catch (err: any) {
                setError(err.response?.data?.message || 'This reset link has expired or is invalid.');
            } finally {
                setValidating(false);
            }
        };

        verifyToken();
    }, [token]);

    const getPasswordStrength = (pwd: string) => {
        if (pwd.length === 0) return { strength: 0, label: '', color: '' };
        if (pwd.length < 8) return { strength: 25, label: 'Weak', color: 'bg-red-500' };

        let strength = 25;
        if (/[a-z]/.test(pwd)) strength += 25;
        if (/[A-Z]/.test(pwd)) strength += 25;
        if (/[0-9]/.test(pwd)) strength += 25;

        if (strength < 50) return { strength, label: 'Weak', color: 'bg-red-500' };
        if (strength < 75) return { strength, label: 'Medium', color: 'bg-yellow-500' };
        return { strength, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(password);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            await apiClient.post('/auth/reset-password', { token, newPassword: password });
            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-zinc-600 dark:text-zinc-400">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 px-4">
                <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-8">
                    <div className="flex flex-col items-center text-center">
                        <XCircle className="w-16 h-16 text-red-600 mb-4" />
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                            Invalid Reset Link
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            {error || 'This password reset link has expired or is invalid.'}
                        </p>
                        <Link
                            href="/auth/forgot-password"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
                        >
                            Request a new reset link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 px-4">
                <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-8">
                    <div className="flex flex-col items-center text-center">
                        <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                            Password Reset Successful
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            Your password has been reset successfully. Redirecting to login...
                        </p>
                        <Link
                            href="/auth/login"
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 px-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        Reset Your Password
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Enter your new password below
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter new password"
                                className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                            />
                        </div>
                        {password && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-zinc-600 dark:text-zinc-400">Password strength:</span>
                                    <span className={`font-medium ${passwordStrength.strength >= 75 ? 'text-green-600' : passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${passwordStrength.color}`}
                                        style={{ width: `${passwordStrength.strength}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm new password"
                                className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                            />
                        </div>
                        {confirmPassword && (
                            <p className={`mt-1 text-xs ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                                {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || password !== confirmPassword}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Resetting...
                            </>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

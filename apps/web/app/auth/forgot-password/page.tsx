'use client';

import { useState, FormEvent } from 'react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await apiClient.post('/auth/forgot-password', { email });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 px-4">
                <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-8">
                    <div className="flex flex-col items-center text-center">
                        <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                            Check Your Email
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            We've sent password reset instructions to <strong>{email}</strong>
                        </p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-6">
                            The link will expire in 1 hour. If you don't receive the email, check your spam folder.
                        </p>
                        <Link
                            href="/auth/login"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
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
                        Forgot Password?
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>

                    <div className="text-center">
                        <Link
                            href="/auth/login"
                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 flex items-center justify-center gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

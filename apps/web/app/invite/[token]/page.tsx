'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface InvitationData {
    email: string;
    organizationName: string;
    role: string;
}

export default function InvitationAcceptancePage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;

    const [invitation, setInvitation] = useState<InvitationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (token) {
            verifyToken();
        }
    }, [token]);

    const verifyToken = async () => {
        try {
            const res = await apiClient.get(`/auth/verify-invitation/${token}`);
            setInvitation(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid or expired invitation link');
        } finally {
            setLoading(false);
        }
    };

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

    const handleAccept = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setSubmitting(true);
        try {
            await apiClient.post('/auth/accept-invitation', { token, password });
            router.push('/auth/login?message=Account created successfully. Please log in.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to accept invitation');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-zinc-600 dark:text-zinc-400">Verifying invitation...</p>
                </div>
            </div>
        );
    }

    if (error && !invitation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 px-4">
                <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-8 text-center">
                    <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        Invalid Invitation
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
                    <a
                        href="/auth/login"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-zinc-800 px-4">
            <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-8">
                <div className="mb-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        You're Invited!
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Accept your invitation to join <strong>{invitation?.organizationName}</strong>
                    </p>
                </div>

                <form onSubmit={handleAccept} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Email
                        </label>
                        <div className="text-zinc-900 dark:text-white font-medium">
                            {invitation?.email}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Organization
                        </label>
                        <div className="text-zinc-900 dark:text-white font-medium">
                            {invitation?.organizationName}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Role
                        </label>
                        <div className="text-zinc-600 dark:text-zinc-400">
                            {invitation?.role}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Set Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                        />
                        {password && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-zinc-600 dark:text-zinc-400">Password strength:</span>
                                    <span className={`font-medium ${passwordStrength.strength >= 75 ? 'text-green-600' :
                                            passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
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
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm your password"
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-zinc-800 dark:text-white"
                        />
                        {confirmPassword && (
                            <p className={`mt-1 text-xs ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                                {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || password !== confirmPassword}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors flex items-center justify-center"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Creating Account...
                            </>
                        ) : (
                            'Accept Invitation & Create Account'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

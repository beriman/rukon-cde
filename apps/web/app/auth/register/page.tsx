'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiClient } from '@/lib/api-client';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setIsLoading(true);

        try {
            const res = await apiClient.post('/auth/register', {
                name,
                email,
                password,
                confirmPassword
            });

            const { user, access_token } = res.data;

            // Automatically login after registration
            if (access_token) {
                login(user, access_token);
                router.push('/dashboard');
            } else {
                // Fallback if API doesn't return token on register (some flows require email verification)
                router.push('/auth/login?registered=true');
            }

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                <p className="text-sm text-zinc-500">Enter your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        required
                        className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        required
                        className="flex h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            <div className="text-center text-sm">
                <span className="text-zinc-500">Already have an account? </span>
                <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
                    Sign in
                </Link>
            </div>
        </div>
    );
}

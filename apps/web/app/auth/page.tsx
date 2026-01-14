'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate auth
        setTimeout(() => {
            router.push('/dashboard');
        }, 500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100">
                <div className="text-center mb-8">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                        R
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                        Welcome back
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 font-light">
                        Enter your credentials to access the workspace
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Email address
                        </label>
                        <input
                            type="email"
                            defaultValue="demo@rukon.io"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-shadow bg-slate-50"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            defaultValue="password"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-shadow bg-slate-50"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200/50 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <Link href="/" className="text-xs text-slate-400 hover:text-slate-600">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Globe, LifeBuoy, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/useAuthStore';

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const res = await apiClient.post('/auth/login', { email, password });
            const { user, accessToken } = res.data;
            
            login(user, accessToken);
            router.push('/projects');
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-200 selection:bg-blue-500/30">
            {/* Background Pattern */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231e293b\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E')] -z-10 opacity-20"></div>
            <div className="fixed inset-0 bg-gradient-to-tr from-slate-950 via-slate-950 to-blue-900/10 -z-10"></div>

            {/* Header / Navigation */}
            <header className="flex justify-between items-center p-4 md:px-8 border-b border-slate-800/50 backdrop-blur-md bg-slate-950/50 sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
                        R
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white uppercase italic">
                        Rukon<span className="text-blue-500 italic">2</span>
                    </span>
                </Link>

                <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
                    <a href="#" className="hidden md:flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                        <Globe size={16} />
                        System Status
                    </a>
                    <a href="#" className="hidden md:flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                        <LifeBuoy size={16} />
                        Support
                    </a>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-semibold border border-slate-700 shadow-inner">
                        ?
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-4 relative">
                <div className="w-full max-w-[440px] bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-8 md:p-10 relative overflow-hidden group">
                    {/* Decorative accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-blue-500/20">
                            <ShieldCheck size={12} /> Secure Access
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">SIGN IN</h1>
                        <p className="text-slate-400 text-sm">
                            Access your ISO 19650 compliant environment
                        </p>
                    </div>

                    {/* Social Login */}
                    <button 
                        type="button"
                        className="w-full flex items-center justify-center gap-3 py-3 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all font-semibold text-slate-200 shadow-sm active:scale-[0.98]"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 bg-slate-900 text-slate-500 font-bold uppercase tracking-[0.2em]">
                                or
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 text-white"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-tight"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600 text-white"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 py-1">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/50 accent-blue-600"
                                />
                            </div>
                            <label
                                htmlFor="remember"
                                className="text-sm text-slate-400 cursor-pointer select-none"
                            >
                                Remember this device
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 transition-all active:scale-[0.98] text-center flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                            SIGN IN
                        </button>
                    </form>

                    <p className="mt-10 text-center text-xs text-slate-500 leading-relaxed">
                        Don't have an account?{' '}
                        <a
                            href="#"
                            className="text-blue-400 font-bold hover:text-blue-300 hover:underline underline-offset-4"
                        >
                            Contact your Project Administrator.
                        </a>
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-8 text-center border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
                <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                    <a href="#" className="hover:text-slate-300 transition-colors">
                        Privacy Policy
                    </a>
                    <a href="#" className="hover:text-slate-300 transition-colors">
                        Terms of Service
                    </a>
                </div>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-medium">
                    © 2026 Rukon2 Systems • Built for ISO 19650
                </p>
            </footer>
        </div>
    );
}

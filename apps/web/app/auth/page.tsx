'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Rukon2</span>
        </Link>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Need help? <Link href="/support" className="text-primary font-bold hover:underline">Contact Support</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Background Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%232b8cee\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'2\' cy=\'2\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E')] -z-10"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="w-full max-w-[440px] animate-fade-in">
          <div className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-[2rem] border border-slate-200 dark:border-border-dark shadow-2xl shadow-slate-200/50 dark:shadow-none">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black mb-3 tracking-tight uppercase italic">Welcome Back</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                Enter your credentials to access the Rukon2 CDE Platform
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email or Username</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                  <Link href="/auth/forgot-password" className="text-[10px] font-black uppercase tracking-tighter text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-1">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" />
                <label htmlFor="remember" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              <button className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 hover:bg-blue-600 hover:-translate-y-0.5 transition-all active:scale-95">
                Sign In
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-border-dark"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="bg-white dark:bg-surface-dark px-4 text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-xs">
                <img src="https://www.svgrepo.com/show/303161/microsoft-logo.svg" className="w-4 h-4" alt="Microsoft" />
                Microsoft
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-background-dark/50 border border-slate-200 dark:border-border-dark rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-xs">
                <img src="https://www.svgrepo.com/show/355037/google-icon.svg" className="w-4 h-4" alt="Google" />
                Google
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center border-t border-slate-100 dark:border-border-dark">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Protected by Rukon2 Enterprise Security. <Link href="/privacy" className="text-slate-600 dark:text-slate-200 hover:underline">Privacy Policy</Link>
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
          © 2026 Rukon2 Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;

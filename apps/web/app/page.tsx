'use client';

import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-medium tracking-tighter">
                                R
                            </div>
                            <span className="font-medium text-slate-900 tracking-tight text-lg">
                                Rukon CDE
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
                            <a href="#" className="hover:text-slate-900 transition-colors">
                                Features
                            </a>
                            <a href="#" className="hover:text-slate-900 transition-colors">
                                Solutions
                            </a>
                            <a href="#" className="hover:text-slate-900 transition-colors">
                                Pricing
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/auth"
                                className="text-sm font-medium text-slate-600 hover:text-slate-900"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all shadow-sm"
                            >
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <main>
                <section className="relative pt-20 pb-32 overflow-hidden bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-100 mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
                            </span>
                            ISO 19650 Compliant
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl font-medium text-slate-900 tracking-tight mb-6 leading-[1.1]">
                            The Common Data Environment <br className="hidden sm:block" />
                            for <span className="text-slate-500">Modern Construction</span>
                        </h1>

                        {/* Subheading */}
                        <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-10 leading-relaxed font-light">
                            Streamline document management, BIM coordination, and project workflows
                            in a secure, compliant cloud platform designed for the built
                            environment.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/dashboard"
                                className="px-8 py-3.5 bg-slate-900 text-white rounded-lg font-medium shadow-lg shadow-slate-200 hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                Start Free Trial <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button className="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                <PlayCircle className="w-4 h-4" /> View Demo
                            </button>
                        </div>
                    </div>

                    {/* Grid Overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%2394a3b8\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E')] -z-20"></div>
                </section>
            </main>
        </div>
    );
}

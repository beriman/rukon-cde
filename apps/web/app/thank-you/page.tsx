'use client';

import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  FileCheck, 
  Monitor, 
  Map, 
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

const ThankYouPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState(22);

  const timeSlots = [
    '09:00 AM - 09:30 AM',
    '09:30 AM - 10:00 AM',
    '10:30 AM - 11:00 AM',
    '02:00 PM - 02:30 PM',
    '03:30 PM - 04:00 PM',
    '04:00 PM - 04:30 PM'
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold">R</span>
                </div>
                <span className="text-xl font-bold tracking-tight">Rukon2</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/#features" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Platform</Link>
            <Link href="/#solutions" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Solutions</Link>
            <Link href="/pricing" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Pricing</Link>
            <Link href="/#resources" className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Resources</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth" className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">Log in</Link>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-5 gap-16">
            {/* Left Column: Success & Scheduler */}
            <div className="md:col-span-3 space-y-12">
                <section className="text-center md:text-left space-y-6 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full border-4 border-white dark:border-border-dark shadow-xl mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">
                        Request Received!
                    </h1>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto md:mx-0">
                        Our team is reviewing your requirements. To speed up the process and get immediate insights, 
                        you can book your ISO 19650 audit now.
                    </p>
                </section>

                <div className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-border-dark shadow-2xl shadow-slate-200/50 dark:shadow-none animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50 dark:border-border-dark">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight italic">Schedule Your Audit</h2>
                    </div>

                    {/* Simple Calendar UI */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-8">
                            <button className="p-2 hover:bg-slate-50 dark:hover:bg-background-dark rounded-lg transition-colors text-slate-400">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h3 className="text-sm font-black uppercase tracking-widest italic">October 2026</h3>
                            <button className="p-2 hover:bg-slate-50 dark:hover:bg-background-dark rounded-lg transition-colors text-slate-400">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <div key={d} className="text-[10px] font-black text-slate-400 text-center py-2 uppercase tracking-widest">{d}</div>
                            ))}
                            {Array.from({ length: 30 }).map((_, i) => {
                                const d = i + 1;
                                return (
                                    <button 
                                        key={d}
                                        onClick={() => setSelectedDay(d)}
                                        className={`py-3 rounded-xl text-xs font-bold transition-all ${
                                            selectedDay === d 
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                                            : 'hover:bg-slate-50 dark:hover:bg-background-dark text-slate-500'
                                        }`}
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Available Times</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {timeSlots.map(t => (
                                <button key={t} className="p-4 border border-slate-100 dark:border-border-dark rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all bg-slate-50/50 dark:bg-background-dark/30">
                                    {t}
                                </button>
                            ))}
                        </div>
                        <button className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 hover:bg-blue-600 hover:-translate-y-0.5 transition-all active:scale-95">
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column: Info Sidebar */}
            <div className="md:col-span-2 space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white dark:bg-surface-dark p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-border-dark shadow-xl">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-10 block">What to Expect</h2>
                    
                    <div className="space-y-10">
                        <div className="flex gap-5 group">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <FileCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest mb-1 italic">15-Min Workflow Audit</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">We analyze your current processes against ISO 19650 standards.</p>
                            </div>
                        </div>

                        <div className="flex gap-5 group">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <Monitor className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest mb-1 italic">Live Walkthrough</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">A tailored demo of the Rukon2 CDE environment using your project types.</p>
                            </div>
                        </div>

                        <div className="flex gap-5 group">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <Map className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest mb-1 italic">Custom Roadmap</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Receive an implementation plan to get your team up and running in 30 days.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black uppercase tracking-widest text-sm italic">SJ</div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest text-white italic">Sarah Jenkins</h4>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Audit Specialist</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-300 italic font-medium leading-relaxed">
                        &quot;I look forward to helping you optimize your BIM workflows and ensuring your next project exceeds ISO 19650 benchmarks.&quot;
                    </p>
                </div>
            </div>
        </div>

        <div className="mt-24 pt-12 border-t border-slate-100 dark:border-border-dark flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to Home
            </Link>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              © 2026 Rukon2 CDE. All rights reserved.
            </p>
        </div>
      </main>
    </div>
  );
};

export default ThankYouPage;

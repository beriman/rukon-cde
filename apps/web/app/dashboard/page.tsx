'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  Box, 
  FolderOpen, 
  AlertCircle, 
  Clock, 
  CheckSquare, 
  MoreVertical,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react';

const UserDashboardPage = () => {
  const projects = [
    { name: 'Jakarta MRT Phase 3', role: 'Lead Appointed Party', progress: 65, image: '🚇' },
    { name: 'Dubai Sky-Rise P2', role: 'BIM Coordinator', progress: 42, image: '🏙️' },
    { name: 'London Crossrail', role: 'Information Manager', progress: 88, image: '🏗️' },
  ];

  const tasks = [
    { title: 'Approve Structural IFC', project: 'Jakarta MRT', due: '2h left', priority: 'high' },
    { title: 'Respond to RFI #402', project: 'Dubai Sky-Rise', due: 'Tomorrow', priority: 'medium' },
    { title: 'Upload Weekly Report', project: 'London Crossrail', due: 'Friday', priority: 'low' },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans transition-colors duration-300">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-border-dark px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-lg font-black tracking-tight uppercase italic hidden md:block">Rukon2 CDE</span>
          </div>

          <div className="flex-1 max-w-2xl relative group hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
                type="text" 
                placeholder="Search across projects, documents, or issues (Cmd + K)"
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-background-dark border border-slate-200 dark:border-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-bold"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-border-dark">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Eng. Thornton</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Information Manager</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-background-dark flex items-center justify-center border border-slate-200 dark:border-border-dark">
                    <span className="text-[10px] font-black italic">AT</span>
                </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 md:p-10">
        <div className="grid lg:grid-cols-4 gap-10">
            {/* Main Section */}
            <div className="lg:col-span-3 space-y-10">
                <header className="animate-fade-in">
                    <h1 className="text-3xl font-black tracking-tight uppercase italic mb-2">Welcome Back, Alex</h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Wednesday, October 28, 2026</p>
                </header>

                <section className="space-y-6">
                    <div className="flex justify-between items-end">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">Active Projects</h2>
                        <Link href="/projects" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">View All</Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {projects.map((p, i) => (
                            <div key={p.name} className="group bg-white dark:bg-surface-dark rounded-[2rem] border border-slate-100 dark:border-border-dark shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 animate-fade-in" style={{ animationDelay: `${0.1 * i}s` }}>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 bg-slate-50 dark:bg-background-dark rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-100 dark:border-border-dark">
                                            {p.image}
                                        </div>
                                        <button className="text-slate-300 hover:text-primary transition-colors"><MoreVertical className="w-5 h-5" /></button>
                                    </div>
                                    
                                    <h3 className="text-lg font-black uppercase tracking-tight italic mb-1 group-hover:text-primary transition-colors">{p.name}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{p.role}</p>

                                    <div className="space-y-2 mb-8">
                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest mb-1">
                                            <span>Project Progress</span>
                                            <span>{p.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 dark:bg-background-dark rounded-full overflow-hidden">
                                            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <button title="BIM Viewer" className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Box className="w-4 h-4" /></button>
                                        <button title="CDE Documents" className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all"><FolderOpen className="w-4 h-4" /></button>
                                        <button title="Issues" className="p-2.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-xl flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"><AlertCircle className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-100 dark:border-border-dark p-8 shadow-sm">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Recent Documents</h2>
                    <div className="space-y-2">
                        {[
                            { name: 'STR-IFC-001-MODEL.ifc', project: 'Jakarta MRT', date: '10 mins ago', size: '142 MB' },
                            { name: 'SITE-PHOTO-OCT-28.jpg', project: 'Dubai Sky-Rise', date: '1 hour ago', size: '12 MB' },
                            { name: 'ARCH-RVT-V4-COORD.rvt', project: 'London Crossrail', date: '3 hours ago', size: '2.4 GB' },
                        ].map((file, i) => (
                            <div key={file.name} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-background-dark/50 rounded-2xl transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-background-dark rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                        <FolderOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase italic tracking-tight">{file.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{file.project} • {file.date}</p>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase">{file.size}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Sidebar Section */}
            <div className="space-y-10">
                <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-white/5 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                    <div className="flex items-center gap-3 mb-8">
                        <CheckSquare className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-black uppercase tracking-widest italic leading-none">Pending Tasks</h2>
                    </div>

                    <div className="space-y-6">
                        {tasks.map((t) => (
                            <div key={t.title} className="group cursor-pointer">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="text-xs font-black uppercase italic tracking-tight group-hover:text-primary transition-colors">{t.title}</h4>
                                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{t.project}</p>
                                    </div>
                                    <div className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                                        t.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                        {t.due}
                                    </div>
                                </div>
                                <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full bg-primary/50 group-hover:bg-primary transition-all duration-500 w-0 group-hover:w-full`}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                        View Task Board
                    </button>
                </section>

                <section className="bg-white dark:bg-surface-dark rounded-[2.5rem] border border-slate-100 dark:border-border-dark p-8 shadow-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">System Status</h2>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">Global CDE Sync</p>
                                <div className="h-1 w-full bg-slate-50 dark:bg-background-dark rounded-full">
                                    <div className="h-full w-full bg-green-500/50 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1">BIM Rendering Cluster</p>
                                <div className="h-1 w-full bg-slate-50 dark:bg-background-dark rounded-full">
                                    <div className="h-full w-3/4 bg-green-500/50 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="bg-primary/10 rounded-[2.5rem] p-8 border border-primary/20 group cursor-pointer hover:bg-primary/20 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary italic mb-2">Upgrade to Pro</h3>
                    <p className="text-xs font-medium text-primary/70 leading-relaxed">Unlock advanced clash detection and unlimited document storage.</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboardPage;

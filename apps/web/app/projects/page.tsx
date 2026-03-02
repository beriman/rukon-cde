'use client';

import React, { useEffect } from 'react';
import { 
  Search, Plus, MoreVertical, AlertCircle, Mail, 
  ShieldCheck, Rocket, BookOpen, Activity, Rss, 
  LifeBuoy, LayoutGrid, FileText, GitBranch, 
  Calendar, ChevronRight, Bell, User, Loader2, Globe
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjectStore, Project } from '@/stores/useProjectStore';

export default function ProjectSelectionPage() {
  const { projects, isLoading, fetchProjects, setActiveProject } = useProjectStore();
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectSelect = (project: Project) => {
    setActiveProject(project);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231e293b\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4v-4H4v4H0v2h4v4h2v-4h4v-2H6zM36 4v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z\'/%3E%3C/g%3E%3C/svg%3E')] -z-10 opacity-30"></div>
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl px-6 shadow-2xl">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase italic">
              Rukon<span className="text-blue-500 italic">2</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-sm font-bold text-blue-400 border-b-2 border-blue-500 pb-5 mt-5 uppercase tracking-wider">Portfolio</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">Insights</a>
            <a href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">Network</a>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search project profile..." 
              className="h-10 w-72 rounded-xl border border-slate-800 bg-slate-900/50 pl-10 pr-4 text-xs font-medium focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
          <Link href="/projects/new" className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95">
            <Plus size={16} />
            <span className="hidden sm:inline uppercase tracking-wider">New Project</span>
          </Link>
          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <button className="text-slate-500 hover:text-white transition-colors relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-slate-950"></span>
            </button>
            <div className="h-9 w-9 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-sm shadow-inner">
              AB
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6 lg:p-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Left Column: Projects */}
          <div className="lg:col-span-8">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-4 border border-blue-500/20">
                 <Activity size={12} /> System Active
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">Project Portfolio</h1>
              <p className="mt-3 text-slate-400 text-lg font-light leading-relaxed">
                You have access to <span className="text-white font-medium">{projects.length} active BIM environments</span>.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex items-center gap-8 border-b border-slate-800/50">
              <button className="border-b-2 border-blue-500 pb-4 text-xs font-bold text-blue-400 uppercase tracking-[0.15em]">All Portfolios</button>
              <button className="pb-4 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.15em]">Construction</button>
              <button className="pb-4 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-[0.15em]">Tender</button>
            </div>

            {/* Project Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading environments...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800 gap-6">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-600">
                  <LayoutGrid size={32} />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No active projects found</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Create your first project to start managing your ISO 19650 Common Data Environment.</p>
                </div>
                <Link href="/projects/new" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs">
                  Create First Project
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {projects.map((project) => (
                  <div 
                    key={project.id}
                    onClick={() => handleProjectSelect(project)}
                    className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm shadow-xl transition-all hover:border-blue-500/50 hover:translate-y-[-4px] cursor-pointer"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                      <img 
                        src={`https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop`} 
                        alt={project.name} 
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60"
                      />
                      <div className="absolute left-4 top-4 rounded-lg bg-blue-600/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white z-20 shadow-lg">{project.status}</div>
                    </div>
                    <div className="p-6 relative z-20">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight uppercase italic">{project.name}</h3>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mt-1">ID: {project.id.split('-')[0].toUpperCase()}</p>
                        </div>
                        <button className="text-slate-600 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          <span>Physical Progress</span>
                          <span className="text-blue-400">0.0%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full w-[0%] rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]"></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-800 pt-5">
                        <div className="flex items-center gap-5">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <AlertCircle size={14} />
                            <span className="text-xs font-bold">0</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Mail size={14} />
                            <span className="text-xs font-bold text-slate-400">0</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-500/90 bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10">
                          <ShieldCheck size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-tight">Secure Environment</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Onboarding Section */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                 <Rocket size={80} />
              </div>
              <div className="mb-6 flex items-center gap-3 font-bold text-white uppercase tracking-widest text-xs">
                <Rocket className="text-blue-500" size={18} />
                <h2>Onboarding</h2>
              </div>
              <div className="space-y-4">
                <a href="#" className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-4 hover:bg-slate-800 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-600/10 p-2.5 text-blue-500">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Quick Start Guide</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">ISO 19650 Compliance</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-700 group-hover:text-blue-400 transition-colors" />
                </a>
                
                <div className="rounded-xl bg-emerald-500/5 p-4 border border-emerald-500/10">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-100">CDE Health</p>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">All services optimal</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950/40 p-4 border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-slate-800 p-2.5 text-slate-400">
                      <Rss size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-300">Latest Updates</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">v2.4.1 Stable Release</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
                  <LifeBuoy size={14} />
                  <span>Support Center</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-all uppercase tracking-tight">Knowledge</button>
                  <button className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-all uppercase tracking-tight">Support Desk</button>
                </div>
              </div>
            </div>

            {/* Upcoming Milestones */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-8 shadow-2xl">
              <h3 className="mb-6 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">System Status</h3>
              <div className="space-y-6">
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-500 shadow-inner shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">CDE Infrastructure</p>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Jakarta Data Center • <span className="text-emerald-500 font-black">Online</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/50 py-10 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] font-black text-slate-500">R</div>
             <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">© 2026 Rukon2 Systems • Professional CDE</p>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Terms</a>
            <a href="#" className="text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

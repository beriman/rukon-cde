'use client';

import React, { useEffect, useState } from 'react';
import { 
  LayoutGrid, Search, Bell, Plus, FileText, AlertTriangle, 
  CheckCircle2, Activity, ShieldCheck, Globe, TrendingUp, 
  ChevronRight, Filter, MoreVertical, MessageSquare, 
  Calendar, Users, MapPin, ArrowUpRight, Clock, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/useProjectStore';
import { apiClient } from '@/lib/api-client';

export default function ProjectDashboardPage() {
  const { activeProject, isLoading: isProjectLoading } = useProjectStore();
  const [stats, setStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!activeProject && !isProjectLoading) {
      router.push('/projects');
      return;
    }

    if (activeProject) {
      fetchDashboardStats();
    }
  }, [activeProject, isProjectLoading, router]);

  const fetchDashboardStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await apiClient.get(`/projects/${activeProject?.id}/dashboard`);
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  if (!activeProject) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 size={40} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231e293b\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E')] -z-10 opacity-30"></div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl px-6 shadow-2xl">
        <div className="flex items-center gap-10">
          <Link href="/projects" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase italic">
              Rukon<span className="text-blue-500 italic">2</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/dashboard" className="text-sm font-bold text-blue-400 border-b-2 border-blue-500 pb-5 mt-5 uppercase tracking-wider">Dashboard</Link>
            <Link href="/documents" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">Documents</Link>
            <Link href="/bim" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">BIM Viewer</Link>
            <Link href="/hse" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">HSE</Link>
            <Link href="/simulation" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">4D/5D</Link>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search in project..." 
              className="h-10 w-64 rounded-xl border border-slate-800 bg-slate-900/50 pl-10 pr-4 text-xs font-medium focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
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

      <main className="p-6 lg:p-10 max-w-[1600px] mx-auto">
        {/* Project Header */}
        <header className="mb-10 flex flex-col lg:flex-row justify-between gap-6 lg:items-end">
          <div>
            <nav className="mb-4 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              <Link href="/projects" className="hover:text-blue-400 transition-colors">Portfolios</Link>
              <ChevronRight size={12} />
              <span className="text-slate-400">Project Workspace</span>
            </nav>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic italic">
                {activeProject.name}
            </h1>
            <div className="mt-4 flex items-center gap-5 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span className="text-slate-300">ID: {activeProject.id.split('-')[0].toUpperCase()}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
              <span>Status: <span className="text-blue-500">{activeProject.status}</span></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
              <span className="flex items-center gap-2 italic text-slate-600 font-medium lowercase tracking-tight">
                <Clock size={14} /> environment active
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-5 py-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all shadow-lg active:scale-95">
              <FileText size={16} className="text-blue-500" />
              Upload File
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-5 py-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all shadow-lg active:scale-95">
              <AlertTriangle size={16} className="text-amber-500" />
              Create Issue
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-[11px] font-bold text-white uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 active:scale-95">
              <Plus size={16} />
              New RFI
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Document Health */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
               <FileText size={60} />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none">Document Health</h3>
              <Activity className="text-blue-500" size={18} />
            </div>
            <div className="mb-1 text-3xl font-black text-white tracking-tighter leading-none">{stats?.filesCount || 0}</div>
            <div className="mb-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Active Docs</div>
            <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-800/50">
              <div className="bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" style={{ width: `${stats?.wipPercentage || 0}%` }}></div>
              <div className="bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" style={{ width: `${stats?.sharedPercentage || 0}%` }}></div>
              <div className="bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: `${stats?.publishedPercentage || 0}%` }}></div>
            </div>
            <div className="mt-4 flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-600">
              <span className="text-amber-500/80">WIP {stats?.wipPercentage || 0}%</span>
              <span className="text-blue-500/80">Shared {stats?.sharedPercentage || 0}%</span>
              <span className="text-emerald-500/80">Pub {stats?.publishedPercentage || 0}%</span>
            </div>
          </div>

          {/* BIM Coordination */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-6 shadow-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
               <LayoutGrid size={60} />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none">BIM Coordination</h3>
              <Globe className="text-indigo-500" size={18} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-black text-red-500 tracking-tighter">{stats?.clashesCount || 0}</div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Active Clashes</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white tracking-tighter">{stats?.openBcfCount || 0}</div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Open BCFs</div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-slate-800/50 pt-4">
              <div className="flex -space-x-2.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-7 w-7 rounded-lg border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Team Sync Active</span>
            </div>
          </div>

          {/* HSE Stats */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
               <ShieldCheck size={60} />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none">HSE Performance</h3>
              <ShieldCheck className="text-emerald-500" size={18} />
            </div>
            <div className="mb-1 text-3xl font-black text-emerald-500 tracking-tighter leading-none">{stats?.ltiFreeDays || 0} Days</div>
            <div className="mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Incident Free Period</div>
            <div className="text-sm font-black text-white">
              {stats?.totalManhours || 0} <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-1">Total Manhours</span>
            </div>
          </div>

          {/* Schedule Variance */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
               <TrendingUp size={60} />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none">Schedule Variance</h3>
              <TrendingUp className="text-red-500" size={18} />
            </div>
            <div className="mb-1 text-3xl font-black text-red-500 tracking-tighter leading-none">{stats?.scheduleVariance || '0.0'}%</div>
            <div className="mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Variance Status</div>
            <div className="h-10 w-full flex items-end gap-1.5 px-1 pb-1 border-b border-slate-800/50">
              {[20, 40, 60, 90, 70, 80].map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-sm transition-all duration-500 ${i === 5 ? 'bg-red-500/50' : 'bg-blue-600/30'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* My Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-blue-500" size={20} />
                <h2 className="text-sm font-black uppercase tracking-[0.25em] text-white leading-none">Priority Tasks</h2>
                <span className="rounded-md bg-blue-600/10 border border-blue-600/20 px-2 py-0.5 text-[10px] font-black text-blue-500 uppercase tracking-widest">{stats?.tasks?.length || 0} Active</span>
              </div>
              <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">View All Actions</button>
            </div>
            
            <div className="space-y-4">
              {stats?.tasks?.length > 0 ? stats.tasks.map((task: any, i: number) => (
                <div key={task.id} className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 shadow-xl transition-all hover:border-blue-500/50 hover:translate-x-1">
                  <div className="flex items-start gap-5">
                    <div className="mt-1 rounded-xl bg-blue-600/10 p-3 text-blue-500 border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <FileText size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">{task.status}</div>
                      <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight text-base italic uppercase">{task.title}</h4>
                      <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5 italic lowercase tracking-tight">assigned to: {task.assignee || 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-800 group-hover:text-blue-500 transition-colors" />
                </div>
              )) : (
                <div className="p-10 text-center border border-dashed border-slate-800 rounded-3xl text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                  No priority tasks assigned
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-8 shadow-2xl relative overflow-hidden">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="text-slate-500" size={18} />
                <h2 className="text-sm font-black uppercase tracking-[0.25em] text-white leading-none">Project Activity</h2>
              </div>
              <button className="text-slate-600 hover:text-white transition-colors">
                <Filter size={16} />
              </button>
            </div>

            <div className="relative space-y-8 before:absolute before:left-3.5 before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-slate-800">
              {stats?.recentActivity?.length > 0 ? stats.recentActivity.map((activity: any, i: number) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-0 top-1.5 h-7 w-7 rounded-lg border-2 border-slate-950 bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)] flex items-center justify-center text-white text-[10px] font-bold">
                    {activity.userInitials || 'SY'}
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed">
                    <span className="font-black text-white italic">{activity.userName || 'System'}</span> {activity.description}
                  </div>
                  <div className="mt-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">{activity.timeAgo || 'Recently'}</div>
                </div>
              )) : (
                <div className="relative pl-10 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                  No recent activity recorded
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/50 py-12 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-xs font-black text-slate-500 shadow-inner">R</div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rukon2 Enterprise CDE</p>
                <p className="text-[9px] font-bold text-slate-700 uppercase tracking-widest mt-0.5">Built for ISO 19650 Compliance</p>
             </div>
          </div>
          <div className="flex items-center gap-10">
            <a href="#" className="text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.2em]">Privacy</a>
            <a href="#" className="text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.2em]">Terms</a>
            <a href="#" className="text-[10px] font-black text-slate-600 hover:text-white transition-colors uppercase tracking-[0.2em]">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

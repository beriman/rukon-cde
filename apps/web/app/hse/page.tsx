'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, Activity, AlertTriangle, Clock, 
  TrendingUp, FileText, CheckCircle2, ChevronRight, 
  ChevronLeft, Bell, Search, Filter, HardHat, 
  HeartPulse, Zap, Flame, UserCheck, BarChart3, Loader2,
  MoreVertical
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/useProjectStore';
import { apiClient } from '@/lib/api-client';

export default function HseDashboardPage() {
  const { activeProject, isLoading: isProjectLoading } = useProjectStore();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!activeProject && !isProjectLoading) {
      router.push('/projects');
      return;
    }

    if (activeProject) {
      fetchHseData();
    }
  }, [activeProject, isProjectLoading, router]);

  const fetchHseData = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/projects/${activeProject?.id}/hse/dashboard`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch HSE data:', err);
    } finally {
      setIsLoading(false);
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
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase italic">
              Rukon<span className="text-blue-500 italic">2</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">Dashboard</Link>
            <Link href="/hse" className="text-sm font-bold text-blue-400 border-b-2 border-blue-500 pb-5 mt-5 uppercase tracking-wider">HSE Performance</Link>
            <Link href="/bim" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">BIM Viewer</Link>
            <Link href="/analytics" className="text-sm font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-wider">Analytics</Link>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Safety Secure</span>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-sm shadow-inner">
            AB
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-10 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <header className="mb-10 flex flex-col lg:flex-row justify-between gap-6 lg:items-end">
          <div>
            <nav className="mb-4 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              <Link href="/dashboard" className="hover:text-blue-400 transition-colors">{activeProject.name}</Link>
              <ChevronRight size={12} />
              <span className="text-slate-400">Health & Safety</span>
            </nav>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase italic italic">
                HSE <span className="text-emerald-500">Performance</span> Dashboard
            </h1>
            <p className="mt-2 text-slate-500 text-sm font-medium uppercase tracking-widest">Operational Safety Monitoring & Incident Management</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/50 px-5 py-3 text-[11px] font-bold text-slate-300 uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all shadow-lg active:scale-95">
              <Zap size={16} className="text-amber-500" />
              Issue PTW
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-[11px] font-bold text-white uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-900/20 active:scale-95">
              <AlertTriangle size={16} />
              Report Incident
            </button>
          </div>
        </header>

        {/* KPI Row */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Total Manhours', value: data?.stats?.totalManhours || '0', sub: 'Project Cumulative', icon: Clock, color: 'text-blue-500' },
            { title: 'LTI Free Days', value: `${data?.stats?.ltiFreeDays || 0} Days`, sub: 'Target: Zero LTI', icon: ShieldCheck, color: 'text-emerald-500' },
            { title: 'Incident Count', value: data?.stats?.incidentsCount || '0', sub: 'Current Period', icon: Activity, color: 'text-red-500' },
            { title: 'Open Permits', value: data?.stats?.openPermitsCount || '0', sub: 'PTW Active', icon: FileText, color: 'text-amber-500' }
          ].map((kpi, i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                 <kpi.icon size={60} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">{kpi.title}</h3>
              <div className={`text-3xl font-black ${kpi.color} tracking-tighter leading-none mb-2`}>{kpi.value}</div>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{kpi.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Incident Trend Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BarChart3 className="text-blue-500" size={20} />
                <h2 className="text-sm font-black uppercase tracking-[0.25em] text-white leading-none">Safety Performance Trend</h2>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Target</span>
                <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Actual</span>
              </div>
            </div>
            <div className="h-64 w-full flex items-end justify-between gap-4 px-2">
              {(data?.trends || [40, 30, 45, 50, 20, 15, 10, 5]).map((h: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col gap-1 items-center group/bar">
                  <div className="w-full bg-blue-600/20 rounded-t-lg transition-all group-hover/bar:bg-blue-600/40" style={{ height: `${(h.target || h) + 20}%` }}></div>
                  <div className="w-full bg-emerald-500/40 rounded-t-lg transition-all group-hover/bar:bg-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]" style={{ height: `${h.actual || h}%` }}></div>
                  <span className="text-[9px] font-bold text-slate-600 uppercase mt-2">{h.label || `M${i+1}`}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incidents Feed */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-8 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Activity className="text-red-500" size={20} />
                <h2 className="text-sm font-black uppercase tracking-[0.25em] text-white leading-none">Recent Incidents</h2>
              </div>
              <button className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">View All</button>
            </div>
            <div className="flex-grow space-y-6 overflow-y-auto pr-2">
              {data?.recentIncidents?.length > 0 ? data.recentIncidents.map((item: any, i: number) => (
                <div key={i} className="group p-4 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-red-500/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                      item.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>{item.type}</span>
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-black text-white group-hover:text-red-400 transition-colors uppercase italic mb-2 tracking-tight">{item.location}</h4>
                  <div className="flex items-center gap-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><UserCheck size={10} /> {item.status}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl text-slate-600 text-[9px] font-black uppercase tracking-widest">
                  No incidents reported
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-3 border border-slate-800 rounded-xl text-[10px] font-black text-slate-500 hover:text-white hover:bg-slate-800 transition-all uppercase tracking-widest">
              HSE Audit Logs
            </button>
          </div>
        </div>

        {/* PTW & Inspections Table */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-500" size={20} />
              <h2 className="text-sm font-black uppercase tracking-[0.25em] text-white leading-none">Permit to Work (PTW) Status</h2>
            </div>
            <div className="flex gap-3">
              <button className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition-all"><Search size={16} /></button>
              <button className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 transition-all"><Filter size={16} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40">
                  {['Permit ID', 'Contractor', 'Work Type', 'Valid Until', 'Status', 'Actions'].map((h, i) => (
                    <th key={i} className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data?.permits?.length > 0 ? data.permits.map((row: any, i: number) => (
                  <tr key={i} className="group hover:bg-blue-500/[0.02] transition-colors">
                    <td className="px-8 py-5 text-xs font-black text-white tracking-tight uppercase italic">{row.id}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">{row.contractor}</td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 rounded bg-slate-800 text-[9px] font-bold text-slate-300 uppercase tracking-widest border border-slate-700">{row.type}</span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-500">{row.expiryDate}</td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                        row.status === 'APPROVED' || row.status === 'ACTIVE' ? 'text-emerald-500' : row.status === 'PENDING' ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          row.status === 'APPROVED' || row.status === 'ACTIVE' ? 'bg-emerald-500' : row.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                        }`}></div>
                        {row.status}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-600 hover:text-white transition-all"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-10 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">
                      No PTW records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/50 py-10 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] font-black text-slate-500">R</div>
             <span>Rukon2 HSE Monitoring System v4.2</span>
          </div>
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> ISO 45001 Compliant</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" /> Real-time Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

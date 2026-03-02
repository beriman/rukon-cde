'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Calendar, Clock, Cuboid, DollarSign, 
  TrendingUp, Play, Pause, SkipBack, SkipForward, 
  Settings, Filter, ChevronRight, ChevronLeft, 
  Maximize2, LayoutGrid, FileText, Globe, Activity,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/useProjectStore';
import { apiClient } from '@/lib/api-client';

export default function SimulationDashboardPage() {
  const { activeProject, isLoading: isProjectLoading } = useProjectStore();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [cashFlow, setCashFlow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(65);
  const router = useRouter();

  useEffect(() => {
    if (!activeProject && !isProjectLoading) {
      router.push('/projects');
      return;
    }

    if (activeProject) {
      fetchSimulationData();
    }
  }, [activeProject, isProjectLoading, router]);

  const fetchSimulationData = async () => {
    setIsLoading(true);
    try {
      const scheduleRes = await apiClient.get(`/simulation/project/${activeProject?.id}/schedules`);
      setSchedules(scheduleRes.data || []);
      
      if (scheduleRes.data?.length > 0) {
        const cashFlowRes = await apiClient.get(`/simulation/schedule/${scheduleRes.data[0].id}/cash-flow`);
        setCashFlow(cashFlowRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch simulation data:', err);
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
    <div className="h-screen bg-slate-950 flex flex-col font-sans text-slate-200 overflow-hidden selection:bg-blue-500/30">
      {/* Navigation Header */}
      <header className="h-14 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-50 shadow-xl">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft size={20} className="text-slate-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg">
              R
            </div>
            <div>
              <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-white leading-none">{activeProject.name}</h1>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">4D/5D Advanced Simulation</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
             <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
                <Calendar size={14} className="text-slate-500" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Construction Schedule</span>
             </div>
             <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-500" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
             </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-inner">
            AB
          </div>
        </div>
      </header>

      {/* Main Content: Split Layout */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Top Half: 3D + Gantt */}
        <div className="h-[60%] flex border-b border-slate-800/50">
          {/* 3D Viewport */}
          <div className="flex-grow bg-slate-950 relative overflow-hidden group">
             {/* Mock 3D Model Rendering */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 grayscale contrast-125 mix-blend-screen"></div>
             <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-transparent to-transparent"></div>
             
             {/* 3D Label & Status */}
             <div className="absolute top-6 left-6 z-10 space-y-2">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                   <Cuboid size={12} /> 4D Sequence Active
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-2xl font-black text-white italic tracking-tight uppercase leading-none">Federated 4D Simulation</span>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Status: {isPlaying ? 'Playing Sequence' : 'Paused'}</span>
                </div>
             </div>

             {/* Playback Controls Overlay */}
             <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-4">
                <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-4 shadow-2xl">
                   <div className="flex items-center gap-1 border-r border-slate-800 pr-4">
                      <button className="p-2 text-slate-500 hover:text-white transition-colors"><SkipBack size={18} /></button>
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-all"
                      >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                      </button>
                      <button className="p-2 text-slate-500 hover:text-white transition-colors"><SkipForward size={18} /></button>
                   </div>
                   <div className="flex-grow flex items-center gap-4 px-4">
                      <div className="text-[10px] font-black text-blue-500 w-8">{progress}%</div>
                      <div className="flex-grow h-1.5 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer group/progress">
                         <div className="absolute inset-0 bg-blue-600/20 w-full"></div>
                         <div className="absolute inset-y-0 left-0 bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                         <div className="absolute h-4 w-4 bg-white rounded-full border-4 border-blue-600 shadow-xl top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover/progress:opacity-100 transition-opacity" style={{ left: `${progress}%` }}></div>
                      </div>
                      <div className="text-[10px] font-black text-slate-500 w-12">LIVE</div>
                   </div>
                   <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
                      <button className="p-2 text-slate-500 hover:text-white transition-all"><Settings size={18} /></button>
                      <button className="p-2 text-slate-500 hover:text-white transition-all"><Maximize2 size={18} /></button>
                   </div>
                </div>
             </div>

             {/* Color Legend */}
             <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
                {[
                  { label: 'Built', color: 'bg-emerald-500' },
                  { label: 'In Progress', color: 'bg-blue-500' },
                  { label: 'Delayed', color: 'bg-red-500' },
                  { label: 'Upcoming', color: 'bg-slate-700' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-950/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/50">
                     <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Gantt Chart Panel */}
          <div className="w-[450px] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 overflow-hidden">
             <div className="p-4 border-b border-slate-800 bg-slate-950/20 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Construction Tasks</h3>
                <Filter size={14} className="text-slate-600 hover:text-blue-500 cursor-pointer" />
             </div>
             <div className="flex-grow overflow-y-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/40 sticky top-0 z-10">
                         <th className="px-4 py-3 text-[9px] font-black text-slate-600 uppercase tracking-widest w-16">ID</th>
                         <th className="px-4 py-3 text-[9px] font-black text-slate-600 uppercase tracking-widest">Task Description</th>
                         <th className="px-4 py-3 text-[9px] font-black text-slate-600 uppercase tracking-widest w-20 text-center">Dates</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800/50">
                      {schedules.length > 0 && schedules[0].tasks ? schedules[0].tasks.map((task: any, i: number) => (
                        <tr key={i} className={`group cursor-pointer hover:bg-slate-800/50 transition-colors`}>
                           <td className="px-4 py-4 text-[10px] font-bold text-slate-500">{task.taskId}</td>
                           <td className="px-4 py-4 text-[11px] font-black text-slate-300 uppercase tracking-tight italic">{task.name}</td>
                           <td className="px-4 py-4 text-center">
                              <span className={`text-[8px] font-black uppercase tracking-widest text-slate-500`}>{new Date(task.startDate).toLocaleDateString()}</span>
                           </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-10 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">
                            No schedule tasks available
                          </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Bottom Half: Cost & Analytics */}
        <div className="h-[40%] flex overflow-hidden">
           {/* S-Curve Chart */}
           <div className="flex-grow p-8 bg-slate-950 flex flex-col">
              <div className="flex items-center justify-between mb-8 shrink-0">
                 <div className="flex items-center gap-3">
                    <TrendingUp className="text-blue-500" size={20} />
                    <h2 className="text-sm font-black uppercase tracking-[0.25em] text-white leading-none uppercase italic leading-none">
                        Project S-Curve <span className="text-slate-600 font-medium ml-2 tracking-widest tracking-widest tracking-widest">Cost Performance Index</span>
                    </h2>
                 </div>
                 <div className="flex gap-6">
                    {[
                      { label: 'Planned Value', color: 'bg-slate-700' },
                      { label: 'Earned Value', color: 'bg-blue-500' },
                      { label: 'Actual Cost', color: 'bg-emerald-500' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                         <div className={`w-2.5 h-0.5 rounded-full ${item.color}`}></div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                      </div>
                    ))}
                 </div>
              </div>
              
              {/* Mock S-Curve Graph Area */}
              <div className="flex-grow relative flex items-end gap-1 px-4 mb-4">
                 <div className="absolute inset-0 border-l border-b border-slate-800/50"></div>
                 {cashFlow?.dailyFlow ? cashFlow.dailyFlow.slice(-12).map((day: any, i: number) => (
                   <div key={i} className="flex-1 group/bar relative">
                      <div className="absolute bottom-0 w-full bg-slate-800/30 rounded-t-sm" style={{ height: `80%` }}></div>
                      <div className="absolute bottom-0 w-full bg-blue-600/40 rounded-t-sm transition-all group-hover/bar:bg-blue-600/60" style={{ height: `70%` }}></div>
                      <div className="absolute bottom-0 w-full bg-emerald-500/40 rounded-t-sm" style={{ height: `65%` }}></div>
                   </div>
                 )) : [10, 15, 22, 28, 35, 42, 50, 58, 65, 72, 80, 88].map((h, i) => (
                   <div key={i} className="flex-1 group/bar relative">
                      <div className="absolute bottom-0 w-full bg-slate-800/30 rounded-t-sm" style={{ height: `${h}%` }}></div>
                      <div className="absolute bottom-0 w-full bg-blue-600/40 rounded-t-sm transition-all group-hover/bar:bg-blue-600/60" style={{ height: `${h - 5}%` }}></div>
                   </div>
                 ))}
              </div>
              <div className="flex justify-between text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] px-4">
                 <span>START</span>
                 <span>PHASE 1</span>
                 <span>PHASE 2</span>
                 <span>PHASE 3</span>
                 <span>FINISH</span>
              </div>
           </div>

           {/* Financial KPI Sidebar */}
           <div className="w-[450px] bg-slate-900 border-l border-slate-800 p-8 flex flex-col gap-6 shrink-0">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Financial Performance</h3>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">SV Index</span>
                       <TrendingUp size={14} className="text-blue-500" />
                    </div>
                    <div className="text-2xl font-black text-blue-500 tracking-tighter">1.02</div>
                    <div className="text-[9px] font-bold text-slate-700 uppercase mt-1">On Schedule</div>
                 </div>
                 <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">CV Index</span>
                       <DollarSign size={14} className="text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black text-emerald-500 tracking-tighter">0.98</div>
                    <div className="text-[9px] font-bold text-slate-700 uppercase mt-1">Under Budget</div>
                 </div>
              </div>

              <div className="p-6 rounded-2xl border border-blue-600/20 bg-blue-600/5 shadow-xl">
                 <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="text-blue-500" size={18} />
                    <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Budget Utilization</span>
                 </div>
                 <div className="mb-2 flex items-end justify-between">
                    <div className="text-3xl font-black text-white tracking-tighter italic">USD {cashFlow?.totalActualCost || '0.0'}M</div>
                    <div className="text-xs font-bold text-slate-500 pb-1">/ {cashFlow?.totalBudget || '0.0'}M</div>
                 </div>
                 <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.4)]" style={{ width: `${(cashFlow?.totalActualCost / cashFlow?.totalBudget) * 100 || 0}%` }}></div>
                 </div>
              </div>

              <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3">
                 <FileText size={16} className="text-slate-500" />
                 Download Analytics Report
              </button>
           </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="h-10 border-t border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
        <div className="flex items-center gap-8">
           <span className="flex items-center gap-2 italic"><Activity size={12} /> Sync: Primavera P6 Integration</span>
           <span className="flex items-center gap-2"><Globe size={12} /> Cloud Rendering Active</span>
        </div>
        <div className="flex items-center gap-6 text-slate-500">
           <span>Rukon2 Advanced Simulation v4.2</span>
        </div>
      </footer>
    </div>
  );
}

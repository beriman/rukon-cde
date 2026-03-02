'use client';

import React, { useEffect, useState } from 'react';
import { 
  Loader2, Check, Zap, Database, Layers, 
  ShieldCheck, Sparkles, Activity, Globe,
  Clock, Terminal
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/useProjectStore';

const logTasks = [
  { id: 1, text: 'Generating ISO 19650 CDE Root Directories (WIP, Shared, Published, Archived)...', status: 'done' },
  { id: 2, text: 'Applying Naming Standard Validation Rules (RKN-ORIG-VOL-LVL-TYPE-ROLE-NR)...', status: 'done' },
  { id: 3, text: 'Syncing Team Access Control Lists (ACL) & Role Mapping...', status: 'busy' },
  { id: 4, text: 'Provisioning Cloud Storage for BIM Federated Models...', status: 'pending' },
  { id: 5, text: 'Initializing AI Project Assistant Vector Database...', status: 'pending' }
];

export default function ProjectInitializingPage() {
  const { activeProject } = useProjectStore();
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => router.push('/dashboard'), 1000);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="h-screen bg-slate-950 flex flex-col font-sans text-slate-200 overflow-hidden selection:bg-blue-500/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M100 0H0v100h100V0zM1 99V1h98v98H1z\' fill=\'%231e293b\' fill-opacity=\'0.1\'/%3E%3C/svg%3E')] opacity-20"></div>
      
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative z-10">
         {/* Rukon Logo */}
         <div className="mb-12 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-1000">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-[0_0_40px_rgba(37,99,235,0.3)]">
               R
            </div>
            <div className="text-center">
               <h1 className="text-xl font-black uppercase tracking-[0.3em] text-white">Initializing Environment</h1>
               <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-1 italic">
                 Project: {activeProject?.name || 'New Project'}
               </p>
            </div>
         </div>

         {/* Central Progress Visual */}
         <div className="relative mb-16 group">
            <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-[60px] animate-pulse group-hover:bg-blue-600/30 transition-all"></div>
            <div className="relative w-64 h-64 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-slate-900"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={754}
                    strokeDashoffset={754 - (754 * progress) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="text-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all duration-300 ease-out"
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white tracking-tighter leading-none">{progress}%</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Provisioning</span>
               </div>
            </div>
         </div>

         {/* Technical Log */}
         <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600/50"></div>
            <div className="flex items-center gap-3 mb-6">
               <Terminal size={16} className="text-blue-500" />
               <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Technical Execution Log</h2>
            </div>
            
            <div className="space-y-4 font-mono">
               {logTasks.map((task) => (
                 <div key={task.id} className="flex items-start gap-4 animate-in slide-in-from-left-4 fade-in duration-500">
                    {task.status === 'done' || (task.id === 3 && progress > 50) || (task.id === 4 && progress > 80) ? (
                      <div className="mt-1 w-4 h-4 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/30">
                         <Check size={10} strokeWidth={4} />
                      </div>
                    ) : (task.status === 'busy' || (task.id === 3 && progress <= 50) || (task.id === 4 && progress <= 80 && progress > 50)) ? (
                      <div className="mt-1 w-4 h-4 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-500 border border-blue-500/30">
                         <Loader2 size={10} className="animate-spin" />
                      </div>
                    ) : (
                      <div className="mt-1 w-4 h-4 rounded-md bg-slate-800/50 border border-slate-700"></div>
                    )}
                    <div className="flex flex-col gap-1">
                       <span className={`text-[11px] font-bold tracking-tight leading-relaxed ${
                          (task.status === 'done' || (task.id === 3 && progress > 50) || (task.id === 4 && progress > 80)) ? 'text-slate-300' : 
                          (task.status === 'busy' || (task.id === 3 && progress <= 50) || (task.id === 4 && progress <= 80 && progress > 50)) ? 'text-blue-400' : 'text-slate-600'
                       }`}>
                          <span className="uppercase opacity-50 mr-2">
                            {((task.id === 3 && progress > 50) || (task.id === 4 && progress > 80)) ? '[DONE]' : 
                             ((task.id === 3 && progress <= 50) || (task.id === 4 && progress <= 80 && progress > 50)) ? '[BUSY]' : 
                             `[${task.status.toUpperCase()}]`}
                          </span>
                          {task.text}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </main>

      {/* Info Bar */}
      <footer className="h-10 border-t border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 relative z-20">
        <div className="flex items-center gap-8">
           <span className="flex items-center gap-2 italic"><Activity size={12} /> System Kernel Active</span>
           <span className="flex items-center gap-2"><Globe size={12} /> Deployment Region: Jakarta-ID</span>
        </div>
        <div className="flex items-center gap-6 text-slate-500">
           <span className="text-blue-500/80">Infrastructure as Code (IaC) Engine v4.2</span>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Layers, AlertCircle, ChevronRight, Maximize2, 
  Settings, MousePointer2, Move, ZoomIn, Scissors, 
  Cuboid, Filter, Plus, MessageSquare, MoreHorizontal,
  Home, Globe, Shield, Clock, ChevronLeft, ChevronDown,
  Loader2, FileText
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/useProjectStore';
import { apiClient } from '@/lib/api-client';

export default function BimViewerPage() {
  const { activeProject, isLoading: isProjectLoading } = useProjectStore();
  const [topics, setTopics] = useState<any[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!activeProject && !isProjectLoading) {
      router.push('/projects');
      return;
    }

    if (activeProject) {
      fetchBcfTopics();
    }
  }, [activeProject, isProjectLoading, router]);

  const fetchBcfTopics = async () => {
    setIsLoadingTopics(true);
    try {
      const res = await apiClient.get(`/projects/${activeProject?.id}/bcf/topics`);
      setTopics(res.data || []);
    } catch (err) {
      console.error('Failed to fetch BCF topics:', err);
    } finally {
      setIsLoadingTopics(false);
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
    <div className="h-screen bg-slate-950 flex flex-col font-sans text-slate-200 overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ChevronLeft size={20} className="text-slate-400" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-900/20">
              R
            </div>
            <div>
              <h1 className="text-xs font-black uppercase tracking-[0.2em] text-white leading-none">{activeProject.name}</h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">BIM Coordination Viewer</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Model Federated</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400">
            AB
          </div>
        </div>
      </header>

      <div className="flex-grow flex relative overflow-hidden">
        {/* Left Sidebar - Model Tree */}
        <aside className={`${leftSidebarOpen ? 'w-72' : 'w-0'} bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 relative z-40 overflow-hidden flex flex-col`}>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Model Hierarchy</h2>
            <Layers size={14} className="text-slate-600" />
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            <section>
              <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Disciplines</h3>
              <div className="space-y-2">
                {[
                  { name: 'Architecture', color: 'bg-blue-500', active: true },
                  { name: 'Structural', color: 'bg-indigo-500', active: true },
                  { name: 'MEP Systems', color: 'bg-emerald-500', active: false },
                  { name: 'Site / Infra', color: 'bg-amber-500', active: true }
                ].map((d, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-[4px] ${d.active ? d.color : 'bg-slate-800 border border-slate-700'}`}></div>
                      <span className={`text-xs font-bold ${d.active ? 'text-slate-300' : 'text-slate-600'} group-hover:text-white transition-colors`}>{d.name}</span>
                    </div>
                    <Settings size={12} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Levels</h3>
              <div className="space-y-1">
                {['Level 02 - Platform', 'Level 01 - Concourse', 'Ground Level', 'Basement 01'].map((l, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group transition-all">
                    <ChevronRight size={12} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                    <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200">{l}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="p-4 border-t border-slate-800 bg-slate-950/30">
             <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all">
                Add Model File
             </button>
          </div>
        </aside>

        {/* Toggle Left Button */}
        <button 
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-slate-800 border border-slate-700 p-1 rounded-r-lg text-slate-500 hover:text-white transition-all shadow-xl"
        >
          {leftSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Main 3D Viewport */}
        <main className="flex-grow bg-slate-950 relative overflow-hidden group">
          {/* Mock 3D Model Rendering */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 flex items-center justify-center">
             <div className="relative w-full h-full opacity-40 mix-blend-screen pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503387762-592cd58cd47f?q=80&w=2000&auto=format&fit=crop')] bg-center bg-cover grayscale contrast-125"></div>
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>
             </div>
             
             {/* 3D Grid Overlay */}
             <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M100 0H0v100h100V0zM1 99V1h98v98H1z\' fill=\'%231e293b\' fill-opacity=\'0.1\'/%3E%3C/svg%3E')] opacity-50"></div>
             
             {/* Center Label */}
             <div className="text-center z-10">
                <Cuboid size={64} className="text-blue-500/20 mx-auto mb-4 animate-pulse" />
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Web-IFC Engine v3.0 Active</p>
             </div>
          </div>

          {/* Floating HUD Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1 z-40">
            {[
              { icon: MousePointer2, label: 'Select' },
              { icon: Move, label: 'Pan' },
              { icon: Globe, label: 'Orbit' },
              { icon: ZoomIn, label: 'Zoom' },
              { icon: Scissors, label: 'Section' },
              { icon: Maximize2, label: 'Fit' },
              { icon: Home, label: 'Home' }
            ].map((tool, i) => (
              <button key={i} className={`p-3 rounded-xl transition-all group relative ${i === 2 ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:bg-slate-800 hover:text-white'}`}>
                <tool.icon size={18} />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-[9px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-slate-700">
                  {tool.label}
                </span>
              </button>
            ))}
          </div>

          {/* Selection Contextual Overlay */}
          <div className="absolute bottom-8 right-8 w-80 bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-40 transform transition-transform duration-500 translate-y-0 group-hover:translate-y-0">
             <div className="p-4 bg-blue-600/10 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none pt-0.5">Selected Element</h4>
                </div>
                <MoreHorizontal size={14} className="text-slate-500" />
             </div>
             <div className="p-5 space-y-4">
                <div>
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Identity</p>
                   <p className="text-xs font-black text-white italic uppercase tracking-tight">Concrete Column: C1-400x400</p>
                   <p className="text-[9px] font-medium text-slate-600 font-mono mt-1">GUID: 2xYz9A_BhC1dR_4mLeQ</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Material</p>
                      <p className="text-[11px] font-bold text-slate-300 uppercase italic">Concrete K-350</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Level</p>
                      <p className="text-[11px] font-bold text-slate-300 uppercase italic">Level 01</p>
                   </div>
                </div>
                <button className="w-full py-3 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                   <FileText size={14} />
                   Open 2D Drawing
                </button>
             </div>
          </div>
        </main>

        {/* Right Sidebar - Issues */}
        <aside className={`${rightSidebarOpen ? 'w-80' : 'w-0'} bg-slate-900/50 backdrop-blur-xl border-l border-slate-800 transition-all duration-300 relative z-40 overflow-hidden flex flex-col`}>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/20">
            <div className="flex items-center gap-2">
               <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Coordination Issues</h2>
               <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 uppercase tracking-widest">{topics.length}</span>
            </div>
            <Filter size={14} className="text-slate-600 hover:text-blue-500 cursor-pointer" />
          </div>
          
          <div className="p-4 bg-slate-900/30 border-b border-slate-800">
             <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 active:scale-95">
                <Plus size={16} />
                Create Issue (Pin)
             </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {isLoadingTopics ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <Loader2 size={24} className="text-blue-500 animate-spin" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Fetching issues...</p>
              </div>
            ) : topics.length > 0 ? topics.map((issue, i) => (
              <div key={issue.id} className="group rounded-2xl border border-slate-800 bg-slate-950/40 p-4 hover:border-blue-500/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                   <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{issue.guid.split('-')[0].toUpperCase()}</span>
                   <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                      issue.status === 'OPEN' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                      issue.status === 'IN_PROGRESS' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                   }`}>
                      {issue.status}
                   </div>
                </div>
                <h4 className="text-xs font-black text-white group-hover:text-blue-400 transition-colors uppercase italic tracking-tight">{issue.title}</h4>
                
                <div className="mt-4 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                      <Clock size={10} />
                      {new Date(issue.createdAt).toLocaleDateString()}
                   </div>
                   <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                      issue.priority === 'CRITICAL' ? 'text-red-500' : 
                      issue.priority === 'HIGH' ? 'text-amber-500' : 'text-slate-500'
                   }`}>
                      {issue.priority}
                   </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center border border-dashed border-slate-800 rounded-3xl text-slate-600 font-bold uppercase tracking-widest text-[9px]">
                No issues found in this model
              </div>
            )}
          </div>
        </aside>

        {/* Toggle Right Button */}
        <button 
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-slate-800 border border-slate-700 p-1 rounded-l-lg text-slate-500 hover:text-white transition-all shadow-xl"
        >
          {rightSidebarOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Footer / Info Bar */}
      <footer className="h-8 border-t border-slate-800 bg-slate-950 flex items-center justify-between px-4 shrink-0 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
        <div className="flex items-center gap-6">
           <span className="flex items-center gap-2"><Globe size={10} /> EPSG:3857 (WGS 84)</span>
           <span className="flex items-center gap-2"><Clock size={10} /> Sync: Online</span>
        </div>
        <div className="flex items-center gap-6 text-slate-500">
           <span>Rukon2 BIM Engine v4.2</span>
        </div>
      </footer>
    </div>
  );
}

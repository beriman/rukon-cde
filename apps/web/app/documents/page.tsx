'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Folder, Search, Filter, MoreVertical, 
  Download, History, Info, ChevronRight, ChevronLeft,
  Plus, Upload, Globe, Clock, Activity, Loader2,
  CheckCircle2, AlertCircle, Layers, Database
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/useProjectStore';
import { apiClient } from '@/lib/api-client';

export default function DocumentsPage() {
  const { activeProject, isLoading: isProjectLoading } = useProjectStore();
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeState, setActiveState] = useState('WIP');
  const router = useRouter();

  useEffect(() => {
    if (!activeProject && !isProjectLoading) {
      router.push('/projects');
      return;
    }

    if (activeProject) {
      fetchData();
    }
  }, [activeProject, isProjectLoading, router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const folderRes = await apiClient.get(`/projects/${activeProject?.id}/folders`);
      setFolders(folderRes.data || []);
      
      // In a real app, we'd fetch files based on the active folder/state
      // For this implementation, we'll fetch all files for the project
      // Assuming endpoint GET /files?projectId=...
      // res = await apiClient.get(`/files?projectId=${activeProject?.id}`);
      // setFiles(res.data || []);
      
      // Mocking some files for visual density
      setFiles([
        { id: '1', name: 'Structural_Plan_L01.pdf', isoName: 'RKN-ARC-V01-L01-DR-A-0001', version: 'V2', status: 'Approved', owner: 'Alex B.', date: '2h ago', size: '4.2 MB' },
        { id: '2', name: 'MEP_Coordination_V4.dwg', isoName: 'RKN-MEP-V01-ZZ-DR-M-0042', version: 'V4', status: 'WIP', owner: 'Siti A.', date: '5h ago', size: '12.8 MB' },
        { id: '3', name: 'Foundation_Detail_SecA.pdf', isoName: 'RKN-STR-V01-L00-DR-S-0012', version: 'V1', status: 'Pending', owner: 'Alex B.', date: '1d ago', size: '2.1 MB' },
        { id: '4', name: 'Site_Layout_Final.ifc', isoName: 'RKN-SIT-V01-ZZ-MD-C-0001', version: 'V3', status: 'Approved', owner: 'Budi S.', date: '3d ago', size: '84.5 MB' },
      ]);
    } catch (err) {
      console.error('Failed to fetch document data:', err);
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
    <div className="h-screen bg-slate-950 flex flex-col font-sans text-slate-200 overflow-hidden">
      {/* Navigation Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-50">
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
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">CDE Document Management</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="h-8 w-64 rounded-lg border border-slate-800 bg-slate-900/50 pl-9 pr-4 text-xs font-medium focus:border-blue-500 transition-all placeholder:text-slate-700 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-black text-white hover:bg-blue-500 transition-all shadow-lg active:scale-95 uppercase tracking-widest">
            <Upload size={14} />
            Upload
          </button>
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400">
            AB
          </div>
        </div>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* Left Sidebar - CDE States & Folders */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 relative z-40 overflow-hidden flex flex-col`}>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">CDE Containers</h2>
            <Database size={14} className="text-slate-600" />
          </div>
          
          <div className="p-4 space-y-1 shrink-0 border-b border-slate-800 bg-slate-950/20">
            {['WIP', 'Shared', 'Published', 'Archived'].map((state) => (
              <button 
                key={state}
                onClick={() => setActiveState(state)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${activeState === state ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-black' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300 font-bold'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeState === state ? 'bg-white' : state === 'WIP' ? 'bg-amber-500' : state === 'Shared' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                <span className="text-[11px] uppercase tracking-widest">{state}</span>
              </button>
            ))}
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            <section>
              <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4 px-2">Folders</h3>
              <div className="space-y-1">
                {folders.length > 0 ? folders.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer group transition-all">
                    <Folder size={14} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200">{f.name}</span>
                  </div>
                )) : (
                  <div className="px-2 py-4 text-center border border-dashed border-slate-800 rounded-xl">
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">Default structure active</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </aside>

        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-slate-800 border border-slate-700 p-1 rounded-r-lg text-slate-500 hover:text-white transition-all shadow-xl"
        >
          {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* Main Content Area - File Table */}
        <main className="flex-grow flex flex-col bg-slate-950 relative overflow-hidden">
           {/* Table Header / Toolbar */}
           <div className="p-4 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Documents</span>
                    <ChevronRight size={12} className="text-slate-700" />
                    <span className="text-blue-500 italic">{activeState} Container</span>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-500 hover:text-white transition-all"><Filter size={14} /></button>
                 <button className="p-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-500 hover:text-white transition-all"><Plus size={14} /></button>
              </div>
           </div>

           {/* Data Table */}
           <div className="flex-grow overflow-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                 <thead className="sticky top-0 z-10 bg-slate-950">
                    <tr className="border-b border-slate-800 bg-slate-900/50">
                       <th className="px-6 py-3 w-10"></th>
                       <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Filename</th>
                       <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">ISO 19650 ID</th>
                       <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest w-16 text-center">Ver</th>
                       <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                       <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Owner</th>
                       <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                       <th className="px-4 py-3 w-10"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="py-20 text-center">
                          <Loader2 size={32} className="text-blue-500 animate-spin mx-auto mb-4" />
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Synchronizing CDE Index...</p>
                        </td>
                      </tr>
                    ) : files.length > 0 ? files.map((file) => (
                      <tr 
                        key={file.id} 
                        onClick={() => setSelectedFile(file)}
                        className={`group hover:bg-blue-500/[0.02] cursor-pointer transition-colors ${selectedFile?.id === file.id ? 'bg-blue-500/[0.05] border-l-2 border-l-blue-600' : ''}`}
                      >
                         <td className="px-6 py-4">
                            <FileText size={18} className={file.name.endsWith('.dwg') || file.name.endsWith('.ifc') ? 'text-indigo-500' : 'text-red-500'} />
                         </td>
                         <td className="px-4 py-4">
                            <span className="text-xs font-black text-white italic uppercase tracking-tight">{file.name}</span>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{file.size}</p>
                         </td>
                         <td className="px-4 py-4">
                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">{file.isoName}</span>
                         </td>
                         <td className="px-4 py-4 text-center">
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] font-black text-slate-400 uppercase tracking-widest">{file.version}</span>
                         </td>
                         <td className="px-4 py-4">
                            <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${
                               file.status === 'Approved' ? 'text-emerald-500' : file.status === 'WIP' ? 'text-amber-500' : 'text-blue-500'
                            }`}>
                               <div className={`w-1 h-1 rounded-full ${
                                  file.status === 'Approved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : file.status === 'WIP' ? 'bg-amber-500' : 'bg-blue-500'
                               }`}></div>
                               {file.status}
                            </div>
                         </td>
                         <td className="px-4 py-4 text-xs font-bold text-slate-500">{file.owner}</td>
                         <td className="px-4 py-4 text-[10px] font-bold text-slate-600 uppercase">{file.date}</td>
                         <td className="px-4 py-4 text-right">
                            <button className="p-2 text-slate-700 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><MoreVertical size={14} /></button>
                         </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={8} className="py-20 text-center text-slate-700 font-black uppercase tracking-widest text-xs italic opacity-40">
                          This container is currently empty
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </main>

        {/* Right Sidebar - Inspection Panel */}
        <aside className={`${selectedFile ? 'w-80' : 'w-0'} bg-slate-900 border-l border-slate-800 transition-all duration-300 relative z-40 overflow-hidden flex flex-col shadow-2xl`}>
           {selectedFile && (
             <>
               <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/20 shrink-0">
                  <h2 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">File Inspection</h2>
                  <button onClick={() => setSelectedFile(null)} className="p-1 hover:bg-slate-800 rounded text-slate-600 hover:text-white transition-all"><ChevronRight size={16} /></button>
               </div>
               
               <div className="flex-grow overflow-y-auto p-6 space-y-8">
                  <section className="space-y-4">
                     <div className="h-40 w-full rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden group/preview">
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-transparent to-transparent z-10"></div>
                        <FileText size={48} className="text-slate-800 group-hover/preview:scale-110 transition-transform duration-500" />
                        <div className="absolute bottom-3 right-3 z-20">
                           <button className="p-2 bg-blue-600 text-white rounded-lg shadow-lg opacity-0 group-hover/preview:opacity-100 transition-opacity"><Download size={14} /></button>
                        </div>
                     </div>
                     <h3 className="text-sm font-black text-white italic uppercase tracking-tight">{selectedFile.name}</h3>
                  </section>

                  <section className="space-y-4">
                     <div className="flex items-center gap-2 text-[9px] font-black text-blue-500 uppercase tracking-widest border-b border-slate-800 pb-2">
                        <Info size={12} /> ISO 19650 Metadata
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                        {[
                          { label: 'Originator', val: selectedFile.isoName.split('-')[1] },
                          { label: 'Volume/System', val: selectedFile.isoName.split('-')[2] },
                          { label: 'Level/Location', val: selectedFile.isoName.split('-')[3] },
                          { label: 'Type', val: selectedFile.isoName.split('-')[4] },
                          { label: 'Role', val: selectedFile.isoName.split('-')[5] }
                        ].map((m, i) => (
                          <div key={i} className="flex justify-between items-center">
                             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{m.label}</span>
                             <span className="text-[10px] font-black text-slate-300 font-mono">{m.val}</span>
                          </div>
                        ))}
                     </div>
                  </section>

                  <section className="space-y-4">
                     <div className="flex items-center gap-2 text-[9px] font-black text-indigo-500 uppercase tracking-widest border-b border-slate-800 pb-2">
                        <History size={12} /> Version Audit Trail
                     </div>
                     <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:h-full before:w-px before:bg-slate-800">
                        {[
                          { ver: 'V2', user: 'Alex B.', action: 'Promoted to Shared', time: '2h ago' },
                          { ver: 'V1', user: 'Budi S.', action: 'Uploaded to WIP', time: '1d ago' }
                        ].map((a, i) => (
                          <div key={i} className="relative pl-6">
                             <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                             </div>
                             <p className="text-[10px] font-black text-slate-300 uppercase tracking-tight">{a.action}</p>
                             <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{a.ver} • {a.user} • {a.time}</p>
                          </div>
                        ))}
                     </div>
                  </section>
               </div>

               <div className="p-6 border-t border-slate-800 bg-slate-950/30 shrink-0 flex gap-2">
                  <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Download</button>
                  <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">Open in Viewer</button>
               </div>
             </>
           )}
        </aside>
      </div>

      {/* Footer Info Bar */}
      <footer className="h-8 border-t border-slate-800 bg-slate-950 flex items-center justify-between px-4 shrink-0 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
        <div className="flex items-center gap-8">
           <span className="flex items-center gap-2 italic"><Globe size={10} /> EPSG:3857 (WGS 84)</span>
           <span className="flex items-center gap-2"><Clock size={10} /> Sync: Online</span>
        </div>
        <div className="flex items-center gap-6 text-slate-500">
           <span className="flex items-center gap-2"><CheckCircle2 size={10} className="text-emerald-500" /> ISO 19650 Validated</span>
           <span>Rukon2 CDE Core v4.2</span>
        </div>
      </footer>
    </div>
  );
}

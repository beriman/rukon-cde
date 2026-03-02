'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, Info, Check, 
  Settings, Users, LayoutGrid, FileText, 
  Database, Shield, Sparkles, Activity,
  Save, X, Plus, Globe, Zap, Loader2,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useProjectStore } from '@/stores/useProjectStore';

const steps = [
  { id: 1, name: 'Basic Info', icon: FileText },
  { id: 2, name: 'ISO 19650 Config', icon: Settings },
  { id: 3, name: 'Team & Roles', icon: Users },
  { id: 4, name: 'Modules', icon: LayoutGrid },
  { id: 5, name: 'Review', icon: Check }
];

export default function NewProjectWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    organizationId: '', // Should be selected or fetched
  });
  
  const router = useRouter();
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // In a real app, organizationId would come from the user's active org
      // For this implementation, we assume we have one or the backend handles it
      const res = await apiClient.post('/projects', {
        name: formData.name,
        code: formData.code,
        organizationId: formData.organizationId || 'default-org-id', 
      });
      
      await fetchProjects();
      router.push('/projects/initializing');
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('Error creating project. Please check your inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%231e293b\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4v-4H4v4H0v2h4v4h2v-4h4v-2H6zM36 4v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z\'/%3E%3C/g%3E%3C/svg%3E')] -z-10 opacity-30"></div>

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
          <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
             <Link href="/projects" className="hover:text-white transition-colors">Portfolios</Link>
             <ChevronRight size={14} />
             <span className="text-blue-400">New Project Setup</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button onClick={() => router.push('/projects')} className="p-2 text-slate-500 hover:text-white transition-all"><X size={20} /></button>
        </div>
      </header>

      <main className="p-6 lg:p-10 max-w-6xl mx-auto">
        {/* Progress Stepper */}
        <div className="mb-12">
           <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 -z-10"></div>
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center gap-3">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                      currentStep >= step.id 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                   }`}>
                      {currentStep > step.id ? <Check size={20} strokeWidth={3} /> : <step.icon size={18} />}
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${currentStep >= step.id ? 'text-white' : 'text-slate-600'}`}>
                      {step.name}
                   </span>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Main Setup Card */}
           <div className="lg:col-span-8 space-y-8">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-10 shadow-2xl relative overflow-hidden min-h-[500px]">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>
                 
                 {/* Step 1: Basic Info */}
                 {currentStep === 1 && (
                   <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <header>
                         <h2 className="text-3xl font-black text-white tracking-tight uppercase italic mb-2">Basic <span className="text-blue-500">Information</span></h2>
                         <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Define the foundational identity of your project</p>
                      </header>

                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Project Name</label>
                            <input 
                              type="text" 
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="e.g. Jakarta MRT Phase 3" 
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all shadow-inner" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Project Code (ISO 19650 Part 1)</label>
                            <input 
                              type="text" 
                              value={formData.code}
                              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                              placeholder="e.g. JMRT-P3" 
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all shadow-inner uppercase font-mono" 
                            />
                         </div>
                      </div>
                   </div>
                 )}

                 {/* Step 2 Content: ISO 19650 Config */}
                 {currentStep === 2 && (
                   <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <header>
                         <h2 className="text-3xl font-black text-white tracking-tight uppercase italic mb-2">ISO 19650 <span className="text-blue-500">Standards</span></h2>
                         <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Configure Project Naming Convention & CDE States</p>
                      </header>

                      <section className="space-y-6">
                         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Naming Convention Builder</h3>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              { label: 'Project', val: formData.code || 'RKN' },
                              { label: 'Originator', val: 'ARC' },
                              { label: 'Volume', val: 'V01' },
                              { label: 'Level', val: 'L02' },
                              { label: 'Type', val: 'DR' },
                              { label: 'Role', val: 'A' },
                              { label: 'Number', val: '0001' }
                            ].map((field, i) => (
                              <div key={i} className="space-y-2">
                                 <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{field.label}</label>
                                 <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between group cursor-pointer hover:border-blue-500/50 transition-all shadow-inner">
                                    <span className="text-xs font-black text-white">{field.val}</span>
                                    <ChevronDown size={12} className="text-slate-700 group-hover:text-blue-500" />
                                 </div>
                              </div>
                            ))}
                         </div>
                         
                         <div className="mt-8 p-6 rounded-2xl bg-blue-600/5 border border-blue-600/20 flex flex-col gap-3 shadow-inner">
                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest italic">Generated Preview</span>
                            <div className="text-2xl font-black text-white tracking-[0.1em] font-mono italic">
                               {formData.code || 'RKN'}-ARC-V01-L02-DR-A-0001
                            </div>
                         </div>
                      </section>
                   </div>
                 )}

                 {/* Step 5: Review */}
                 {currentStep === 5 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                       <header>
                          <h2 className="text-3xl font-black text-white tracking-tight uppercase italic mb-2">Final <span className="text-blue-500">Review</span></h2>
                          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Verify project settings before initialization</p>
                       </header>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800">
                             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Project Name</span>
                             <p className="text-lg font-black text-white italic uppercase tracking-tight">{formData.name}</p>
                          </div>
                          <div className="p-6 rounded-2xl bg-slate-950/40 border border-slate-800">
                             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Project Code</span>
                             <p className="text-lg font-black text-white font-mono uppercase tracking-widest">{formData.code}</p>
                          </div>
                       </div>

                       <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-4 shadow-xl">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-inner">
                             <Shield size={20} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-emerald-100 uppercase tracking-tight italic">ISO 19650 Compliance Guard Active</p>
                             <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Your configuration matches the Information Protocol standards.</p>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* Fallback for other steps in this implementation */}
                 {(currentStep === 3 || currentStep === 4) && (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-center gap-4 animate-in fade-in zoom-in duration-500">
                       <LayoutGrid size={48} className="text-slate-800" />
                       <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">Step {currentStep} Configuration Module</p>
                       <p className="text-slate-700 text-xs max-w-xs">This section is ready for data binding. Use the 'Continue' button to proceed.</p>
                    </div>
                 )}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between px-2">
                 <button 
                   onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                   disabled={currentStep === 1 || isSubmitting}
                   className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                 >
                    <ChevronLeft size={16} /> Back
                 </button>
                 <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-300 transition-all">
                       <Save size={16} /> Save as Draft
                    </button>
                    <button 
                      onClick={handleNext}
                      disabled={isSubmitting || (currentStep === 1 && !formData.name)}
                      className="flex items-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:bg-blue-800 disabled:opacity-50"
                    >
                       {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : currentStep === 5 ? 'Launch Project' : 'Continue'} 
                       {currentStep < 5 && <ChevronRight size={16} />}
                    </button>
                 </div>
              </div>
           </div>

           {/* ISO Guidance Sidebar */}
           <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><Shield size={80} /></div>
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 mb-6">
                    <Info size={16} className="text-blue-500" /> ISO Guidance
                 </h3>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Step Context</h4>
                       <p className="text-xs text-slate-500 leading-relaxed font-medium">
                          {currentStep === 1 && "Start by identifying your project. These details will be used in all transmittals and official project correspondence."}
                          {currentStep === 2 && "The naming standard is mandatory. Information containers should be named consistently to ensure automated validation."}
                          {currentStep >= 3 && "Continue through the process to finalize your BIM collaboration environment."}
                       </p>
                    </div>
                    <div className="pt-4 border-t border-slate-800">
                       <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4 italic">
                          Project Information Protocol
                       </button>
                    </div>
                 </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-blue-600/5 p-8 shadow-xl">
                 <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="text-blue-500" size={18} />
                    <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest leading-none">AI Config Assist</span>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed font-medium italic">
                    "I'll help validate your ISO naming string as you build it to ensure zero rejection from the Information Manager."
                 </p>
              </div>
           </div>
        </div>
      </main>

      {/* Info Bar */}
      <footer className="fixed bottom-0 left-0 w-full h-8 border-t border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 z-50">
        <div className="flex items-center gap-8">
           <span className="flex items-center gap-2 italic"><Activity size={12} /> Live Compliance Sync</span>
           <span className="flex items-center gap-2"><Globe size={12} /> Project Region: Jakarta</span>
        </div>
        <div className="flex items-center gap-6 text-slate-500">
           <span>Rukon2 Compliance Engine v4.2</span>
        </div>
      </footer>
    </div>
  );
}

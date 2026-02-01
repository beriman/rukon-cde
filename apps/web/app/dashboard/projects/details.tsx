'use client';

import React, { useState, useEffect } from 'react';
import { 
    QrCode, 
    Users, 
    Mail, 
    Shield, 
    Plus,
    Copy,
    Share2,
    Briefcase,
    TrendingUp,
    Zap,
    LayoutDashboard,
    FileText,
    Box,
    Clock,
    DollarSign,
    HardHat,
    Settings,
    X,
    Maximize2,
    Eye,
    Video,
    Workflow,
    GitBranch,
    ChevronRight,
    ShieldCheck,
    FileSearch,
    DownloadCloud,
    Loader2,
    MoreHorizontal,
    Activity,
    Lock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { IfcViewer } from '@/components/viewer/IfcViewer';

interface ProjectDetailsProps {
    projectId: string;
}

const AVAILABLE_WIDGETS = [
    { id: '3D_VIEWER', name: '3D BIM Viewer', icon: Box, color: 'text-blue-400', desc: 'Interactive 3D models (IFC)' },
    { id: '4D_SIM', name: '4D Schedule', icon: Clock, color: 'text-amber-400', desc: 'Time-based construction simulation' },
    { id: '5D_COST', name: '5D Cost Heatmap', icon: DollarSign, color: 'text-emerald-400', desc: 'Visual cost distribution on model' },
    { id: 'MIDP_MONITOR', name: 'MIDP Analytics', icon: LayoutDashboard, color: 'text-cyan-400', desc: 'Monitor Task Information Delivery Plans (TIDP)' },
    { id: 'LIVE_CAMERA', name: 'Live Site Camera', icon: Video, color: 'text-rose-400', desc: 'Real-time CCTV & site monitoring' },
    { id: '2D_DOCS', name: '2D Documents', icon: FileText, color: 'text-indigo-400', desc: 'Pinned technical drawings & PDFs' },
    { id: 'S_CURVE', name: 'Progress Curve', icon: TrendingUp, color: 'text-fuchsia-400', desc: 'S-Curve (Target vs Actual)' },
    { id: 'HSE', name: 'HSE Metrics', icon: HardHat, color: 'text-orange-400', desc: 'Safety statistics & safe days' },
];

export default function ProjectDashboard({ projectId }: ProjectDetailsProps) {
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const [showWidgetSettings, setShowWidgetSettings] = useState(false);
    const [activeWidgets, setActiveWidgets] = useState<string[]>(['S_CURVE', '3D_VIEWER', 'MIDP_MONITOR']);
    const [midpData, setMidpData] = useState<any>(null);
    const [generatingReport, setGeneratingReport] = useState(false);

    useEffect(() => {
        fetchProjectData();
    }, [projectId]);

    const fetchProjectData = async () => {
        try {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            const headers = { Authorization: `Bearer ${token}` };
            
            const [projRes, midpRes] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, { headers }),
                axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects-business/projects/${projectId}/midp-analytics`, { headers }).catch(() => ({ data: { summary: {} } }))
            ]);

            setProject(projRes.data);
            setMidpData(midpRes.data.summary);
            setIsAdmin(projRes.data.ownerId === user?.id);
            if (projRes.data.activeWidgets) {
                setActiveWidgets(projRes.data.activeWidgets);
            }
        } catch (error) {
            console.error('Failed to fetch project data', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleWidget = async (widgetId: string) => {
        const newWidgets = activeWidgets.includes(widgetId) 
            ? activeWidgets.filter(id => id !== widgetId)
            : [...activeWidgets, widgetId];
        setActiveWidgets(newWidgets);
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/projects-business/projects/${projectId}/widgets`, 
                { widgets: newWidgets },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {}
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-6">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-blue-400 font-bold tracking-[0.3em] text-sm animate-pulse uppercase">Initializing Command Center</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-300 font-sans selection:bg-blue-500/30">
            {/* Top Navigation Bar */}
            <nav className="h-20 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0f172a]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                        {project?.code?.substring(0, 1)}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">{project?.name}</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{project?.currentStage} PHASE</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Project Status</p>
                        <p className="text-xs font-bold text-green-400">92% Compliance</p>
                    </div>

                    {/* New AI Search Bar (Cycle 3) */}
                    <div className="relative group hidden xl:block">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Activity className="w-4 h-4 text-blue-500/50 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input 
                            type="text" 
                            placeholder="COMMAND: Search Element, ID, or Document..." 
                            className="bg-slate-900/50 border border-slate-800 rounded-2xl py-2.5 pl-11 pr-20 text-[10px] font-black uppercase tracking-wider text-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all w-[350px] placeholder:text-slate-600"
                        />
                        <div className="absolute right-4 inset-y-0 flex items-center">
                            <span className="text-[9px] font-bold text-slate-700 border border-slate-800 px-1.5 py-0.5 rounded bg-slate-950">CTRL + K</span>
                        </div>
                    </div>

                    {isAdmin && (
                        <button 
                            onClick={() => setShowWidgetSettings(true)}
                            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700/50"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={() => setShowQr(true)} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700/50">
                        <QrCode className="w-5 h-5" />
                    </button>
                    <div className="h-10 w-px bg-slate-800 mx-2" />
                    <button 
                        onClick={() => {}} // generateAuditReport
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] flex items-center gap-2"
                    >
                        <FileSearch className="w-4 h-4" /> Quick Audit
                    </button>
                </div>
            </nav>

            <div className="p-8 max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Heavy Assets (3D/Camera) */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Main Integrated BIM Environment */}
                    {activeWidgets.some(w => ['3D_VIEWER', '4D_SIM', '5D_COST'].includes(w)) && (
                        <div className="rounded-[2.5rem] bg-[#1e293b] border border-slate-800 shadow-2xl overflow-hidden relative group">
                            <div className="p-6 flex justify-between items-center border-b border-slate-800/50 bg-slate-900/40">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Box className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <h3 className="font-bold text-white text-sm">Rukon High-Precision BIM Engine</h3>
                                </div>
                                <div className="flex gap-2">
                                    {activeWidgets.includes('4D_SIM') && <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black rounded-full border border-amber-500/20">4D_ACTIVE</span>}
                                    {activeWidgets.includes('5D_COST') && <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-full border border-emerald-500/20">5D_ACTIVE</span>}
                                </div>
                            </div>
                            <div className="h-[600px] bg-slate-950 relative">
                                <IfcViewer 
                                    modelUrl={`${process.env.NEXT_PUBLIC_API_URL}/files/demo-model/download`} 
                                    projectId={projectId}
                                    fileId="demo-model"
                                />
                                {/* HUD Overlay */}
                                <div className="absolute bottom-6 left-6 pointer-events-none">
                                    <div className="p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/50">
                                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-2">Model Intelligence</p>
                                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                            <div><p className="text-[10px] text-slate-400">Elements</p><p className="text-xs font-bold text-white">12,402</p></div>
                                            <div><p className="text-[10px] text-slate-400">Latent Issues</p><p className="text-xs font-bold text-red-400">12</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Live Site Monitoring */}
                        {activeWidgets.includes('LIVE_CAMERA') && (
                            <div className="rounded-[2.5rem] bg-[#1e293b] border border-slate-800 shadow-xl overflow-hidden group">
                                <div className="p-6 flex justify-between items-center bg-slate-900/40 border-b border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                        <h4 className="font-bold text-white text-xs uppercase tracking-widest">Site_Cam_01</h4>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-500 italic">MRT3_SOUTH_ENTRANCE</span>
                                </div>
                                <div className="aspect-video w-full bg-slate-950 relative">
                                    <div className="absolute top-4 left-4 font-mono text-[9px] text-white/40 space-y-0.5">
                                        <p>ISO_100 | F2.8 | 60FPS</p>
                                        <p>LAT: -6.1754 | LON: 106.8272</p>
                                    </div>
                                    <div className="w-full h-full flex flex-col items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Video className="w-12 h-12 text-white mb-2" />
                                        <p className="text-[10px] font-bold text-white tracking-[0.2em]">ENCRYPTED_FEED</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* S-Curve Analytics */}
                        {activeWidgets.includes('S_CURVE') && (
                            <div className="rounded-[2.5rem] bg-[#1e293b] border border-slate-800 p-8 shadow-xl">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h4 className="font-bold text-white flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-fuchsia-400" />
                                            Executive S-Curve
                                        </h4>
                                        <p className="text-[10px] text-slate-500 mt-1">Real-time Project Velocity</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-fuchsia-400">-0.4%</p>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase">Variance</p>
                                    </div>
                                </div>
                                <div className="h-[180px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[
                                            { name: 'W1', target: 10, actual: 8 },
                                            { name: 'W2', target: 25, actual: 20 },
                                            { name: 'W3', target: 45, actual: 42 },
                                            { name: 'W4', target: 70, actual: 65 },
                                        ]}>
                                            <defs>
                                                <linearGradient id="colorFuchsia" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.2}/>
                                                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                            <XAxis dataKey="name" hide />
                                            <YAxis hide />
                                            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155'}} />
                                            <Area type="monotone" dataKey="target" stroke="#334155" fill="transparent" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                            <Area type="monotone" dataKey="actual" stroke="#d946ef" fill="url(#colorFuchsia)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Data & Intelligence (MIDP/Correspondence) */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* MIDP Monitoring (Deeper Logic) */}
                    {activeWidgets.includes('MIDP_MONITOR') && (
                        <div className="rounded-[2.5rem] bg-[#1e293b] border border-slate-800 p-8 shadow-xl">
                            <h4 className="font-bold text-white mb-8 flex items-center gap-3">
                                <Activity className="w-5 h-5 text-cyan-400" />
                                MIDP Intelligence
                            </h4>
                            <div className="space-y-6">
                                {['ARCH', 'STRUCT', 'MEP'].map((disc) => (
                                    <div key={disc} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{disc} DISCIPLINE</span>
                                            <span className="text-xs font-bold text-white">72%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{width: '72%'}} />
                                        </div>
                                        <div className="flex justify-between text-[9px] font-bold">
                                            <span className="text-green-500">42 APPV</span>
                                            <span className="text-red-500">3 REJT</span>
                                            <span className="text-slate-500">60 PLANNED</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-10 py-4 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] rounded-2xl transition-all">
                                View Full Delivery Schedule
                            </button>
                        </div>
                    )}

                    {/* Official Correspondance (Aconex Moat) */}
                    <div className="rounded-[2.5rem] bg-slate-950 border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <ShieldCheck className="w-20 h-20 text-blue-500" />
                        </div>
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="font-bold text-white flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500" />
                                Official Hub
                            </h4>
                            <Lock className="w-3 h-3 text-slate-600" />
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-all cursor-pointer group">
                                <div className="flex justify-between mb-1">
                                    <span className="text-[9px] font-black text-blue-500 uppercase">PT JAKPRO</span>
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">REF: LTR-0042</span>
                                </div>
                                <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors line-clamp-1">Field Instruction: Basement 2 Elevation Adjustments</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[8px] font-bold text-slate-500 uppercase">2h ago</span>
                                    <div className="flex items-center gap-1 text-[8px] font-black text-emerald-400">
                                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all">
                            Draft Official Letter
                        </button>
                    </div>

                </div>
            </div>

            {/* Admin Settings Modal (Re-Styled) */}
            {showWidgetSettings && (
                <div className="fixed inset-0 bg-[#0f172a]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-[#1e293b] rounded-[3rem] w-full max-w-4xl overflow-hidden border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <div>
                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Command Center OS</h3>
                                <p className="text-slate-500 text-sm font-light mt-1 uppercase tracking-widest">Architectural Visualization & Management</p>
                            </div>
                            <button onClick={() => setShowWidgetSettings(false)} className="p-4 hover:bg-slate-800 rounded-2xl transition-colors">
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>
                        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {AVAILABLE_WIDGETS.map((w) => (
                                <div 
                                    key={w.id} 
                                    onClick={() => toggleWidget(w.id)}
                                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col gap-4 ${
                                        activeWidgets.includes(w.id) 
                                            ? 'border-blue-500 bg-blue-500/10' 
                                            : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                                    }`}
                                >
                                    <div className={`p-4 rounded-2xl bg-slate-950 shadow-inner ${w.color}`}>
                                        <w.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{w.name}</h4>
                                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-2">{w.desc}</p>
                                    </div>
                                    <div className={`mt-auto w-full h-1 rounded-full ${activeWidgets.includes(w.id) ? 'bg-blue-500' : 'bg-slate-800'}`} />
                                </div>
                            ))}
                        </div>
                        <div className="p-10 bg-slate-900/50 flex justify-between items-center border-t border-slate-800">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Shield className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise Mode Active</span>
                            </div>
                            <button onClick={() => setShowWidgetSettings(false)} className="px-12 py-4 bg-white text-[#0f172a] rounded-[1.5rem] text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                                Synchronize Layout
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Project QR Modal */}
            {showQr && (
                <div className="fixed inset-0 bg-[#0f172a]/95 backdrop-blur-2xl z-[110] flex items-center justify-center p-6 animate-in fade-in" onClick={() => setShowQr(false)}>
                    <div className="bg-white p-12 rounded-[4rem] text-center max-w-sm w-full relative shadow-[0_0_100px_rgba(37,99,235,0.3)]" onClick={e => e.stopPropagation()}>
                        <div className="bg-slate-50 p-8 rounded-[3rem] border-4 border-white shadow-inner mb-8">
                            <QRCodeSVG value={projectId} size={240} level="H" includeMargin={true} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Access Point</h3>
                        <p className="text-sm text-slate-400 mt-2 font-light">Scan to join the digital ecosystem of <strong>{project?.name}</strong>.</p>
                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <p className="text-[10px] text-slate-300 uppercase font-bold tracking-[0.3em] mb-4">Project Token</p>
                            <div className="bg-slate-50 py-4 px-6 rounded-2xl text-[10px] font-mono text-slate-500 break-all select-all border border-slate-100 uppercase">
                                {projectId}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
    CloudRain, 
    Sun, 
    Cloud, 
    Thermometer, 
    Droplets, 
    CheckCircle2, 
    Camera, 
    AlertTriangle,
    ShieldCheck,
    ArrowRight,
    Loader2,
    Calendar as CalendarIcon
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

export default function DailyLogWidget({ projectId }: { projectId: string }) {
    const [loading, setLoading] = useState(true);
    const [logData, setLogData] = useState<any>(null);

    useEffect(() => {
        fetchDailyLog();
    }, [projectId]);

    const fetchDailyLog = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/construction/daily-log/${projectId}`, { headers });
            setLogData(response.data);
        } catch (error) {
            console.error('Failed to fetch daily log', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-400" /></div>;

    const { report, summary } = logData;

    return (
        <div className="glass-card rounded-[3rem] bg-[#1e293b] border border-slate-800 overflow-hidden shadow-2xl">
            {/* Header with Weather */}
            <div className="p-8 bg-slate-900/40 border-b border-slate-800/50 flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <CalendarIcon className="w-6 h-6 text-blue-400" />
                        Daily Site Intelligence
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">
                        {format(new Date(), 'EEEE, dd MMMM yyyy')}
                    </p>
                </div>
                
                <div className="flex items-center gap-6 bg-slate-950/50 px-6 py-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2">
                        {report?.weatherCondition === 'Sunny' ? <Sun className="w-5 h-5 text-amber-400" /> : <CloudRain className="w-5 h-5 text-blue-400" />}
                        <span className="text-xs font-bold text-white">{report?.weatherCondition || 'Updating...'}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-800" />
                    <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold text-white">{report?.temperature || '--'}°C</span>
                    </div>
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Progress Stats */}
                <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Site Progress</p>
                    <div className="bg-slate-900/30 p-5 rounded-[2rem] border border-slate-800">
                        <p className="text-3xl font-black text-white">{summary.completedTasksCount}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Tasks Completed Today</p>
                        <div className="mt-4 space-y-2">
                            {summary.completedTasks.slice(0, 2).map((t: any) => (
                                <div key={t.id} className="flex items-center gap-2 text-[10px] text-slate-500">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {t.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Safety Stats */}
                <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Safety (HSE)</p>
                    <div className={`p-5 rounded-[2rem] border ${summary.safeWorkDay ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                        <div className="flex justify-between items-start">
                            <p className={`text-3xl font-black ${summary.safeWorkDay ? 'text-emerald-400' : 'text-red-400'}`}>
                                {summary.safeWorkDay ? 'ZERO' : summary.incidentsCount}
                            </p>
                            <ShieldCheck className={`w-6 h-6 ${summary.safeWorkDay ? 'text-emerald-500' : 'text-red-500'}`} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Incidents Recorded</p>
                        <div className="mt-4">
                            <span className="px-2 py-1 bg-slate-900 text-[9px] font-black text-slate-400 rounded-md">
                                MAN-HOURS: {report?.manhours || 0}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Site Visuals */}
                <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Site Visuals</p>
                    <div className="relative group rounded-[2rem] overflow-hidden border border-slate-800 bg-slate-900 aspect-square flex items-center justify-center cursor-pointer">
                        {summary.photos.length > 0 ? (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                <Camera className="w-10 h-10 text-slate-600" />
                                <span className="absolute bottom-4 right-4 bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg">
                                    +{summary.photos.length} PHOTOS
                                </span>
                            </div>
                        ) : (
                            <div className="text-center opacity-20">
                                <Camera className="w-10 h-10 text-white mx-auto mb-2" />
                                <p className="text-[9px] font-bold uppercase tracking-widest text-white">No Photos Uploaded</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ArrowRight className="text-white w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-6 bg-slate-900/60 border-t border-slate-800/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Live Aggregation Active</span>
                </div>
                <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Generate Formal Report
                </button>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Box, 
    Clock, 
    AlertTriangle,
    ArrowUpRight,
    CheckCircle2,
    MessageSquare,
    Bell,
    Calendar,
    Loader2,
    ChevronRight,
    TrendingUp,
    FolderKanban
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetchData();
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [dashRes, notifRes] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me/dashboard`, { headers }),
                axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications?limit=10`, { headers })
            ]);

            setDashboardData(dashRes.data);
            setNotifications(notifRes.data.data || []);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRespondJoin = async (requestId: string, action: 'ACCEPT' | 'REJECT') => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/projects-business/requests/${requestId}/respond`, 
                { action },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Refresh notifications
            fetchData();
        } catch (error) {
            console.error('Failed to respond to join request', error);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
            </div>
        );
    }

    const allTasks = dashboardData.flatMap(project => 
        project.tasks.map((task: any) => ({
            ...task,
            projectName: project.name,
            projectCode: project.code
        }))
    ).sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    const pendingTasksCount = allTasks.length;

    return (
        <div className="p-4 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-semibold text-slate-800 tracking-tight mb-2">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 font-light">
                        Hello, <span className="font-medium text-slate-700">{user?.name || 'Master'}</span>. You have <span className="font-bold text-blue-600">{pendingTasksCount}</span> pending tasks today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Projects & Tasks */}
                <div className="lg:col-span-8 space-y-10">
                    
                    {/* Projects Section */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <FolderKanban className="w-5 h-5 text-blue-500" />
                                My Projects
                            </h2>
                            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {dashboardData.map((project) => (
                                <div key={project.id} className="glass-card p-6 rounded-[2rem] hover:shadow-xl transition-all border border-slate-50 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-lg font-bold">
                                            {project.code.substring(0, 2)}
                                        </div>
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase">
                                            {project.taskCount} Tasks
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">{project.name}</h3>
                                    <p className="text-xs text-slate-400 mb-6">{project.organizationName}</p>
                                    <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold group-hover:bg-slate-900 group-hover:text-white transition-all flex items-center justify-center gap-2">
                                        Enter Project <ArrowUpRight className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {dashboardData.length === 0 && (
                                <div className="col-span-2 py-10 text-center glass-card rounded-[2rem] border-dashed border-2 border-slate-100">
                                    <p className="text-slate-400 text-sm">No active projects found.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Tasks Section */}
                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Priority Tasks
                            </h2>
                            <button className="text-xs font-bold text-slate-400">Sort by Date</button>
                        </div>
                        <div className="space-y-4">
                            {allTasks.slice(0, 5).map((task: any) => (
                                <div key={task.id} className="glass-card p-5 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors border border-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${
                                            task.type === 'BCF_TOPIC' ? 'bg-red-50 text-red-500' : 
                                            task.type === 'INCIDENT_ACTION' ? 'bg-amber-50 text-amber-500' : 
                                            'bg-blue-50 text-blue-500'
                                        }`}>
                                            {task.type === 'BCF_TOPIC' ? <AlertTriangle className="w-4 h-4" /> : 
                                             task.type === 'INCIDENT_ACTION' ? <Clock className="w-4 h-4" /> : 
                                             <Box className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{task.title}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-medium">
                                                {task.projectCode} • {task.type.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xs font-bold ${
                                            task.dueDate && new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-slate-500'
                                        }`}>
                                            {task.dueDate ? format(new Date(task.dueDate), 'dd MMM') : 'No Date'}
                                        </p>
                                        <button className="text-[10px] font-bold text-blue-600 hover:underline">Action</button>
                                    </div>
                                </div>
                            ))}
                            {allTasks.length === 0 && (
                                <div className="py-8 text-center glass-card rounded-2xl bg-slate-50/50">
                                    <p className="text-slate-400 text-sm">All clear! No pending tasks.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Inbox & Notifications */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Inbox / Notifications */}
                    <div className="glass-card p-6 rounded-[2.5rem] bg-white border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-indigo-500" />
                                Private Inbox
                            </h3>
                            <span className="w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                {notifications.filter(n => !n.read).length}
                            </span>
                        </div>
                        
                        <div className="space-y-6">
                            {notifications.length > 0 ? notifications.map((notif) => (
                                <div key={notif.id} className="group cursor-pointer">
                                    <div className="flex gap-4 items-start">
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.read ? 'bg-transparent' : 'bg-blue-500'}`}></div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                {notif.title}
                                            </p>
                                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed font-light">
                                                {notif.message}
                                            </p>

                                            {notif.type === 'PROJECT_JOIN_REQUEST' && !notif.read && (
                                                <div className="flex gap-2 mt-3">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleRespondJoin(notif.data?.requestId, 'ACCEPT'); }}
                                                        className="px-3 py-1 bg-blue-600 text-white text-[9px] font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleRespondJoin(notif.data?.requestId, 'REJECT'); }}
                                                        className="px-3 py-1 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-lg hover:bg-slate-200 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            <p className="text-[9px] text-slate-300 uppercase mt-2 font-bold tracking-wider">
                                                {format(new Date(notif.createdAt), 'HH:mm • dd MMM')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-6 opacity-30">
                                    <Bell className="w-8 h-8 mx-auto mb-2" />
                                    <p className="text-xs">No new messages</p>
                                </div>
                            )}
                        </div>
                        
                        <button className="w-full mt-8 py-3 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-bold hover:bg-slate-100 hover:text-slate-600 transition-all uppercase tracking-widest">
                            View All Notifications
                        </button>
                    </div>

                    {/* Quick Insights */}
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            Insights
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-[10px] mb-2 uppercase tracking-widest opacity-60">
                                    <span>Task Completion</span>
                                    <span>65%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[65%]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] mb-2 uppercase tracking-widest opacity-60">
                                    <span>Project Health</span>
                                    <span>Stable</span>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-green-500' : 'bg-white/10'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <p className="text-[10px] italic opacity-50 font-light leading-relaxed">
                                "Efficiency is doing things right; effectiveness is doing the right things." - Drucker
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

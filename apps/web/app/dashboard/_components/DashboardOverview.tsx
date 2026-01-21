'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api-client';
import {
    Layout,
    CheckSquare,
    AlertCircle,
    MessageSquare,
    ChevronRight,
    Briefcase,
    Calendar
} from 'lucide-react';

interface Task {
    id: string;
    title: string;
    status: string;
    dueDate: string | null;
    type: 'DELIVERABLE' | 'INCIDENT_ACTION' | 'BCF_TOPIC';
    priority?: string;
}

interface ProjectData {
    id: string;
    name: string;
    code: string;
    organizationName: string;
    taskCount: number;
    tasks: Task[];
}

export function DashboardOverview() {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/users/me/dashboard');
                setProjects(response.data);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    }

    if (projects.length === 0) {
        return (
            <div className="p-8 text-center glass-card rounded-2xl border border-white/40">
                <Briefcase className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-700">No Projects Found</h3>
                <p className="text-slate-500 mt-2">You are not part of any active projects yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
                <div key={project.id} className="glass-card rounded-2xl p-6 border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                                    {project.code}
                                </span>
                                <span className="text-xs text-slate-500">{project.organizationName}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800">{project.name}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                            <CheckSquare className="w-4 h-4" />
                            {project.taskCount} Tasks
                        </div>
                    </div>

                    {project.tasks.length > 0 ? (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">My Assigned Tasks</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {project.tasks.map((task) => (
                                    <div key={task.id} className="bg-white/60 p-3 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors flex flex-col justify-between">
                                        <div className="flex items-start gap-3 mb-2">
                                            <div className={`mt-0.5 p-1.5 rounded-md ${
                                                task.type === 'DELIVERABLE' ? 'bg-emerald-100 text-emerald-600' :
                                                task.type === 'INCIDENT_ACTION' ? 'bg-rose-100 text-rose-600' :
                                                'bg-amber-100 text-amber-600'
                                            }`}>
                                                {task.type === 'DELIVERABLE' && <CheckSquare className="w-4 h-4" />}
                                                {task.type === 'INCIDENT_ACTION' && <AlertCircle className="w-4 h-4" />}
                                                {task.type === 'BCF_TOPIC' && <MessageSquare className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800 line-clamp-2">{task.title}</p>
                                                <p className="text-xs text-slate-500 mt-1 capitalize">
                                                    {task.status.toLowerCase().replace('_', ' ')}
                                                </p>
                                            </div>
                                        </div>
                                        {task.dueDate && (
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2 pl-10">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-400 italic bg-slate-50/50 p-4 rounded-lg text-center">
                            No open tasks assigned to you in this project.
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

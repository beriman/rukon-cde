'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { hseService, HseStats } from '@/lib/api/hse.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, Activity, AlertTriangle, Users, HardHat, ClipboardCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function HseDashboardPage() {
    const params = useParams();
    const projectId = params.projectId as string;

    const { data: stats, isLoading } = useQuery<HseStats>({
        queryKey: ['hse-stats', projectId],
        queryFn: () => hseService.getStats(projectId),
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading safety statistics...</div>;

    const metrics = [
        { label: 'Safe Manhours', value: stats?.totalManhours.toLocaleString(), icon: HardHat, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'LTI Free Days', value: stats?.ltiFreeDays, icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Incidents (Month)', value: stats?.incidentsLastMonth, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'LTIR (Frequency)', value: stats?.ltiRate, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">HSE Dashboard</h1>
                    <p className="text-gray-500">Health, Safety, and Environment monitoring.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{m.label}</p>
                                    <h3 className="text-2xl font-bold mt-1">{m.value}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${m.bg}`}>
                                    <m.icon className={`w-6 h-6 ${m.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Incident Frequency Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats?.monthlyTrends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" fontSize={12} tickFormatter={(val) => val.split('-')[1]} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Line type="monotone" dataKey="ltiRate" stroke="#f97316" name="LTI Rate" strokeWidth={2} />
                                <Line type="monotone" dataKey="triRate" stroke="#ef4444" name="TRI Rate" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Monthly Manhours
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.monthlyTrends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" fontSize={12} tickFormatter={(val) => val.split('-')[1]} />
                                <YAxis fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="manhours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Safe Work Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">Recordable Free Days</span>
                            <span className="font-bold text-green-600">{stats?.recordableFreeDays}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">Hurt Free Days</span>
                            <span className="font-bold text-green-600">{stats?.hurtFreeDays}</span>
                        </div>
                        <div className="text-xs text-gray-400 text-center italic mt-4">
                            Rates calculated per 1,000,000 manhours worked.
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Recent Safety Activities</CardTitle>
                        <div className="flex gap-2">
                             <Badge variant="outline" className="flex items-center gap-1">
                                <ClipboardCheck className="w-3 h-3" />
                                12 Inspections
                             </Badge>
                             <Badge variant="outline" className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                4 Toolbox Meetings
                             </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {/* In a real app, this would be fetched from recent inspections/meetings */}
                            <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <HardHat className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Site Safety Induction - Level 2</div>
                                        <div className="text-xs text-gray-500">Conducted by Safety Officer • 2h ago</div>
                                    </div>
                                </div>
                                <Badge>COMPLETE</Badge>
                            </div>
                            <div className="p-3 border rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                        <ClipboardCheck className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Monthly Crane Inspection</div>
                                        <div className="text-xs text-gray-500">Conducted by Inspector • 1d ago</div>
                                    </div>
                                </div>
                                <Badge variant="secondary">PASSED</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Simple Badge component if not globally available
function Badge({ children, variant = 'default', className = '' }: any) {
    const variants: any = {
        default: 'bg-blue-100 text-blue-800 border-blue-200',
        secondary: 'bg-green-100 text-green-800 border-green-200',
        outline: 'border-gray-200 text-gray-600',
        destructive: 'bg-red-100 text-red-800 border-red-200'
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}

'use client';

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { HseStats } from "@/components/hse/HseStats";
import { HseCharts } from "@/components/hse/HseCharts";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useHseStatsWithTrends } from "@/hooks/use-hse";

interface Project {
    id: string;
    name: string;
}

export default function HseDashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");

    // Fetch projects
    useEffect(() => {
        apiClient.get('/projects', { params: { status: 'ACTIVE' } })
            .then(res => {
                setProjects(res.data || []);
                if (res.data?.length > 0) setSelectedProjectId(res.data[0].id);
            })
            .catch(err => console.error("Failed to fetch projects", err));
    }, []);

    // Fetch Stats using React Query
    const { data: stats, isLoading: statsLoading } = useHseStatsWithTrends(selectedProjectId);

    if (projects.length === 0 && !selectedProjectId) { // Simplistic check, acceptable for now
        return (
            <div className="p-8 text-center text-muted-foreground">
                No active projects found. Please create a project to view HSE statistics.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">HSE Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Project:</span>
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {statsLoading ? (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardContent className="h-24" />
                            </Card>
                        ))}
                    </div>
                </div>
            ) : stats ? (
                <>
                    <HseStats stats={stats} />
                    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
                        <HseCharts trends={stats.monthlyTrends} />
                        <Card className="col-span-3">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Quick Actions</h3>
                                    <button className="w-full bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700">
                                        Report Incident
                                    </button>
                                    <button className="w-full border border-zinc-200 rounded-md py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
                                        Create Daily Report
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            ) : (
                <div className="p-8 text-center text-muted-foreground">
                    Select a project to view statistics.
                </div>
            )}
        </div>
    );
}

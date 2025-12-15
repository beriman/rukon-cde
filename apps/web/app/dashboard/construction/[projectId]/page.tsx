'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressChart } from '@/components/construction/progress-chart';
import { ProgressInput } from '@/components/construction/progress-input';
import { Loader2 } from 'lucide-react';

interface WorkPackage {
    id: string;
    name: string;
    discipline: string;
    currentProgress: number;
}

interface ProgressData {
    percentage: number;
    details: WorkPackage[];
}

export default function ProjectConstructionPage({ params }: { params: { projectId: string } }) {
    const [activeTab, setActiveTab] = useState('STRUCT');
    const [loading, setLoading] = useState(true);
    const [overallProgress, setOverallProgress] = useState(0);
    const [workPackages, setWorkPackages] = useState<WorkPackage[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    const projectId = params.projectId;

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/construction/progress/${projectId}`);

                if (response.ok) {
                    const data: ProgressData = await response.json();
                    setOverallProgress(data.percentage);
                    setWorkPackages(data.details);

                    // Generate chart data from progress history (could be separate endpoint)
                    // For now using mock data structure
                    setChartData([
                        { name: 'Week 1', planned: 10, actual: Math.max(0, data.percentage - 30) },
                        { name: 'Week 2', planned: 20, actual: Math.max(0, data.percentage - 20) },
                        { name: 'Week 3', planned: 30, actual: Math.max(0, data.percentage - 10) },
                        { name: 'Week 4', planned: 40, actual: data.percentage },
                    ]);
                } else {
                    // Fallback to demo data
                    setOverallProgress(38);
                    setWorkPackages([
                        { id: 'wp-1', name: 'Foundation - Zone A', discipline: 'STRUCT', currentProgress: 100 },
                        { id: 'wp-2', name: 'Columns L1', discipline: 'STRUCT', currentProgress: 40 },
                        { id: 'wp-3', name: 'Walls - Ground Floor', discipline: 'ARCH', currentProgress: 25 },
                        { id: 'wp-4', name: 'HVAC Ductwork', discipline: 'MEP', currentProgress: 15 },
                    ]);
                    setChartData([
                        { name: 'Week 1', planned: 10, actual: 10 },
                        { name: 'Week 2', planned: 20, actual: 18 },
                        { name: 'Week 3', planned: 30, actual: 25 },
                        { name: 'Week 4', planned: 40, actual: 38 },
                    ]);
                }
            } catch (err) {
                console.error('Error fetching progress:', err);
                // Use demo data on error
                setOverallProgress(38);
                setWorkPackages([
                    { id: 'wp-1', name: 'Foundation - Zone A', discipline: 'STRUCT', currentProgress: 100 },
                    { id: 'wp-2', name: 'Columns L1', discipline: 'STRUCT', currentProgress: 40 },
                    { id: 'wp-3', name: 'Walls - Ground Floor', discipline: 'ARCH', currentProgress: 25 },
                    { id: 'wp-4', name: 'HVAC Ductwork', discipline: 'MEP', currentProgress: 15 },
                ]);
                setChartData([
                    { name: 'Week 1', planned: 10, actual: 10 },
                    { name: 'Week 2', planned: 20, actual: 18 },
                    { name: 'Week 3', planned: 30, actual: 25 },
                    { name: 'Week 4', planned: 40, actual: 38 },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProgressData();
    }, [projectId]);

    const handleUpdate = async (percentage: number, notes: string, workPackageId: string) => {
        try {
            const response = await fetch(`/api/construction/progress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workPackageId,
                    date: new Date().toISOString(),
                    percentage,
                    notes,
                    submittedBy: 'current-user-id', // Should come from auth
                }),
            });

            if (response.ok) {
                // Refresh data
                const progressResponse = await fetch(`/api/construction/progress/${projectId}`);
                if (progressResponse.ok) {
                    const data = await progressResponse.json();
                    setOverallProgress(data.percentage);
                    setWorkPackages(data.details);
                }
            }
        } catch (err) {
            console.error('Error updating progress:', err);
        }
    };

    const filteredPackages = workPackages.filter(wp => wp.discipline === activeTab);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
                <div className="text-sm text-gray-500">Project ID: {projectId}</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>S-Curve (Planned vs Actual)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProgressChart data={chartData} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-[300px]">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-blue-600">{overallProgress}%</div>
                            <div className="text-gray-500 mt-2">Weighted Average</div>
                            <div className="text-xs text-gray-400 mt-1">{workPackages.length} work packages</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="STRUCT" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="STRUCT">Structure ({workPackages.filter(wp => wp.discipline === 'STRUCT').length})</TabsTrigger>
                    <TabsTrigger value="ARCH">Architecture ({workPackages.filter(wp => wp.discipline === 'ARCH').length})</TabsTrigger>
                    <TabsTrigger value="MEP">MEP ({workPackages.filter(wp => wp.discipline === 'MEP').length})</TabsTrigger>
                </TabsList>

                {['STRUCT', 'ARCH', 'MEP'].map(discipline => (
                    <TabsContent key={discipline} value={discipline} className="space-y-4">
                        {filteredPackages.length === 0 ? (
                            <Card>
                                <CardContent className="flex items-center justify-center h-32 text-gray-500">
                                    No work packages for this discipline
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardHeader><CardTitle>Work Packages</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {filteredPackages.map(wp => (
                                            <div key={wp.id} className="border-b pb-4 last:border-0">
                                                <div className="flex justify-between mb-2">
                                                    <span className="font-medium">{wp.name}</span>
                                                    <span className="text-sm text-gray-500">{wp.currentProgress}%</span>
                                                </div>
                                                <ProgressInput
                                                    workPackageId={wp.id}
                                                    currentProgress={wp.currentProgress}
                                                    onSubmit={(percentage, notes) => handleUpdate(percentage, notes, wp.id)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressChart } from '@/components/construction/progress-chart';
import { ProgressInput } from '@/components/construction/progress-input';
// import { useConstructionStore } from '@/stores/useConstructionStore'; // Assuming store exists or using local fetch

export default function ProjectConstructionPage({ params }: { params: { projectId: string } }) {
    const [activeTab, setActiveTab] = useState('STRUCT');

    // Mock data for demo
    const chartData = [
        { name: 'Week 1', planned: 10, actual: 10 },
        { name: 'Week 2', planned: 20, actual: 18 },
        { name: 'Week 3', planned: 30, actual: 25 },
        { name: 'Week 4', planned: 40, actual: 38 },
    ];

    const workPackages = [
        { id: 'wp-1', name: 'Foundation - Zone A', progress: 100 },
        { id: 'wp-2', name: 'Columns L1', progress: 40 },
    ];

    const handleUpdate = (percentage: number, notes: string) => {
        console.log('Update:', percentage, notes);
        // Call API
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
                <div className="text-sm text-gray-500">Project ID: {params.projectId}</div>
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
                            <div className="text-5xl font-bold text-blue-600">38%</div>
                            <div className="text-gray-500 mt-2">Weighted Average</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="STRUCT" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="STRUCT">Structure</TabsTrigger>
                    <TabsTrigger value="ARCH">Architecture</TabsTrigger>
                    <TabsTrigger value="MEP">MEP</TabsTrigger>
                </TabsList>
                <TabsContent value="STRUCT" className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle>Work Packages</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {workPackages.map(wp => (
                                    <div key={wp.id} className="border-b pb-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium">{wp.name}</span>
                                            <span className="text-sm text-gray-500">{wp.progress}%</span>
                                        </div>
                                        <ProgressInput
                                            workPackageId={wp.id}
                                            currentProgress={wp.progress}
                                            onSubmit={handleUpdate}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="ARCH">Architecture Packages...</TabsContent>
                <TabsContent value="MEP">MEP Packages...</TabsContent>
            </Tabs>
        </div>
    );
}

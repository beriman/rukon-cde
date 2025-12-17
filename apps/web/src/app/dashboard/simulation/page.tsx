'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { CashFlowChart, CashFlowData } from '@/components/features/simulation/cash-flow-chart';
import { BoqUploader } from '@/components/features/cost/boq-uploader';
import { BoqList } from '@/components/features/cost/boq-list';
import { ClassificationPanel } from '@/components/features/classification/classification-panel';
import { IdsEditor } from '@/components/features/loin/ids-editor';
import { ValidationPanel } from '@/components/features/loin/validation-panel';
import { CostSummaryCards } from '@/components/features/simulation/cost-summary-cards';
import { CostTable } from '@/components/features/simulation/cost-table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings2, Download } from 'lucide-react';
import { ScheduleUploader } from '@/components/features/simulation/schedule-uploader';
import { ScheduleTaskList } from '@/components/features/simulation/schedule-task-list';
import { TimelinePlayer } from '@/components/features/simulation/timeline-player';
import { IfcViewer } from '@/components/features/ifc-viewer/ifc-viewer';
import { useSimulation } from '@/hooks/use-simulation';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const MOCK_TASKS = [
    { id: '1', taskId: '1.1', name: 'Site Preparation', startDate: '2025-01-01', endDate: '2025-01-15' },
    { id: '2', taskId: '1.2', name: 'Foundation Works', startDate: '2025-01-16', endDate: '2025-02-15' },
    { id: '3', taskId: '2.1', name: 'Structural Steel', startDate: '2025-02-16', endDate: '2025-03-30' },
];

const MOCK_LINKS = [
    { id: 'l1', scheduleTaskId: '2', elementId: 'guid-123' },
];

export default function SimulationPage({ params }: { params: { projectId: string } }) {
    const [tasks, setTasks] = useState<any[]>(MOCK_TASKS);
    const [scheduleId, setScheduleId] = useState<string | undefined>("mock-id-for-demo");
    const [boqRefresh, setBoqRefresh] = useState(0);

    const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([]);
    const [loadingCashFlow, setLoadingCashFlow] = useState(false);
    const [selectedElementId, setSelectedElementId] = useState<string | undefined>("mock-guid-click-3d");

    // Animation Hook
    const {
        currentDate,
        setCurrentDate,
        isPlaying,
        setIsPlaying,
        startDate,
        endDate,
        elementStates
    } = useSimulation(tasks, MOCK_LINKS);

    // Fetch Cash Flow Data
    useEffect(() => {
        if (!scheduleId) return;
        const fetchData = async () => {
            setLoadingCashFlow(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/simulation/schedule/${scheduleId}/cash-flow`);
                setCashFlowData(response.data);
            } catch (error) {
                console.error("Failed to fetch cash flow data", error);
            } finally {
                setLoadingCashFlow(false);
            }
        };
        fetchData();
    }, [scheduleId]);

    const handleDownloadCsv = () => {
        if (!scheduleId) return;
        // Trigger download via window location or hidden link
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/simulation/schedule/${scheduleId}/cash-flow/csv`, '_blank');
    };

    const handleUploadSuccess = () => {
        console.log("Upload success...");
    };

    const handleBoqUploadSuccess = () => {
        setBoqRefresh(prev => prev + 1);
    };

    const handleLink = (taskId: string) => {
        console.log(`Linking task ${taskId} (mock)`);
    };

    return (
        <div className="h-full flex flex-col gap-4 p-4 relative">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">4D Simulation & Scheduling</h1>
            </div>

            <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
                {/* Left Panel */}
                <div className="col-span-4 flex flex-col gap-4">
                    <Tabs defaultValue="tasks" className="w-full h-full flex flex-col">
                        <TabsList className="w-full">
                            <TabsTrigger value="tasks" className="flex-1">Tasks</TabsTrigger>
                            <TabsTrigger value="cost" className="flex-1">Cost (5D)</TabsTrigger>
                            <TabsTrigger value="classification" className="flex-1">Classify</TabsTrigger>
                            <TabsTrigger value="loin" className="flex-1">LOIN / IDS</TabsTrigger>
                            <TabsTrigger value="upload" className="flex-1">Import</TabsTrigger>
                        </TabsList>

                        {/* Pass Tasks with mocked link count */}
                        <TabsContent value="tasks" className="flex-1 overflow-hidden mt-2">
                            <ScheduleTaskList
                                tasks={tasks.map(t => ({ ...t, simulationLinks: MOCK_LINKS.filter(l => l.scheduleTaskId === t.id) }))}
                                onLink={handleLink}
                            />
                        </TabsContent>

                        <TabsContent value="cost" className="h-full mt-2 flex flex-col gap-2">
                            <div className="flex justify-between items-center px-1">
                                <span className="text-xs font-semibold text-slate-500">Analysis & Data</span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleDownloadCsv}>
                                        <Download className="w-3 h-3 mr-1" />
                                        CSV
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-7 text-xs">
                                                <Settings2 className="w-3 h-3 mr-1" />
                                                Manage BoQ
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                                            <div className="grid grid-cols-12 gap-6 h-full pt-4">
                                                <div className="col-span-4">
                                                    <BoqUploader projectId={params.projectId} onUploadSuccess={handleBoqUploadSuccess} />
                                                </div>
                                                <div className="col-span-8 h-full overflow-hidden">
                                                    <BoqList projectId={params.projectId} refreshTrigger={boqRefresh} />
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>

                            <CostSummaryCards data={cashFlowData} />

                            <div className="flex-1 min-h-[250px]">
                                <CashFlowChart data={cashFlowData} scheduleId={scheduleId} loading={loadingCashFlow} />
                            </div>

                            <div className="mt-2">
                                <CostTable data={cashFlowData} />
                            </div>
                        </TabsContent>

                        <TabsContent value="classification" className="h-full mt-2">
                            <ClassificationPanel projectId={params.projectId} selectedElementId={selectedElementId} />
                        </TabsContent>

                        <TabsContent value="loin" className="h-full mt-2">
                            <Tabs defaultValue="specs" className="h-full flex flex-col">
                                <TabsList className="w-full h-8 bg-slate-100">
                                    <TabsTrigger value="specs" className="flex-1 text-xs">Rule Editor</TabsTrigger>
                                    <TabsTrigger value="validate" className="flex-1 text-xs">Validation</TabsTrigger>
                                </TabsList>
                                <TabsContent value="specs" className="flex-1 mt-2 overflow-hidden">
                                    <IdsEditor projectId={params.projectId} />
                                </TabsContent>
                                <TabsContent value="validate" className="flex-1 mt-2 overflow-hidden">
                                    <ValidationPanel projectId={params.projectId} />
                                </TabsContent>
                            </Tabs>
                        </TabsContent>

                        <TabsContent value="upload" className="mt-2">
                            <ScheduleUploader projectId={params.projectId} onUploadSuccess={() => setScheduleId("mock-schedule-id")} />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Panel: Viewer */}
                <div className="col-span-8 relative">
                    <Card className="h-full bg-slate-950 text-white flex items-center justify-center border-slate-800 overflow-hidden">
                        <CardContent className="text-center w-full h-full relative p-0">
                            {/* 3D Viewer Integration */}
                            <div className="absolute inset-0">
                                <IfcViewer
                                    className="w-full h-full bg-slate-950"
                                    highlightedElements={elementStates}
                                    onSelect={(id) => setSelectedElementId(id)}
                                />
                            </div>

                            {/* Overlay Info Layer (kept for debug/status visibility) */}
                            <div className="absolute top-4 left-4 pointer-events-none">
                                <div className="text-left bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-xs font-mono w-[200px] backdrop-blur-sm">
                                    <p className="text-slate-400 mb-1">Status Log:</p>
                                    {Array.from(elementStates.entries()).slice(0, 5).map(([guid, status]) => (
                                        <div key={guid} className="flex justify-between">
                                            <span>{guid.substring(0, 8)}...</span>
                                            <span className={
                                                status === 'IN_PROGRESS' ? 'text-yellow-400' :
                                                    status === 'COMPLETED' ? 'text-green-400' : 'text-slate-500'
                                            }>
                                                {status[0]}
                                            </span>
                                        </div>
                                    ))}
                                    {elementStates.size === 0 && <span className="text-slate-600">Idle</span>}
                                </div>
                            </div>

                            {/* Timeline Player Overlay */}
                            <TimelinePlayer
                                startDate={startDate}
                                endDate={endDate}
                                onDateChange={setCurrentDate}
                                isPlaying={isPlaying}
                                onPlayPause={() => setIsPlaying(!isPlaying)}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

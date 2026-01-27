'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Loader2, Plus, Shield, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function HseDashboard({ projectId }: { projectId: string }) {
    const { data, isLoading } = useQuery({
        queryKey: ['hse-dashboard', projectId],
        queryFn: async () => {
            const res = await apiClient.get(`/projects/${projectId}/hse/dashboard`);
            return res.data;
        }
    });

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (!data) return <div>No HSE data available</div>;

    const { stats, actuals, targets } = data;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="h-6 w-6 text-green-600" />
                    HSE Performance
                </h2>
                <DailyReportDialog projectId={projectId} />
            </div>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total Manhours" value={stats.totalManhours.toLocaleString()} icon={<TrendingUp className="h-4 w-4" />} />
                <StatCard title="LTI Free Days" value={stats.ltiFreeDays} icon={<CheckCircle2 className="h-4 w-4 text-green-600" />} />
                <StatCard title="TRI Rate" value={stats.triRate} subtitle="Per 1M hours" icon={<AlertTriangle className="h-4 w-4 text-yellow-600" />} />
                <StatCard title="LTI Rate" value={stats.ltiRate} subtitle="Per 1M hours" icon={<AlertTriangle className="h-4 w-4 text-red-600" />} />
            </div>

            {/* Weekly Targets vs Actuals */}
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Targets vs Actuals</CardTitle>
                    <CardDescription>Monitoring leading indicators for this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <TargetRow label="Manhours" actual={actuals.manhours} target={targets.manhours || 1000} unit="hours" />
                    <TargetRow label="Safe Manhours" actual={actuals.manhours} target={targets.safeManhours || 1000} unit="hours" />
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="mb-2 text-sm font-semibold">Meetings</h4>
                            <div className="space-y-2">
                                <CountRow label="Toolbox Meeting (TBM)" count={actuals.meetings.TBM || 0} target={targets.details?.TBM || 5} />
                                <CountRow label="Induction" count={actuals.meetings.INDUCTION || 0} target={targets.details?.INDUCTION || 2} />
                            </div>
                        </div>
                        <div>
                            <h4 className="mb-2 text-sm font-semibold">Inspections</h4>
                            <div className="space-y-2">
                                <CountRow label="Heavy Equipment" count={actuals.inspections.HEAVY_EQUIPMENT || 0} target={targets.details?.HEAVY_EQUIPMENT || 2} />
                                <CountRow label="Scaffolding" count={actuals.inspections.SCAFFOLDING || 0} target={targets.details?.SCAFFOLDING || 2} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Incidence Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Incident Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <IncidentBox label="First Aid" count={actuals.incidents.FIRST_AID} />
                        <IncidentBox label="Medical Treatment" count={actuals.incidents.MTI} />
                        <IncidentBox label="Restricted Work" count={actuals.incidents.RWI} />
                        <IncidentBox label="Lost Time (LTI)" count={actuals.incidents.LTI} isHighSeverity />
                        <IncidentBox label="Near Miss" count={actuals.incidents.NEAR_MISS} />
                        <IncidentBox label="Unsafe Act" count={actuals.incidents.UNSAFE_ACT} />
                        <IncidentBox label="Spill" count={actuals.incidents.SPILL} />
                        <IncidentBox label="Fatality" count={actuals.incidents.FATALITY} isHighSeverity />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon }: any) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <span className="text-sm font-medium text-muted-foreground">{title}</span>
                    {icon}
                </div>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </CardContent>
        </Card>
    );
}

function TargetRow({ label, actual, target, unit }: any) {
    const percentage = Math.min((actual / target) * 100, 100);
    return (
        <div>
            <div className="flex justify-between mb-1 text-sm">
                <span>{label}</span>
                <span className="text-muted-foreground">{actual} / {target} {unit}</span>
            </div>
            <Progress value={percentage} className="h-2" />
        </div>
    );
}

function CountRow({ label, count, target }: any) {
    return (
        <div className="flex justify-between items-center text-sm border-b py-2 last:border-0">
            <span>{label}</span>
            <div className="flex items-center gap-2">
                <span className="font-medium">{count}</span>
                <span className="text-xs text-muted-foreground">/ {target} target</span>
            </div>
        </div>
    );
}

function IncidentBox({ label, count, isHighSeverity }: any) {
    return (
        <div className={`p-4 rounded-lg border ${isHighSeverity ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}>
            <div className="text-2xl font-bold mb-1">{count}</div>
            <div className={`text-xs ${isHighSeverity ? 'text-red-700' : 'text-slate-600'}`}>{label}</div>
        </div>
    );
}

function DailyReportDialog({ projectId }: { projectId: string }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            // Mock submission for MVP - in real app, call hse/daily-report endpoint
            toast.success("Daily Report Submitted");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to submit");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Input Daily Report
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Input HSE Daily Data</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Date</Label>
                        <Input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Manhours Today</Label>
                        <Input type="number" name="manhours" placeholder="e.g. 500" required />
                    </div>
                    <div className="grid gap-2">
                        <Label>Workers Count</Label>
                        <Input type="number" name="workers" placeholder="e.g. 50" required />
                    </div>
                    <div className="grid gap-2">
                        <Label>Safety Cards / Observations</Label>
                        <Input type="number" name="observations" placeholder="e.g. 10" />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : "Submit Report"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

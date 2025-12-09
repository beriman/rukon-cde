'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShieldCheck, AlertTriangle, HeartPulse } from "lucide-react";

interface HseStatsProps {
    stats: {
        totalManhours: number;
        ltiFreeDays: number;
        recordableFreeDays: number;
        hurtFreeDays: number;
        ltiRate: number;
        triRate: number;
        incidentsLastMonth: number;
    };
}

export function HseStats({ stats }: HseStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Manhours</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalManhours.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Cumulative safe hours</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">LTI Free Days</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.ltiFreeDays}</div>
                    <p className="text-xs text-muted-foreground">Days since last LTI</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">TRI Rate</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.triRate}</div>
                    <p className="text-xs text-muted-foreground">Per 1,000,000 manhours</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Incidents (Month)</CardTitle>
                    <HeartPulse className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.incidentsLastMonth}</div>
                    <p className="text-xs text-muted-foreground">Recorded in current month</p>
                </CardContent>
            </Card>
        </div>
    );
}

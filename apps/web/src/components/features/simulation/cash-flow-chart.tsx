"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import axios from 'axios';

export interface CashFlowData {
    date: string;
    dailyCost: number;
    cumulativeCost: number;
}

interface CashFlowChartProps {
    data: CashFlowData[];
    scheduleId?: string;
    loading?: boolean;
}

export function CashFlowChart({ data, scheduleId, loading }: CashFlowChartProps) {
    // Data fetching removed, now purely presentational

    if (!scheduleId) {
        return (
            <Card className="h-full flex items-center justify-center text-slate-500">
                <p>Select a schedule to view Cash Flow</p>
            </Card>
        );
    }

    if (loading) {
        return (
            <Card className="h-full flex items-center justify-center">
                <p>Loading Cash Flow Data...</p>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className="h-full flex items-center justify-center text-slate-500">
                <p>No cost data available for this schedule.</p>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="py-2">
                <CardTitle className="text-sm font-medium">5D Cash Flow Analysis (S-Curve)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => format(new Date(str), 'MMM d')}
                            scale="point"
                        />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Daily Cost', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Cumulative', angle: 90, position: 'insideRight' }} />
                        <Tooltip
                            labelFormatter={(label) => format(new Date(label), 'PPP')}
                            formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'IDR' }).format(value)}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="dailyCost" name="Daily Cost" barSize={20} fill="#413ea0" />
                        <Line yAxisId="right" type="monotone" dataKey="cumulativeCost" name="Cumulative Cost" stroke="#ff7300" dot={false} strokeWidth={2} />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

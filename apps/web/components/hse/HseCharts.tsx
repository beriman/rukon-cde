'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { HseMonthlyTrend } from "@/lib/api/hse.service";

interface HseChartsProps {
    trends?: HseMonthlyTrend[];
}

export function HseCharts({ trends = [] }: HseChartsProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Incident Trend (Last 12 Months)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={trends}>
                        <XAxis
                            dataKey="month"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value: number) => `${value}`}
                        />
                        <Tooltip />
                        <Bar dataKey="incidents" fill="#adfa1d" radius={[4, 4, 0, 0]} name="Incidents" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

// Mock data for trends (Backend doesn't provide this yet in simple stats DTO)
const data = [
    { name: "Jan", incidents: 0 },
    { name: "Feb", incidents: 1 },
    { name: "Mar", incidents: 0 },
    { name: "Apr", incidents: 2 },
    { name: "May", incidents: 0 },
    { name: "Jun", incidents: 0 },
];

export function HseCharts() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Incident Trend (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
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
                        <Bar dataKey="incidents" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

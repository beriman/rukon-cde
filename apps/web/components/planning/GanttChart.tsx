'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock Data with Dates
const tasks = [
    { id: '1', title: 'Ground Floor Plan', start: '2025-01-01', end: '2025-01-15', percent: 100 },
    { id: '2', title: 'First Floor Plan', start: '2025-01-10', end: '2025-01-25', percent: 50 },
    { id: '3', title: 'Foundation Layout', start: '2025-01-05', end: '2025-01-20', percent: 20 },
    { id: '4', title: 'HVAC Layout', start: '2025-01-20', end: '2025-02-10', percent: 0 },
];

export function GanttChart() {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-02-15');
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

    const getLeft = (dateStr: string) => {
        const d = new Date(dateStr);
        const diff = (d.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
        return (diff / totalDays) * 100;
    };

    const getWidth = (startStr: string, endStr: string) => {
        const s = new Date(startStr);
        const e = new Date(endStr);
        const diff = (e.getTime() - s.getTime()) / (1000 * 3600 * 24);
        return (diff / totalDays) * 100;
    };

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader>
                <CardTitle>Project Schedule (Gantt View)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative border rounded-md h-[400px] overflow-auto bg-slate-50">
                    {/* Timeline Header (Simplified) */}
                    <div className="flex border-b bg-white sticky top-0 z-10">
                        <div className="w-1/4 p-2 border-r font-bold text-sm">Task Name</div>
                        <div className="flex-1 relative h-8">
                            {/* Markers logic omitted for brevity, just a visual bar container */}
                            <div className="absolute left-0 top-0 h-full border-l pl-1 text-xs text-gray-400">Jan 1</div>
                            <div className="absolute left-[33%] top-0 h-full border-l pl-1 text-xs text-gray-400">Jan 15</div>
                            <div className="absolute left-[66%] top-0 h-full border-l pl-1 text-xs text-gray-400">Feb 1</div>
                        </div>
                    </div>

                    {/* Tasks */}
                    <div className="divide-y">
                        {tasks.map(task => (
                            <div key={task.id} className="flex h-10 items-center bg-white hover:bg-slate-50">
                                <div className="w-1/4 p-2 border-r text-sm truncate px-4">{task.title}</div>
                                <div className="flex-1 relative h-full">
                                    <div
                                        className="absolute top-2 h-6 rounded bg-blue-500 text-white text-[10px] flex items-center justify-center shadow-sm"
                                        style={{
                                            left: `${getLeft(task.start)}%`,
                                            width: `${getWidth(task.start, task.end)}%`
                                        }}
                                    >
                                        {task.percent}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Current Time Line (Mock) */}
                    <div className="absolute top-0 bottom-0 left-[20%] w-0.5 bg-red-500 opacity-30 pointer-events-none" />
                </div>
                <div className="mt-4 text-xs text-gray-500 flex gap-4">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded"></div> Planned</div>
                    <div className="flex items-center gap-1"><div className="w-0.5 h-3 bg-red-500"></div> Today</div>
                </div>
            </CardContent>
        </Card>
    );
}

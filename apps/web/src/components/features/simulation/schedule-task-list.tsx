'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link2 } from 'lucide-react';

interface Task {
    id: string;
    taskId: string;
    name: string;
    startDate: string;
    endDate: string;
    simulationLinks: any[];
}

interface ScheduleTaskListProps {
    scheduleId?: string;
    tasks: Task[];
    onLink: (taskId: string) => void;
}

export function ScheduleTaskList({ tasks, onLink }: ScheduleTaskListProps) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Tasks ({tasks.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Task Name</TableHead>
                            <TableHead className="w-[100px]">Start</TableHead>
                            <TableHead className="w-[80px]">Links</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell className="font-mono text-xs">{task.taskId}</TableCell>
                                <TableCell>{task.name}</TableCell>
                                <TableCell className="text-xs">{new Date(task.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {task.simulationLinks.length > 0 ? (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            {task.simulationLinks.length} Linked
                                        </Badge>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">Unlinked</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => onLink(task.id)} title="Link to selected elements">
                                        <Link2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

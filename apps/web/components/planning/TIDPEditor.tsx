'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Assuming shadcn table exists

type Deliverable = {
    id: string;
    originator: string;
    volume: string;
    level: string;
    type: string;
    role: string;
    number: string;
    title: string;
    plannedDate: string;
};

const initialData: Deliverable[] = [
    { id: '1', originator: 'ARC', volume: '01', level: '01', type: 'DR', role: 'A', number: '0001', title: 'Ground Floor Plan', plannedDate: '2025-01-15' },
];

export function TIDPEditor() {
    const [data, setData] = useState<Deliverable[]>(initialData);

    const addRow = () => {
        const newRow: Deliverable = {
            id: Math.random().toString(),
            originator: '',
            volume: '',
            level: '',
            type: '',
            role: '',
            number: '',
            title: '',
            plannedDate: ''
        };
        setData([...data, newRow]);
    };

    const updateCell = (id: string, field: keyof Deliverable, value: string) => {
        setData(data.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const deleteRow = (id: string) => {
        setData(data.filter(row => row.id !== id));
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Task Information Delivery Plan (TIDP)</CardTitle>
                <Button onClick={addRow}>+ Add Deliverable</Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Originator</TableHead>
                                <TableHead>Volume</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Number</TableHead>
                                <TableHead className="w-[300px]">Title</TableHead>
                                <TableHead>Planned Date</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell><Input className="h-8 w-16" value={row.originator} onChange={e => updateCell(row.id, 'originator', e.target.value)} /></TableCell>
                                    <TableCell><Input className="h-8 w-12" value={row.volume} onChange={e => updateCell(row.id, 'volume', e.target.value)} /></TableCell>
                                    <TableCell><Input className="h-8 w-12" value={row.level} onChange={e => updateCell(row.id, 'level', e.target.value)} /></TableCell>
                                    <TableCell><Input className="h-8 w-12" value={row.type} onChange={e => updateCell(row.id, 'type', e.target.value)} /></TableCell>
                                    <TableCell><Input className="h-8 w-10" value={row.role} onChange={e => updateCell(row.id, 'role', e.target.value)} /></TableCell>
                                    <TableCell><Input className="h-8 w-16" value={row.number} onChange={e => updateCell(row.id, 'number', e.target.value)} /></TableCell>
                                    <TableCell><Input className="h-8 w-full" value={row.title} onChange={e => updateCell(row.id, 'title', e.target.value)} /></TableCell>
                                    <TableCell><Input type="date" className="h-8 w-32" value={row.plannedDate} onChange={e => updateCell(row.id, 'plannedDate', e.target.value)} /></TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" onClick={() => deleteRow(row.id)}>Del</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

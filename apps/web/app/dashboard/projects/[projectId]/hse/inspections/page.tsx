'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { hseService } from '@/lib/api/hse.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ClipboardCheck, Calendar, User, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function InspectionsListPage() {
    const params = useParams();
    const projectId = params.projectId as string;

    const { data, isLoading } = useQuery({
        queryKey: ['hse-inspections', projectId],
        queryFn: () => hseService.getInspections(projectId),
    });

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading inspections...</div>;

    const inspections = data?.data || [];

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Safety Inspections</h1>
                    <p className="text-gray-500">Scheduled and ad-hoc safety checks.</p>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Inspection
                </Button>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="w-[200px]">Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Inspector</TableHead>
                            <TableHead>Results</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inspections.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center text-gray-500">
                                    <ClipboardCheck className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                    No inspections found for this project.
                                </TableCell>
                            </TableRow>
                        ) : (
                            inspections.map((ins: any) => {
                                const failCount = ins.items.filter((i: any) => i.result === 'FAIL').length;
                                return (
                                    <TableRow key={ins.id} className="hover:bg-gray-50 cursor-pointer">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                                    <ClipboardCheck className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <span className="font-medium text-sm">{ins.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(new Date(ins.date), 'dd MMM yyyy')}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <User className="w-3.5 h-3.5" />
                                                {ins.inspector?.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {failCount > 0 ? (
                                                <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-100">
                                                    {failCount} ISSUES FOUND
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-100">
                                                    ALL PASSED
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

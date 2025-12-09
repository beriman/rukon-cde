'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress'; // Assuming shadcn progress
import { Label } from '@/components/ui/label';

const initialItems = [
    { id: '1', task: 'Sign Non-Disclosure Agreement (NDA)', assignedTo: 'All Team', status: true },
    { id: '2', task: 'Install Revit 2024 & Navisworks', assignedTo: 'Modelers', status: true },
    { id: '3', task: 'Access CDE (Rukon Platform)', assignedTo: 'All Team', status: false },
    { id: '4', task: 'Complete BIM Competency Assessment', assignedTo: 'New Hires', status: false },
    { id: '5', task: 'Attend Project Kick-off Meeting', assignedTo: 'Leads', status: false },
];

export function MobilizationDashboard() {
    const [items, setItems] = useState(initialItems);

    const toggleItem = (id: string) => {
        setItems(items.map(i => i.id === id ? { ...i, status: !i.status } : i));
    };

    const progress = Math.round((items.filter(i => i.status).length / items.length) * 100);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Team Mobilization Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <div className="flex justify-between mb-2 text-sm font-medium">
                            <span>Readiness</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center space-x-4 p-3 border rounded hover:bg-slate-50">
                                <Checkbox
                                    id={item.id}
                                    checked={item.status}
                                    onCheckedChange={() => toggleItem(item.id)}
                                />
                                <div className="flex-1">
                                    <Label htmlFor={item.id} className="font-medium cursor-pointer">{item.task}</Label>
                                    <div className="text-xs text-gray-500">Assigned to: {item.assignedTo}</div>
                                </div>
                                <div className={`text-xs px-2 py-1 rounded ${item.status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {item.status ? 'Done' : 'Pending'}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Competency Assessment</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500 mb-4">New team members must complete the BIM skill assessment.</p>
                    <Button variant="outline">Launch Assessment Form</Button>
                </CardContent>
            </Card>
        </div>
    );
}

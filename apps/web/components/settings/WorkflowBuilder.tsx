'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Stage = {
    id: string;
    name: string;
    approverRole: string; // e.g. 'ARCH_LEAD'
};

export function WorkflowBuilder() {
    const [stages, setStages] = useState<Stage[]>([
        { id: '1', name: 'Technical Check', approverRole: 'Discipline Lead' }
    ]);
    const [newStageName, setNewStageName] = useState('');

    const addStage = () => {
        if (!newStageName) return;
        setStages([...stages, {
            id: Math.random().toString(),
            name: newStageName,
            approverRole: 'Project Manager' // Default
        }]);
        setNewStageName('');
    };

    const removeStage = (id: string) => {
        setStages(stages.filter(s => s.id !== id));
    };

    return (
        <div className="grid grid-cols-2 gap-8">
            {/* Builder */}
            <Card>
                <CardHeader><CardTitle>Workflow Stages</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="New Stage Name"
                            value={newStageName}
                            onChange={(e) => setNewStageName(e.target.value)}
                        />
                        <Button onClick={addStage}>Add Stage</Button>
                    </div>

                    <div className="space-y-2 relative">
                        {stages.map((stage, idx) => (
                            <div key={stage.id} className="p-4 border rounded bg-white relative z-10 flex justify-between items-center group">
                                <div>
                                    <div className="font-semibold">{idx + 1}. {stage.name}</div>
                                    <div className="text-sm text-gray-500">Approver: {stage.approverRole}</div>
                                </div>
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100" onClick={() => removeStage(stage.id)}>Remove</Button>
                            </div>
                        ))}
                        {/* Arrow connectors visualization */}
                        {stages.length > 0 && (
                            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-300 -z-0" />
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Preview / Config */}
            <Card>
                <CardHeader><CardTitle>Configuration</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Workflow Name</Label>
                        <Input defaultValue="Standard Design Review" />
                    </div>
                    <div>
                        <Label>Applies To</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                            <option>All Folders</option>
                            <option>Architecture Only</option>
                            <option>Structural Only</option>
                        </select>
                    </div>
                    <div className="pt-4">
                        <Button className="w-full">Save Workflow Definition</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

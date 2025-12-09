'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for projects
const mockProjects = [
    { id: 'proj-1', name: 'Apartemen Mewah Jakarta' },
    { id: 'proj-2', name: 'Jembatan Suramadu II' },
];

export function PIRWizard() {
    const [step, setStep] = useState(0);
    const [projectId, setProjectId] = useState('');
    const [formData, setFormData] = useState({
        projectGoals: '',
        keyDecisionPoints: [{ stage: '', question: '' }],
        milestones: [{ name: '', date: '' }],
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const addKDP = () => {
        setFormData({
            ...formData,
            keyDecisionPoints: [...formData.keyDecisionPoints, { stage: '', question: '' }]
        });
    };

    const updateKDP = (index: number, field: string, value: string) => {
        const newKDPs = [...formData.keyDecisionPoints];
        newKDPs[index] = { ...newKDPs[index], [field]: value };
        setFormData({ ...formData, keyDecisionPoints: newKDPs });
    };

    const handleSubmit = async () => {
        console.log('Submitting PIR for project', projectId, formData);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>PIR Generator - {step === 0 ? 'Select Project' : `Step ${step}`}</CardTitle>
                </CardHeader>
                <CardContent>
                    {step === 0 && (
                        <div className="space-y-4">
                            <Label>Select Project</Label>
                            <Select onValueChange={setProjectId} value={projectId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockProjects.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="mt-4">
                                <Button disabled={!projectId} onClick={handleNext}>Start PIR</Button>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label>Tujuan Proyek (Project Goals)</Label>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    rows={5}
                                    placeholder="Contoh: Mengurangi biaya operasional gedung..."
                                    value={formData.projectGoals}
                                    onChange={(e) => setFormData({ ...formData, projectGoals: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <Label>Key Decision Points</Label>
                            {formData.keyDecisionPoints.map((kdp, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <Input
                                        placeholder="Stage (e.g. Concept)"
                                        value={kdp.stage}
                                        onChange={(e) => updateKDP(idx, 'stage', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Key Question"
                                        value={kdp.question}
                                        onChange={(e) => updateKDP(idx, 'question', e.target.value)}
                                    />
                                </div>
                            ))}
                            <Button variant="outline" onClick={addKDP}>+ Add Decision Point</Button>
                        </div>
                    )}

                    {step > 0 && (
                        <div className="flex justify-between mt-6">
                            <Button onClick={handleBack} variant="outline">Back</Button>
                            {step < 2 ? (
                                <Button onClick={handleNext}>Next</Button>
                            ) : (
                                <Button onClick={handleSubmit}>Generate PIR</Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

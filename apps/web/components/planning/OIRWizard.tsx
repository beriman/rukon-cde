'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { useToast } from '@/components/ui/use-toast';

export function OIRWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        strategicObjectives: '',
        assetManagementPolicy: '',
        stakeholderRequirements: '',
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        // Submit logic here
        console.log('Submitting OIR:', formData);
        // await axios.post('/api/planning/documents', ...)
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>OIR Generator - Step {step}</CardTitle>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <Label>Tujuan Strategis Organisasi</Label>
                                <textarea
                                    className="w-full p-2 border rounded"
                                    rows={5}
                                    placeholder="Contoh: Meningkatkan efisiensi aset sebesar 20%..."
                                    value={formData.strategicObjectives}
                                    onChange={(e) => setFormData({ ...formData, strategicObjectives: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <Label>Kebijakan Manajemen Aset</Label>
                            <textarea
                                className="w-full p-2 border rounded"
                                rows={5}
                                value={formData.assetManagementPolicy}
                                onChange={(e) => setFormData({ ...formData, assetManagementPolicy: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="flex justify-between mt-6">
                        <Button disabled={step === 1} onClick={handleBack} variant="outline">
                            Back
                        </Button>
                        {step < 2 ? (
                            <Button onClick={handleNext}>Next</Button>
                        ) : (
                            <Button onClick={handleSubmit}>Generate OIR</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

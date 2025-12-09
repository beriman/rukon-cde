'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming checkbox exists or I'll stub
import { Input } from '@/components/ui/input';

export function EIRWizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        namingConvention: 'ISO 19650-2',
        fileFormats: 'RVT, IFC, PDF',
        cdePlatform: 'Rukon CDE',
        includeOIR: false,
        includePIR: false,
        includeAIR: false,
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async () => {
        console.log('Submitting EIR:', formData);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>EIR Generator - Step {step}</CardTitle>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Information Standards</h3>
                            <div>
                                <Label>Naming Convention Standard</Label>
                                <Input
                                    value={formData.namingConvention}
                                    onChange={(e) => setFormData({ ...formData, namingConvention: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Submission Formats</Label>
                                <Input
                                    value={formData.fileFormats}
                                    onChange={(e) => setFormData({ ...formData, fileFormats: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Methods & Procedures</h3>
                            <div>
                                <Label>CDE Platform Requirement</Label>
                                <Input
                                    value={formData.cdePlatform}
                                    onChange={(e) => setFormData({ ...formData, cdePlatform: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Reference Documents (Aggregation)</h3>
                            <p className="text-sm text-gray-500 mb-4">Select existing documents to append to this EIR.</p>

                            <div className="flex items-center space-x-2 border p-3 rounded hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    id="oir"
                                    checked={formData.includeOIR}
                                    onChange={(e) => setFormData({ ...formData, includeOIR: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="oir" className="cursor-pointer font-medium">Include Organizational Information Requirements (OIR)</Label>
                            </div>

                            <div className="flex items-center space-x-2 border p-3 rounded hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    id="pir"
                                    checked={formData.includePIR}
                                    onChange={(e) => setFormData({ ...formData, includePIR: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="pir" className="cursor-pointer font-medium">Include Project Information Requirements (PIR)</Label>
                            </div>

                            <div className="flex items-center space-x-2 border p-3 rounded hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    id="air"
                                    checked={formData.includeAIR}
                                    onChange={(e) => setFormData({ ...formData, includeAIR: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="air" className="cursor-pointer font-medium">Include Asset Information Requirements (AIR)</Label>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between mt-6">
                        <Button disabled={step === 1} onClick={handleBack} variant="outline">Back</Button>
                        {step < 3 ? (
                            <Button onClick={handleNext}>Next</Button>
                        ) : (
                            <Button onClick={handleSubmit}>Generate EIR</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

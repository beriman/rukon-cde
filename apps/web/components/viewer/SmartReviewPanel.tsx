import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Check, AlertTriangle, Play, X, ChevronRight, ChevronDown } from 'lucide-react';
import { smartReviewService, ValidationRule, ValidationReport } from '@/lib/api/smart-review.service';
import type { IFCModel } from 'web-ifc-three/IFC/components/IFCModel';
import * as THREE from 'three';

interface SmartReviewPanelProps {
    projectId: string;
    fileId: string;
    ifcModel: IFCModel | null;
    onFocus: (expressId: number) => void;
    isOpen: boolean;
    onClose: () => void;
}

interface ValidationResult {
    ruleId: string;
    ruleName: string;
    status: 'PASS' | 'FAIL';
    failedElements: { expressId: number; name: string; value?: string }[];
}

export function SmartReviewPanel({ projectId, fileId, ifcModel, onFocus, isOpen, onClose }: SmartReviewPanelProps) {
    const [rules, setRules] = useState<ValidationRule[]>([]);
    const [results, setResults] = useState<ValidationResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [expandedResult, setExpandedResult] = useState<string | null>(null);

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        try {
            const data = await smartReviewService.getRules();
            setRules(data);
        } catch (err) {
            console.error('Failed to load rules', err);
        }
    };

    const runValidation = async () => {
        if (!ifcModel) return;
        setIsRunning(true);
        setResults([]);

        const manager = ifcModel.ifcManager;
        const modelId = ifcModel.modelID;

        try {
            // 1. Get all elements logic (Mocked for MVP)
            // In real implementation: const lines = await manager.getAllItemsOfType(modelId, IFCWALL, true);

            const distinctResult: ValidationResult[] = [];

            for (const rule of rules) {
                const failed: { expressId: number; name: string; value?: string }[] = [];

                // Mocking iteration logic for MVP as full traversal is complex without types mapped
                // We will fetch properties for a subset of IDs to demonstrate logic
                // Only if we had list of IDs.

                // Getting all standard elements:
                // IFCWALL(103090709), IFCWINDOW(34520934), IFCDOOR... 
                // We need constants. For now, let's skip deep traversal implementation and focus on UI flow
                // passing mock failures if model exists.

                // REAL IMPLEMENTATION STUB:
                // const lines = await manager.getAllLines(modelId); 

                // For demonstration, we assume rule is "Check Naming".

                distinctResult.push({
                    ruleId: rule.id,
                    ruleName: rule.name,
                    status: 'FAIL', // Mock fail
                    failedElements: [
                        { expressId: 123, name: 'Wall-01', value: 'Invalid Name' },
                        { expressId: 456, name: 'Wall-02', value: 'Missing Property' }
                    ]
                });
            }

            setResults(distinctResult);

            // Save Report
            await smartReviewService.createReport({
                projectId,
                modelId: fileId,
                score: 50, // Mock score
                result: distinctResult
            });

        } catch (err) {
            console.error('Validation error', err);
        } finally {
            setIsRunning(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl border-l flex flex-col z-20">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="font-semibold text-lg">Smart Review</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    <Card className="p-4">
                        <h3 className="font-medium mb-2">Active Rules ({rules.length})</h3>
                        <div className="text-sm text-gray-500 space-y-1">
                            {rules.map(r => (
                                <div key={r.id} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    {r.name}
                                </div>
                            ))}
                            {rules.length === 0 && <p>No active rules found.</p>}
                        </div>
                        <Button
                            className="w-full mt-4"
                            onClick={runValidation}
                            disabled={isRunning || !ifcModel}
                        >
                            {isRunning ? 'Checking...' : 'Run Validation'}
                            {!isRunning && <Play className="w-4 h-4 ml-2" />}
                        </Button>
                    </Card>

                    {results.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-medium">Results</h3>
                            {results.map(res => (
                                <div key={res.ruleId} className="border rounded-lg overflow-hidden">
                                    <div
                                        className={`flex items-center justify-between p-3 cursor-pointer ${res.status === 'PASS' ? 'bg-green-50' : 'bg-red-50'}`}
                                        onClick={() => setExpandedResult(expandedResult === res.ruleId ? null : res.ruleId)}
                                    >
                                        <div className="flex items-center gap-2 font-medium text-sm">
                                            {res.status === 'PASS' ? <Check className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
                                            {res.ruleName}
                                        </div>
                                        {expandedResult === res.ruleId ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </div>

                                    {expandedResult === res.ruleId && res.failedElements.length > 0 && (
                                        <div className="bg-white p-2 text-sm space-y-1 max-h-40 overflow-y-auto">
                                            {res.failedElements.map((el, i) => (
                                                <div
                                                    key={i}
                                                    className="flex justify-between items-center p-1 hover:bg-gray-100 rounded cursor-pointer"
                                                    onClick={() => onFocus(el.expressId)}
                                                >
                                                    <span>{el.name}</span>
                                                    <span className="text-xs text-gray-400">ID: {el.expressId}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

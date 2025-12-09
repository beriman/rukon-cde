'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Layers, Box, Eye, EyeOff } from 'lucide-react';

interface Model {
    id: string;
    name: string;
    visible: boolean;
    color: string;
}

export function ThreeDViewer() {
    const [models, setModels] = useState<Model[]>([
        { id: 'm1', name: 'Architecture_Main.ifc', visible: true, color: '#3b82f6' }, // Blue
        { id: 'm2', name: 'Structure_Steel.ifc', visible: true, color: '#f97316' }, // Orange
    ]);

    const toggleModel = (id: string) => {
        setModels(models.map(m => m.id === id ? { ...m, visible: !m.visible } : m));
    };

    return (
        <div className="flex flex-col md:flex-row h-[600px] gap-4">
            {/* Viewer Canvas Area */}
            <Card className="flex-1 bg-gray-900 border-gray-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <Box className="h-16 w-16 mx-auto mb-4 text-gray-600 animate-pulse" />
                        <p className="text-gray-500">3D WebGL Context (Placeholder)</p>
                        <p className="text-xs text-gray-700 mt-2">Requires &apos;three&apos; and &apos;web-ifc&apos; libraries to render geometry.</p>

                        {/* Simulation of Rendered Objects */}
                        <div className="mt-8 relative w-64 h-48 border border-dashed border-gray-700 mx-auto grid place-items-center">
                            {models.filter(m => m.visible).map((m, i) => (
                                <div
                                    key={m.id}
                                    className="absolute inset-0 m-auto w-32 h-32 opacity-70 border-4"
                                    style={{
                                        borderColor: m.color,
                                        transform: `rotate(${i * 15}deg) translate(${i * 10}px, ${i * -10}px)`
                                    }}
                                >
                                    <span className="absolute -top-6 left-0 text-xs" style={{ color: m.color }}>{m.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Floating Controls */}
                <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded text-xs">
                    FPS: 60 | DrawCalls: 124
                </div>
            </Card>

            {/* Model Tree / Federation Panel */}
            <Card className="w-full md:w-80">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Layers className="h-4 w-4" /> Federated Models
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {models.map(model => (
                            <div key={model.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => toggleModel(model.id)}
                                >
                                    {model.visible ? <Eye className="h-4 w-4 text-gray-600" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                                </Button>
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
                                <span className={`text-sm flex-1 ${!model.visible && 'text-gray-400 line-through'}`}>
                                    {model.name}
                                </span>
                            </div>
                        ))}

                        <div className="pt-4 border-t mt-4">
                            <Button className="w-full" variant="outline">
                                + Load Model (Federate)
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

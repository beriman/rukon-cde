'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Layers, AlertTriangle, RefreshCw } from 'lucide-react';

interface ModelLayer {
    id: string;
    name: string;
    color: string;
    visible: boolean;
}

export function FederationViewer() {
    const [layers, setLayers] = useState<ModelLayer[]>([
        { id: 'arch', name: 'Architecture_v5.ifc', color: 'text-gray-500', visible: true },
        { id: 'struct', name: 'Structural_{Frame}_v2.ifc', color: 'text-red-500', visible: true },
        { id: 'mep', name: 'MEP_HVAC_L2.ifc', color: 'text-green-500', visible: false },
    ]);

    const [clashes, setClashes] = useState<number | null>(null);

    const toggleLayer = (id: string) => {
        setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
        setClashes(null); // Reset clash if view changes
    };

    const runClashCheck = () => {
        // Mock clash detection logic
        const activeCount = layers.filter(l => l.visible).length;
        if (activeCount < 2) {
            alert('Need at least 2 models to run clash check.');
            return;
        }

        // Simulating processing
        setTimeout(() => {
            setClashes(activeCount * 3 + Math.floor(Math.random() * 5));
        }, 800);
    };

    return (
        <div className="flex h-[600px] border rounded-lg overflow-hidden bg-gray-50">
            {/* Sidebar: Model Tree */}
            <div className="w-64 bg-white border-r p-4 flex flex-col">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <Layers className="h-4 w-4" /> Loaded Models
                </h3>
                <div className="flex-1 space-y-3">
                    {layers.map(layer => (
                        <div key={layer.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                            <Checkbox
                                id={`layer-${layer.id}`}
                                checked={layer.visible}
                                onCheckedChange={() => toggleLayer(layer.id)}
                            />
                            <label
                                htmlFor={`layer-${layer.id}`}
                                className={`text-sm font-medium cursor-pointer ${layer.color}`}
                            >
                                {layer.name}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4">
                    <Button className="w-full" onClick={runClashCheck} disabled={clashes !== null}>
                        {clashes !== null ? 'Check Complete' : 'Run Clash Check'}
                    </Button>
                    {clashes !== null && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm flex items-center gap-2 animate-in fade-in">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Found <strong>{clashes}</strong> clashes</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main View: Mock 3D Canvas */}
            <div className="flex-1 relative bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="relative w-[400px] h-[300px] bg-slate-800/50 border border-slate-700/50 rounded-lg transform rotate-x-12 rotate-y-12 shadow-2xl transition-transform duration-500 hover:rotate-0">
                    {/* Grid Floor */}
                    <div className="absolute bottom-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                    {/* Mock Architecture: Walls */}
                    {layers.find(l => l.id === 'arch')?.visible && (
                        <>
                            <div className="absolute bottom-10 left-10 w-4 h-40 bg-gray-400 opacity-80 shadow-lg border border-gray-300" />
                            <div className="absolute bottom-10 right-10 w-4 h-40 bg-gray-400 opacity-80 shadow-lg border border-gray-300" />
                            <div className="absolute bottom-10 left-10 w-[340px] h-4 bg-gray-400 opacity-80 border border-gray-300" />
                        </>
                    )}

                    {/* Mock Structure: Columns/Beams */}
                    {layers.find(l => l.id === 'struct')?.visible && (
                        <>
                            <div className="absolute bottom-10 left-12 w-2 h-40 bg-red-600 opacity-90" />
                            <div className="absolute bottom-10 right-12 w-2 h-40 bg-red-600 opacity-90" />
                            <div className="absolute top-10 left-10 w-[340px] h-2 bg-red-600 opacity-90" />
                        </>
                    )}

                    {/* Mock MEP: Ducts */}
                    {layers.find(l => l.id === 'mep')?.visible && (
                        <div className="absolute top-16 left-0 w-full h-6 bg-green-500/50 border-y border-green-400 flex items-center justify-center text-[10px] text-green-100 font-mono tracking-widest">
                            HVAC SUPPLY &gt;&gt;&gt;&gt;
                        </div>
                    )}

                    {/* Clash Indicator Mock */}
                    {clashes !== null && clashes > 0 && layers.find(l => l.id === 'mep')?.visible && layers.find(l => l.id === 'struct')?.visible && (
                        <div className="absolute top-16 right-12 w-6 h-6 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.8)] z-10" title="Clash #1" />
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge'; // Assuming badge exists or I'll remove if risky

// Mock Uniclass Data
const mockUniclass = [
    { code: 'Pr_70_60_36', title: 'Chillers' },
    { code: 'Pr_75_50_76', title: 'Pumps' },
    { code: 'Pr_65_70_00', title: 'Windows' },
];

type Attribute = { name: string; type: string; required: boolean };
type Asset = { uniclassCode: string; name: string; requiredAttributes: Attribute[] };

export function AIRWizard() {
    const [step, setStep] = useState(1);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [selectedCode, setSelectedCode] = useState('');

    // Attribute Builder State
    const [newAttr, setNewAttr] = useState<Attribute>({ name: '', type: 'String', required: true });

    const addAsset = () => {
        const uni = mockUniclass.find(u => u.code === selectedCode);
        if (!uni) return;

        setAssets([...assets, {
            uniclassCode: uni.code,
            name: uni.title,
            requiredAttributes: []
        }]);
        setSelectedCode('');
    };

    const addAttribute = (assetIndex: number) => {
        if (!newAttr.name) return;
        const newAssets = [...assets];
        newAssets[assetIndex].requiredAttributes.push({ ...newAttr });
        setAssets(newAssets);
        setNewAttr({ name: '', type: 'String', required: true });
    };

    const removeAsset = (index: number) => {
        setAssets(assets.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        console.log('Submitting AIR:', { assets });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>AIR Generator - Asset Information Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Asset Selection */}
                        <div className="flex gap-2 items-end">
                            <div className="flex-1">
                                <Label>Add Asset (Uniclass)</Label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={selectedCode}
                                    onChange={(e) => setSelectedCode(e.target.value)}
                                >
                                    <option value="">Select Asset Class...</option>
                                    {mockUniclass.map(u => (
                                        <option key={u.code} value={u.code}>{u.code} - {u.title}</option>
                                    ))}
                                </select>
                            </div>
                            <Button onClick={addAsset} disabled={!selectedCode}>Add</Button>
                        </div>

                        {/* Assets List */}
                        {assets.length === 0 ? (
                            <div className="text-center p-8 text-gray-500 border border-dashed rounded">
                                No assets defined. Add an asset to specify requirements.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {assets.map((asset, idx) => (
                                    <Card key={idx} className="bg-slate-50">
                                        <CardContent className="pt-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg">{asset.name}</h3>
                                                    <span className="text-sm text-gray-500">{asset.uniclassCode}</span>
                                                </div>
                                                <Button variant="destructive" size="sm" onClick={() => removeAsset(idx)}>Remove</Button>
                                            </div>

                                            {/* Attributes */}
                                            <div className="pl-4 border-l-2 border-slate-200">
                                                <h4 className="font-semibold text-sm mb-2">Required Attributes</h4>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {asset.requiredAttributes.map((attr, aIdx) => (
                                                        <span key={aIdx} className="bg-white px-2 py-1 rounded border text-sm flex items-center gap-1">
                                                            {attr.name} <span className="text-xs text-gray-400">({attr.type})</span>
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <Input
                                                        placeholder="New attribute name"
                                                        className="h-8 text-sm"
                                                        value={newAttr.name}
                                                        onChange={(e) => setNewAttr({ ...newAttr, name: e.target.value })}
                                                    />
                                                    <select
                                                        className="h-8 border rounded text-sm"
                                                        value={newAttr.type}
                                                        onChange={(e) => setNewAttr({ ...newAttr, type: e.target.value })}
                                                    >
                                                        <option value="String">String</option>
                                                        <option value="Date">Date</option>
                                                        <option value="Number">Number</option>
                                                        <option value="Boolean">Boolean</option>
                                                    </select>
                                                    <Button size="sm" onClick={() => addAttribute(idx)}>Add Attr</Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end mt-6">
                            <Button onClick={handleSubmit} disabled={assets.length === 0}>Generate AIR</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { assetService, Asset, AssetStatus } from '@/lib/api/asset.service';
import { Package, Tag, Calendar, PenTool as Tool, ShieldCheck } from 'lucide-react';

interface AssetPanelProps {
    projectId: string;
    elementGuid: string | null;
    isOpen: boolean;
}

export function AssetPanel({ projectId, elementGuid, isOpen }: AssetPanelProps) {
    const [asset, setAsset] = useState<Asset | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && projectId && elementGuid) {
            loadAsset();
        } else {
            setAsset(null);
        }
    }, [isOpen, elementGuid]);

    const loadAsset = async () => {
        setLoading(true);
        try {
            const data = await assetService.getAssetByGuid(projectId, elementGuid!);
            setAsset(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !elementGuid) return null;

    return (
        <Card className="absolute top-4 left-4 w-80 z-20 shadow-xl bg-white/95 backdrop-blur border-blue-100">
            <CardHeader className="py-3 border-b bg-blue-50/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    Asset Details
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {!asset ? (
                    <div className="text-center py-6">
                        <p className="text-xs text-gray-500 mb-2">No asset record found for this element.</p>
                        <button className="text-xs text-blue-600 font-medium hover:underline">+ Create Asset Record</button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-slate-900">{asset.name}</h4>
                                <p className="text-[10px] text-gray-500 font-mono">{asset.tagNumber || 'No Tag'}</p>
                            </div>
                            <StatusBadge status={asset.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                            <div className="space-y-1">
                                <span className="text-gray-500 block">Category</span>
                                <span className="font-medium flex items-center gap-1"><Tag className="w-3 h-3" /> {asset.category}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-gray-500 block">Location</span>
                                <span className="font-medium">{asset.location || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500 flex items-center gap-1"><Tool className="w-3 h-3" /> Manufacturer</span>
                                <span className="font-medium">{asset.manufacturer || '-'}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Warranty</span>
                                <span className="font-medium">{asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toLocaleDateString() : '-'}</span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: AssetStatus }) {
    const colors: any = {
        ORDERED: "bg-blue-100 text-blue-700",
        IN_TRANSIT: "bg-orange-100 text-orange-700",
        DELIVERED: "bg-purple-100 text-purple-700",
        INSTALLED: "bg-cyan-100 text-cyan-700",
        COMMISSIONED: "bg-green-100 text-green-700",
        MAINTENANCE: "bg-red-100 text-red-700",
    };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
}

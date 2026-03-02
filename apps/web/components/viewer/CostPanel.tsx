import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { costService, BillOfQuantities, BoQItem, CostMapping } from '@/lib/api/cost.service';
import { Plus, Link as LinkIcon, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface CostPanelProps {
    projectId: string;
    modelId: string;
    selectedElementGuid: string | null;
    isOpen: boolean;
    onMappingCreated?: () => void;
    onHighlightElements?: (guids: string[]) => void;
}

export function CostPanel({ projectId, modelId, selectedElementGuid, isOpen, onMappingCreated, onHighlightElements }: CostPanelProps) {
    const [boqs, setBoqs] = useState<BillOfQuantities[]>([]);
    const [selectedBoqId, setSelectedBoqId] = useState<string | null>(null);
    const [items, setItems] = useState<BoQItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && projectId) {
            loadBoqs();
        }
    }, [isOpen, projectId]);

    useEffect(() => {
        if (selectedBoqId) {
            loadItems(selectedBoqId);
        } else {
            setItems([]);
        }
    }, [selectedBoqId]);

    const loadBoqs = async () => {
        setLoading(true);
        try {
            const data = await costService.getBoqs(projectId);
            setBoqs(data);
            if (data.length > 0 && !selectedBoqId) {
                setSelectedBoqId(data[0].id);
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to load BoQs");
        } finally {
            setLoading(false);
        }
    };

    const loadItems = async (boqId: string) => {
        setLoading(true);
        try {
            const data = await costService.getItems(projectId, boqId);
            setItems(data);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load items");
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = (item: BoQItem) => {
        setSelectedItemId(item.id);
        if (onHighlightElements && item.mappings) {
            const guids = item.mappings.map(m => m.elementGuid);
            onHighlightElements(guids);
        }
    };

    const handleLink = async (item: BoQItem) => {
        if (!selectedElementGuid) {
            toast.error("Select an element in 3D view first");
            return;
        }
        try {
            await costService.mapItem(projectId, item.id, selectedElementGuid, modelId);
            toast.success(`Linked ${item.description} to element`);
            loadItems(selectedBoqId!); // Reload to update mappings count
            if (onMappingCreated) onMappingCreated();
        } catch (e) {
            console.error(e);
            toast.error("Failed to link");
        }
    };

    if (!isOpen) return null;

    return (
        <Card className="absolute top-4 right-4 w-[400px] h-[calc(100vh-100px)] flex flex-col z-20 shadow-xl bg-white/95 backdrop-blur">
            <CardHeader className="py-3 border-b bg-gray-50/50">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-semibold flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        5D Cost Estimation
                    </CardTitle>
                    <select
                        className="text-sm border rounded px-2 py-1"
                        value={selectedBoqId || ''}
                        onChange={(e) => setSelectedBoqId(e.target.value)}
                    >
                        <option value="">Select BoQ</option>
                        {boqs.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
                {items.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        {loading ? 'Loading...' : 'No items found. Create a BoQ first.'}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Code</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Cost</TableHead>
                                <TableHead className="w-[40px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map(item => {
                                const isSelected = selectedItemId === item.id;
                                const mappingCount = item.mappings?.length || 0;
                                return (
                                    <TableRow
                                        key={item.id}
                                        className={`cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <TableCell className="font-mono text-xs">{item.itemCode || '-'}</TableCell>
                                        <TableCell className="text-xs">
                                            <div className="font-medium flex items-center gap-2">
                                                {item.description}
                                                {mappingCount > 0 && (
                                                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded">
                                                        {mappingCount} linked
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-gray-500">{item.quantity} {item.unit} @ {item.unitRate}</div>
                                        </TableCell>
                                        <TableCell className="text-right text-xs font-medium">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.amount)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-6 w-6 hover:bg-blue-100 text-blue-600"
                                                title="Link Selected Element"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLink(item);
                                                }}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}


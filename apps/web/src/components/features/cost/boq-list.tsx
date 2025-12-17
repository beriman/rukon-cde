"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BoqItem {
    id: string;
    itemCode: string;
    description: string;
    unit: string;
    quantity: number;
    unitRate: number;
    amount: number;
}

interface Boq {
    id: string;
    name: string;
    currency: string;
    items?: BoqItem[];
}

interface BoqListProps {
    projectId: string;
    refreshTrigger: number;
}

export function BoqList({ projectId, refreshTrigger }: BoqListProps) {
    const [boqs, setBoqs] = useState<Boq[]>([]);
    const [selectedBoq, setSelectedBoq] = useState<string | null>(null);
    const [items, setItems] = useState<BoqItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBoqs = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/cost/boq`);
                setBoqs(res.data);
                if (res.data.length > 0 && !selectedBoq) {
                    setSelectedBoq(res.data[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch BoQs", error);
            }
        };
        fetchBoqs();
    }, [projectId, refreshTrigger]);

    useEffect(() => {
        if (!selectedBoq) return;
        const fetchItems = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/cost/boq/${selectedBoq}`);
                setItems(res.data.items || []);
            } catch (error) {
                console.error("Failed to fetch BoQ items", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [selectedBoq, projectId]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {/* List of BoQs */}
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle className="text-sm">Available BoQs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[300px]">
                        {boqs.map(boq => (
                            <div
                                key={boq.id}
                                onClick={() => setSelectedBoq(boq.id)}
                                className={`p-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-sm ${selectedBoq === boq.id ? 'bg-slate-100 dark:bg-slate-800 font-medium' : ''}`}
                            >
                                {boq.name}
                            </div>
                        ))}
                        {boqs.length === 0 && <div className="p-4 text-xs text-muted-foreground text-center">No BoQs found</div>}
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Selected BoQ Content */}
            <Card className="md:col-span-2 h-full flex flex-col">
                <CardHeader className="py-2 border-b">
                    <CardTitle className="text-sm">BoQ Details</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <ScrollArea className="h-full max-h-[400px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Code</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Unit</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Rate</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono text-xs">{item.itemCode}</TableCell>
                                            <TableCell className="text-xs">{item.description}</TableCell>
                                            <TableCell className="text-right text-xs">{item.unit}</TableCell>
                                            <TableCell className="text-right text-xs">{item.quantity}</TableCell>
                                            <TableCell className="text-right text-xs">{item.unitRate.toLocaleString()}</TableCell>
                                            <TableCell className="text-right text-xs font-medium">{item.amount.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-xs py-8 text-muted-foreground">Select a BoQ to view items</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

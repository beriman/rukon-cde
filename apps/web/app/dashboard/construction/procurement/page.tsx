'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, TrendingUp, Upload, Loader2 } from 'lucide-react';

type ProcurementStatus = 'ORDERED' | 'MANUFACTURED' | 'SHIPPING' | 'ON_SITE' | 'INSTALLED';

interface ProcurementItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    status: ProcurementStatus;
    supplier: string;
    deliveryDate: string;
}

interface BQSummary {
    totalPlanned: number;
    totalActual: number;
    variance: number;
    variancePercent: number;
}

const statusColumns: ProcurementStatus[] = ['ORDERED', 'MANUFACTURED', 'SHIPPING', 'ON_SITE', 'INSTALLED'];

const statusColors: Record<ProcurementStatus, string> = {
    ORDERED: 'bg-blue-100 text-blue-800',
    MANUFACTURED: 'bg-purple-100 text-purple-800',
    SHIPPING: 'bg-yellow-100 text-yellow-800',
    ON_SITE: 'bg-green-100 text-green-800',
    INSTALLED: 'bg-gray-100 text-gray-800',
};

export default function ProcurementPage({ params }: { params: { projectId: string } }) {
    const [items, setItems] = useState<ProcurementItem[]>([]);
    const [bqSummary, setBqSummary] = useState<BQSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const projectId = params.projectId || 'demo-project-1';

    // Fetch items from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [itemsRes, summaryRes] = await Promise.all([
                    fetch(`/api/construction/procurement/${projectId}/items`),
                    fetch(`/api/construction/procurement/${projectId}/bq-summary`)
                ]);

                if (itemsRes.ok) {
                    const itemsData = await itemsRes.json();
                    setItems(itemsData);
                }

                if (summaryRes.ok) {
                    const summaryData = await summaryRes.json();
                    setBqSummary(summaryData);
                }
            } catch (err) {
                setError('Failed to load data');
                console.error('Error fetching procurement data:', err);
                // Fallback to demo data
                setItems([
                    { id: '1', name: 'Steel Beams - W14x30', quantity: 50, unit: 'pcs', status: 'SHIPPING', supplier: 'PT Steel', deliveryDate: '2025-12-15' },
                    { id: '2', name: 'Elevator System', quantity: 2, unit: 'unit', status: 'MANUFACTURED', supplier: 'Otis', deliveryDate: '2025-12-20' },
                ]);
                setBqSummary({
                    totalPlanned: 2000000,
                    totalActual: 2100000,
                    variance: 100000,
                    variancePercent: 5,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    const moveItem = async (itemId: string, newStatus: ProcurementStatus) => {
        try {
            const response = await fetch(`/api/construction/procurement/items/${itemId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setItems(items.map(item =>
                    item.id === itemId ? { ...item, status: newStatus } : item
                ));
            }
        } catch (err) {
            console.error('Error updating status:', err);
            // Fallback to optimistic update
            setItems(items.map(item =>
                item.id === itemId ? { ...item, status: newStatus } : item
            ));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Procurement & BQ Monitoring</h1>
                <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV
                </Button>
            </div>

            {error && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded">
                    {error} - Showing demo data
                </div>
            )}

            <Tabs defaultValue="kanban">
                <TabsList>
                    <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
                    <TabsTrigger value="bq">Bill of Quantities</TabsTrigger>
                </TabsList>

                <TabsContent value="kanban" className="space-y-4">
                    <div className="grid grid-cols-5 gap-4">
                        {statusColumns.map(status => (
                            <Card key={status}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">
                                        {status.replace('_', ' ')}
                                    </CardTitle>
                                    <Badge className={statusColors[status]}>
                                        {items.filter(i => i.status === status).length} items
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {items.filter(item => item.status === status).map(item => (
                                        <Card key={item.id} className="cursor-move hover:shadow-md transition-shadow">
                                            <CardContent className="pt-4 pb-3">
                                                <div className="flex items-start gap-2">
                                                    <Package className="w-4 h-4 text-gray-500 mt-1" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-sm truncate">{item.name}</p>
                                                        <p className="text-xs text-gray-500">{item.quantity} {item.unit}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{item.supplier}</p>
                                                        <p className="text-xs text-gray-400">{item.deliveryDate}</p>
                                                    </div>
                                                </div>
                                                {status !== 'INSTALLED' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="w-full mt-2 text-xs"
                                                        onClick={() => {
                                                            const currentIndex = statusColumns.indexOf(status);
                                                            if (currentIndex < statusColumns.length - 1) {
                                                                moveItem(item.id, statusColumns[currentIndex + 1]);
                                                            }
                                                        }}
                                                    >
                                                        Move to {statusColumns[statusColumns.indexOf(status) + 1]?.replace('_', ' ')}
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="bq" className="space-y-4">
                    {bqSummary && (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Planned</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">${bqSummary.totalPlanned.toLocaleString()}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Actual</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">${bqSummary.totalActual.toLocaleString()}</div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Variance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${bqSummary.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {bqSummary.variance > 0 ? '+' : ''}\${bqSummary.variance.toLocaleString()}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Variance %</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${bqSummary.variancePercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {bqSummary.variancePercent > 0 ? '+' : ''}{bqSummary.variancePercent}%
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
